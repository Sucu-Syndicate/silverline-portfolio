'use client';

import { useState, useEffect, useCallback } from 'react';

interface GHCommit {
  sha: string;
  commit: {
    message: string;
    author: { date: string };
  };
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}.${m}.${day}`;
}

function stripTaskPrefix(msg: string): string {
  return msg.replace(/^\[PTASK-\d+\]\s*/, '').split('\n')[0];
}

/* ─── Changelog overlay ─── */
function ChangelogOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [commits, setCommits] = useState<GHCommit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const fetchCommits = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const res = await fetch('/api/changelog');
      if (!res.ok) throw new Error('non-200');
      const data: GHCommit[] = await res.json();
      setCommits(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    if (commits.length === 0 && !loading) fetchCommits();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, commits.length, loading, fetchCommits]);

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
          {loading && (
            <div className="cl-state">fetching commit history<span className="cl-blink">_</span></div>
          )}
          {error && (
            <div className="cl-state cl-error">
              {'>'} ERR github api unreachable — try again later
            </div>
          )}
          {!loading && !error && commits.map((c) => (
            <div key={c.sha} className="cl-row">
              <span className="cl-date">{formatDate(c.commit.author.date)}</span>
              <span className="cl-msg">{stripTaskPrefix(c.commit.message)}</span>
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
      'requesting meatspace interaction',
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
