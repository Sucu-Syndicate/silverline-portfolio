import { STREAM_ENABLED } from '@/lib/stream-config'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(_request: NextRequest) {
  if (!STREAM_ENABLED) {
    return new NextResponse('Stream unavailable.', { status: 403 })
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/broadcast', '/watch'],
}
