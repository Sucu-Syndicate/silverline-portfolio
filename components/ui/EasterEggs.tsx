'use client';

import { useState, useEffect } from 'react';

/* ─── Changelog overlay ─── */
function ChangelogOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const entries: [string, string][] = [
    ['2026.05.06', 'Hero terminal ships. Five variants live behind a tweak panel.'],
    ['2026.05.05', 'Design system v2 locked. Two-register typography. Forest green earned its place.'],
    ['2026.05.02', 'Killed Playfair. Killed gold. Erased the April direction.'],
    ['2026.04.28', 'Velvet VARRO scaffolds wired into Obsidian.'],
    ['2026.04.18', 'matheog.com domain secured ($10).'],
    ['2026.04.10', '/grill-me protocol formalized. First clean checkpoint.'],
  ];

  return (
    <div className={`changelog${open ? ' open' : ''}`} onClick={onClose}>
      <div className="changelog-card" onClick={(e) => e.stopPropagation()}>
        <h2>~/changelog</h2>
        <p className="note">
          ↑↑↓↓←→←→ba — you found it. these are the receipts.
        </p>
        {entries.map(([d, t]) => (
          <div key={d} className="cl-row">
            <span className="cl-date">{d}</span>
            <span>{t}</span>
          </div>
        ))}
        <div className="close-hint">esc to close</div>
      </div>
    </div>
  );
}

/* ─── Main EasterEggs component ─── */
export default function EasterEggs() {
  const [changelogOpen, setChangelogOpen] = useState(false);

  // Cursor trail — hero only
  useEffect(() => {
    const N = 6;
    const dots: { el: HTMLDivElement; x: number; y: number }[] = [];
    for (let i = 0; i < N; i++) {
      const d = document.createElement('div');
      d.className = 'cursor-dot';
      d.style.opacity = String(0.55 - i * 0.08);
      d.style.transform = `translate(-100px, -100px) scale(${1 - i * 0.12})`;
      document.body.appendChild(d);
      dots.push({ el: d, x: -100, y: -100 });
    }

    let mx = -100, my = -100;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      const heroEl = document.getElementById('hero');
      if (!heroEl) return;
      const r = heroEl.getBoundingClientRect();
      const inHero = my >= r.top && my <= r.bottom;
      const nearTop = inHero && my < r.top + 200;
      const coordsEl = document.getElementById('hero-coords');
      if (coordsEl) {
        if (nearTop) coordsEl.classList.add('show');
        else coordsEl.classList.remove('show');
      }
      dots.forEach((d, i) => {
        d.el.style.opacity = inHero ? String(0.55 - i * 0.08) : '0';
      });
    };

    let raf: number;
    const tick = () => {
      let px = mx, py = my;
      dots.forEach((d) => {
        d.x += (px - d.x) * 0.35;
        d.y += (py - d.y) * 0.35;
        d.el.style.transform = `translate(${d.x - 3}px, ${d.y - 3}px)`;
        px = d.x;
        py = d.y;
      });
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMove);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(raf);
      dots.forEach((d) => d.el.remove());
    };
  }, []);

  // Konami sequence → changelog
  useEffect(() => {
    const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let buffer: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      buffer.push(e.key);
      if (buffer.length > KONAMI.length) buffer.shift();
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        setChangelogOpen((v) => !v);
        buffer = [];
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Idle 4s → coords reveal
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const el = document.getElementById('hero-coords');
        if (el) el.classList.add('show');
      }, 4000);
    };
    const onAct = () => {
      const el = document.getElementById('hero-coords');
      if (el) el.classList.remove('show');
      arm();
    };
    arm();
    window.addEventListener('mousemove', onAct);
    window.addEventListener('scroll', onAct);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', onAct);
      window.removeEventListener('scroll', onAct);
    };
  }, []);

  return (
    <ChangelogOverlay
      open={changelogOpen}
      onClose={() => setChangelogOpen(false)}
    />
  );
}
