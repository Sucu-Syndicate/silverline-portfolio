import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          background: '#0F100E',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, sans-serif',
          fontSize: 21,
          fontWeight: 800,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        <span style={{ color: '#E8E6DD' }}>m</span>
        <span style={{ color: '#5DA67A' }}>.</span>
      </div>
    ),
    { ...size }
  );
}
