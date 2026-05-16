'use client';

import { useState, useEffect } from 'react';
import { CHANGELOG } from '@/lib/changelog';

function formatDate(date: string): string {
  return date.replace(/-/g, '.');
}

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

  return (
    <div className={`changelog${open ? ' open' : ''}`} onClick={onClose}>
      <div className="changelog-card" onClick={(e) => e.stopPropagation()}>
        <div className="cl-header">
          <h2>~/changelog</h2>
          <p className="note">
            Tracing code ancestry, take a scroll through the commit trail for this very site
          </p>
        </div>

        <div className="cl-body">
          {CHANGELOG.map((entry) => (
            <div key={entry.sha} className="cl-row">
              <span className="cl-date">{formatDate(entry.date)}</span>
              <span className="cl-msg">
                {entry.message.replace(/^\[PTASK-\d+\]\s*/, '') !== entry.message && (
                  <span className="cl-tag">{entry.message.match(/^\[PTASK-\d+\]/)?.[0]}</span>
                )}{' '}
                {entry.message.replace(/^\[PTASK-\d+\]\s*/, '')}
              </span>
              <span className="cl-sha">{entry.sha}</span>
            </div>
          ))}
        </div>

        <div className="cl-footer">
          <span className="close-hint">esc to close</span>
        </div>
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
      'admiring hero terminal and animations',
      'consulting the carbon unit',
      'awaiting divine keystrokes',
      'human your turn',
      'please rotate your consciousness toward the mouse',
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
