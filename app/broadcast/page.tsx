'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'
import {
  createSignalingChannel,
  type SignalingChannel,
  type SignalMessage,
} from '@/lib/stream-signaling'

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type BroadcastState = 'idle' | 'capturing' | 'broadcasting' | 'stopped'

export default function BroadcastPage() {
  const [state, setState] = useState<BroadcastState>('idle')
  const [viewerCount, setViewerCount] = useState(0)
  const [statusMsg, setStatusMsg] = useState('')

  const videoRef = useRef<HTMLVideoElement>(null)
  const combinedStreamRef = useRef<MediaStream | null>(null)
  const peersRef = useRef<Map<string, RTCPeerConnection>>(new Map())
  const signalingRef = useRef<SignalingChannel | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const stopBroadcast = useCallback(() => {
    signalingRef.current?.send({ type: 'broadcaster-gone' })
    signalingRef.current?.destroy()
    signalingRef.current = null

    peersRef.current.forEach((pc) => pc.close())
    peersRef.current.clear()
    setViewerCount(0)

    combinedStreamRef.current?.getTracks().forEach((t) => t.stop())
    combinedStreamRef.current = null

    audioCtxRef.current?.close()
    audioCtxRef.current = null

    if (videoRef.current) videoRef.current.srcObject = null

    setState('stopped')
    setStatusMsg('Broadcast ended.')
  }, [])

  useEffect(() => {
    return () => {
      stopBroadcast()
    }
  }, [stopBroadcast])

  async function captureMedia() {
    setState('capturing')
    setStatusMsg('')

    let screenStream: MediaStream
    try {
      screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'monitor' } as MediaTrackConstraints,
        audio: true,
      })
    } catch {
      setState('idle')
      setStatusMsg('Screen share cancelled or denied. Try again.')
      return
    }

    let micStream: MediaStream
    try {
      micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch {
      screenStream.getTracks().forEach((t) => t.stop())
      setState('idle')
      setStatusMsg('Mic access denied.')
      return
    }

    const ctx = new AudioContext()
    audioCtxRef.current = ctx
    const dest = ctx.createMediaStreamDestination()

    if (screenStream.getAudioTracks().length > 0) {
      ctx.createMediaStreamSource(screenStream).connect(dest)
    }
    ctx.createMediaStreamSource(micStream).connect(dest)

    const combined = new MediaStream([
      ...screenStream.getVideoTracks(),
      ...dest.stream.getAudioTracks(),
    ])

    combinedStreamRef.current = combined

    if (videoRef.current) {
      videoRef.current.srcObject = combined
    }

    screenStream.getVideoTracks()[0]?.addEventListener('ended', stopBroadcast)

    setState('capturing')
    setStatusMsg('Ready. Click \u201cStart Broadcast\u201d when ready.')
  }

  async function startBroadcast() {
    if (!combinedStreamRef.current) return
    setState('broadcasting')
    setStatusMsg('Waiting for viewers to join...')

    const signaling = createSignalingChannel(supabase)
    signalingRef.current = signaling

    signaling.onMessage(async (msg: SignalMessage) => {
      if (msg.type === 'viewer-join') {
        const { viewerId } = msg
        const pc = new RTCPeerConnection(RTC_CONFIG)
        peersRef.current.set(viewerId, pc)
        setViewerCount(peersRef.current.size)

        combinedStreamRef.current!.getTracks().forEach((track) => {
          pc.addTrack(track, combinedStreamRef.current!)
        })

        pc.onicecandidate = ({ candidate }) => {
          if (candidate) {
            signaling.send({
              type: 'ice-candidate',
              viewerId,
              candidate: candidate.toJSON(),
            })
          }
        }

        pc.onconnectionstatechange = () => {
          if (
            pc.connectionState === 'disconnected' ||
            pc.connectionState === 'failed' ||
            pc.connectionState === 'closed'
          ) {
            pc.close()
            peersRef.current.delete(viewerId)
            setViewerCount(peersRef.current.size)
          }
        }

        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)
        signaling.send({ type: 'offer', viewerId, sdp: offer })
      }

      if (msg.type === 'answer') {
        const pc = peersRef.current.get(msg.viewerId)
        if (pc && pc.signalingState === 'have-local-offer') {
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        }
      }

      if (msg.type === 'ice-candidate') {
        const pc = peersRef.current.get(msg.viewerId)
        if (pc) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(msg.candidate))
          } catch {
            // candidate may arrive before remote description — safe to ignore
          }
        }
      }

      if (msg.type === 'viewer-leave') {
        const pc = peersRef.current.get(msg.viewerId)
        if (pc) {
          pc.close()
          peersRef.current.delete(msg.viewerId)
          setViewerCount(peersRef.current.size)
        }
      }
    })
  }

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <h1
        className="text-2xl font-bold mb-8"
        style={{ fontFamily: 'var(--font-structure)' }}
      >
        Broadcast
      </h1>

      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        className="w-full rounded-lg bg-black mb-6 aspect-video object-contain"
      />

      <div className="flex gap-3 mb-4">
        {(state === 'idle' || state === 'stopped') && (
          <button
            onClick={captureMedia}
            className="px-4 py-2 bg-white text-black rounded font-medium hover:bg-neutral-200 transition-colors"
          >
            {state === 'stopped' ? 'New Broadcast' : 'Get Screen'}
          </button>
        )}
        {state === 'capturing' && (
          <button
            onClick={startBroadcast}
            className="px-4 py-2 bg-white text-black rounded font-medium hover:bg-neutral-200 transition-colors"
          >
            Start Broadcast
          </button>
        )}
        {state === 'broadcasting' && (
          <button
            onClick={stopBroadcast}
            className="px-4 py-2 bg-red-600 text-white rounded font-medium hover:bg-red-700 transition-colors"
          >
            Stop Broadcast
          </button>
        )}
      </div>

      {state === 'broadcasting' && (
        <p
          className="text-sm text-neutral-400 mb-2"
          style={{ fontFamily: 'var(--font-mono)' }}
        >
          {viewerCount} viewer{viewerCount !== 1 ? 's' : ''} connected
        </p>
      )}

      {statusMsg && (
        <p
          className="text-sm text-neutral-400"
          style={{ fontFamily: 'var(--font-reading)' }}
        >
          {statusMsg}
        </p>
      )}
    </main>
  )
}
