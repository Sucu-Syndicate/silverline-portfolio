'use client';

import { useEffect, useRef } from 'react';

const SAMPLE = 60; // rolling window size

export default function FPSCounter() {
  const elFps  = useRef<HTMLSpanElement>(null);
  const elMs   = useRef<HTMLSpanElement>(null);
  const elBar  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const times: number[] = [];
    let last = performance.now();
    let raf  = 0;

    const tick = (now: number) => {
      const delta = now - last;
      last = now;

      times.push(delta);
      if (times.length > SAMPLE) times.shift();

      const avgMs  = times.reduce((a, b) => a + b, 0) / times.length;
      const fps    = Math.round(1000 / avgMs);
      const ms     = avgMs.toFixed(1);

      // Colour: green ≥ 55, yellow ≥ 40, red below
      const colour =
        fps >= 55 ? '#5DA67A' :
        fps >= 40 ? '#c4a265' :
                   '#c97070';

      if (elFps.current)  { elFps.current.textContent  = String(fps);  elFps.current.style.color  = colour; }
      if (elMs.current)   { elMs.current.textContent   = ms + 'ms'; }
      // bar = % of 60fps budget used (16.67ms per frame)
      if (elBar.current)  {
        const pct = Math.min(100, (avgMs / 16.67) * 100);
        elBar.current.style.width      = pct + '%';
        elBar.current.style.background = colour;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div style={{
      position:   'fixed',
      bottom:     '24px',
      right:      '24px',
      zIndex:     9999,
      background: 'rgba(15,16,14,0.88)',
      border:     '1px solid #2A2C26',
      backdropFilter: 'blur(8px)',
      padding:    '10px 14px',
      fontFamily: 'var(--font-mono)',
      fontSize:   '11px',
      letterSpacing: '0.04em',
      minWidth:   '100px',
      userSelect: 'none',
      pointerEvents: 'none',
    }}>
      {/* FPS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px' }}>
        <span style={{ color: '#6E7068' }}>FPS</span>
        <span ref={elFps} style={{ fontSize: '18px', fontWeight: 700, color: '#5DA67A', lineHeight: 1 }}>—</span>
      </div>

      {/* Frame time */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
        <span style={{ color: '#6E7068' }}>ms</span>
        <span ref={elMs} style={{ color: '#B8B6AD' }}>—</span>
      </div>

      {/* Budget bar — 100% = 16.67ms (60fps budget) */}
      <div style={{
        marginTop:    '8px',
        height:       '3px',
        background:   '#2A2C26',
        borderRadius: '999px',
        overflow:     'hidden',
      }}>
        <div ref={elBar} style={{
          height:       '100%',
          width:        '0%',
          borderRadius: '999px',
          transition:   'width 0.1s ease',
        }} />
      </div>
      <div style={{ marginTop: '3px', color: '#6E7068', fontSize: '9px', textAlign: 'right', letterSpacing: '0.06em' }}>
        60FPS BUDGET
      </div>
    </div>
  );
}
