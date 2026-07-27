import type { SupabaseClient, RealtimeChannel } from '@supabase/supabase-js'

export type SignalMessage =
  | { type: 'viewer-join'; viewerId: string }
  | { type: 'offer'; viewerId: string; sdp: RTCSessionDescriptionInit }
  | { type: 'answer'; viewerId: string; sdp: RTCSessionDescriptionInit }
  | { type: 'ice-candidate'; viewerId: string; candidate: RTCIceCandidateInit }
  | { type: 'viewer-leave'; viewerId: string }
  | { type: 'broadcaster-gone' }

export interface SignalingChannel {
  send: (msg: SignalMessage) => Promise<void>
  onMessage: (handler: (msg: SignalMessage) => void) => void
  destroy: () => Promise<void>
}

export function createSignalingChannel(
  supabase: SupabaseClient,
  onReady?: () => void
): SignalingChannel {
  let handler: ((msg: SignalMessage) => void) | null = null

  const channel: RealtimeChannel = supabase
    .channel('webrtc-signals', {
      config: { broadcast: { self: false } },
    })
    .on('broadcast', { event: 'signal' }, ({ payload }) => {
      if (handler) handler(payload as SignalMessage)
    })
    .subscribe((status) => {
      if (status === 'SUBSCRIBED') onReady?.()
    })

  return {
    async send(msg: SignalMessage) {
      await channel.send({ type: 'broadcast', event: 'signal', payload: msg })
    },
    onMessage(h) {
      handler = h
    },
    async destroy() {
      await supabase.removeChannel(channel)
    },
  }
}
