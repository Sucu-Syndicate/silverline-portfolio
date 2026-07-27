'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { createSignalingChannel, type SignalMessage } from '@/lib/stream-signaling'

const RTC_CONFIG: RTCConfiguration = {
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type WatchState = 'connecting' | 'waiting' | 'receiving' | 'ended' | 'error'

export default function WatchPage() {
  const [state, setState] = useState<WatchState>('connecting')
  const [statusMsg, setStatusMsg] = useState('Connecting to signaling server...')

  const videoRef = useRef<HTMLVideoElement>(null)
  const pcRef = useRef<RTCPeerConnection | null>(null)
  const signalingRef = useRef<ReturnType<typeof createSignalingChannel> | null>(null)
  const offerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const viewerIdRef = useRef(crypto.randomUUID())

  useEffect(() => {
    const signaling = createSignalingChannel(supabase, () => {
      signaling.send({ type: 'viewer-join', viewerId: viewerIdRef.current })
      setState('waiting')
      setStatusMsg('Waiting for broadcast to start...')

      offerTimeoutRef.current = setTimeout(() => {
        setState('waiting')
        setStatusMsg('No broadcast active right now. Refresh to try again.')
      }, 5000)
    })
    signalingRef.current = signaling

    signaling.onMessage(async (msg: SignalMessage) => {
      if (msg.type === 'offer' && msg.viewerId === viewerIdRef.current) {
        if (offerTimeoutRef.current) {
          clearTimeout(offerTimeoutRef.current)
          offerTimeoutRef.current = null
        }

        setState('receiving')
        setStatusMsg('')

        const pc = new RTCPeerConnection(RTC_CONFIG)
        pcRef.current = pc

        pc.ontrack = ({ streams }) => {
          if (videoRef.current && streams[0]) {
            videoRef.current.srcObject = streams[0]
          }
        }

        pc.onicecandidate = ({ candidate }) => {
          if (candidate) {
            signaling.send({
              type: 'ice-candidate',
              viewerId: viewerIdRef.current,
              candidate: candidate.toJSON(),
            })
          }
        }

        pc.onconnectionstatechange = () => {
          if (pc.connectionState === 'failed') {
            setState('error')
            setStatusMsg(
              'Connection failed \u2014 this can happen across some networks. Try refreshing.'
            )
          }
        }

        await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp))
        const answer = await pc.createAnswer()
        await pc.setLocalDescription(answer)
        signaling.send({ type: 'answer', viewerId: viewerIdRef.current, sdp: answer })
      }

      if (msg.type === 'ice-candidate' && msg.viewerId === viewerIdRef.current) {
        try {
          await pcRef.current?.addIceCandidate(new RTCIceCandidate(msg.candidate))
        } catch {
          // safe to ignore
        }
      }

      if (msg.type === 'broadcaster-gone') {
        if (offerTimeoutRef.current) {
          clearTimeout(offerTimeoutRef.current)
          offerTimeoutRef.current = null
        }
        setState('ended')
        setStatusMsg('Broadcast ended.')
        if (videoRef.current) videoRef.current.srcObject = null
      }
    })

    return () => {
      if (offerTimeoutRef.current) clearTimeout(offerTimeoutRef.current)
      signaling.send({ type: 'viewer-leave', viewerId: viewerIdRef.current })
      pcRef.current?.close()
      signaling.destroy()
    }
  }, [])

  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <h1
        className="text-2xl font-bold mb-8"
        style={{ fontFamily: 'var(--font-structure)' }}
      >
        Watch
      </h1>

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full rounded-lg bg-black mb-6 aspect-video object-contain"
        style={{ display: state === 'receiving' ? 'block' : 'none' }}
      />

      {state !== 'receiving' && (
        <div className="w-full aspect-video bg-neutral-900 rounded-lg mb-6 flex items-center justify-center">
          <p
            className="text-neutral-500 text-sm text-center px-4"
            style={{ fontFamily: 'var(--font-reading)' }}
          >
            {statusMsg}
          </p>
        </div>
      )}

      {(state === 'waiting' || state === 'ended' || state === 'error') && (
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-white text-black rounded font-medium hover:bg-neutral-200 transition-colors"
        >
          Refresh
        </button>
      )}
    </main>
  )
}
