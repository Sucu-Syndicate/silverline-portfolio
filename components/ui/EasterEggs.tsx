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


  // Ctrl+C × 3 within 1.5s → changelog
  useEffect(() => {
    const presses: number[] = [];
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'c' && e.ctrlKey) {
        const now = Date.now();
        presses.push(now);
        while (presses.length > 3) presses.shift();
        if (presses.length === 3 && now - presses[0] < 1500) {
          setChangelogOpen((v) => !v);
          presses.length = 0;
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Idle → coords reveal with random message
  useEffect(() => {
    const IDLE_MESSAGES = [
      'summoning human wisdom',
      'waiting for organic keyboard activity',
      'requesting meatspace interaction',
      'consulting the carbon unit',
      'awaiting divine keystrokes',
      'listening for clacky-clacky sounds',
      'human your turn',
      'please rotate your consciousness toward the keyboard',
    ];

    let timer: ReturnType<typeof setTimeout>;
    const arm = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        const el = document.getElementById('hero-coords');
        const msg = document.getElementById('hero-coords-msg');
        if (msg) msg.textContent = IDLE_MESSAGES[Math.floor(Math.random() * IDLE_MESSAGES.length)];
        if (el) el.classList.add('show');
      }, 15000);
    };
    const onAct = () => {
      const el = document.getElementById('hero-coords');
      if (el) el.classList.remove('show');
      arm();
    };
    arm();
    window.addEventListener('mousemove', onAct);
    window.addEventListener('scroll', onAct);
    window.addEventListener('touchstart', onAct);
    window.addEventListener('touchmove', onAct);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('mousemove', onAct);
      window.removeEventListener('scroll', onAct);
      window.removeEventListener('touchstart', onAct);
      window.removeEventListener('touchmove', onAct);
    };
  }, []);

  return (
    <ChangelogOverlay
      open={changelogOpen}
      onClose={() => setChangelogOpen(false)}
    />
  );
}
