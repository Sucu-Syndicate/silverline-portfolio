'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TERMINAL_LINES, type TerminalLine } from '@/lib/terminal-lines';

const TICK_MIN = 700;
const TICK_MAX = 1800;
const MAX_LINES = 30;

const MARKERS: Record<string, string> = {
  commit: '◇',
  build: '▸',
  ship: '↑',
  think: '~',
  note: '·',
};

const QUOTES = [
  '"Nobody hates the good ones, they hate the great ones" — Kobe Bryant',
  '"The worst thing I can be is the same as everybody else" — Arnold Schwarzenegger',
  '"The world offers you comfort but you were not made for comfort, you were made for greatness" — Pope Benedict XVI',
  '"You have power over your mind, not outside events" — Marcus Aurelius',
  '"Don\'t worry about your individual potential. You\'ll never know how great you might\'ve become unless you try." — Mike Metzner',
  '"A man cannot remake himself without suffering, for he is both the marble and the sculptor" — Alexis Carrel',
];

function pad(n: number) {
  return String(n).padStart(2, '0');
}

function nowTs() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

interface LiveLine extends TerminalLine {
  ts: string;
  id: number;
  fresh: boolean;
}

function HeroLog() {
  const [lines, setLines] = useState<LiveLine[]>([]);

  useEffect(() => {
    const seed: LiveLine[] = [];
    for (let i = 0; i < MAX_LINES; i++) {
      const l = pickRandom(TERMINAL_LINES);
      if (!l) break;
      seed.push({ ...l, ts: nowTs(), id: Math.random() + i, fresh: false });
    }
    setLines(seed);

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      setLines((prev) => {
        const pick = pickRandom(TERMINAL_LINES);
        const next = [
          ...prev.map((l) => ({ ...l, fresh: false })),
          { ...pick, ts: nowTs(), id: Math.random(), fresh: true },
        ];
        return next.length > MAX_LINES
          ? next.slice(next.length - MAX_LINES)
          : next;
      });
      const delay = TICK_MIN + Math.random() * (TICK_MAX - TICK_MIN);
      timer = setTimeout(tick, delay);
    };

    timer = setTimeout(tick, 600);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="hero-log" aria-hidden="true">
      <div className="hero-log-stream">
        {lines.map((l, i) => {
          const isLast = i === lines.length - 1;
          return (
            <div
              key={l.id}
              className={
                ['line', l.fresh ? 'fresh' : '', isLast ? 'cursor' : '']
                  .filter(Boolean)
                  .join(' ')
              }
            >
              <span className="ts">{l.ts}</span>
              <span className="marker">{MARKERS[l.tag] ?? '·'}</span>
              <span className="body">{l.text}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type WipKey = 'work' | 'about' | null;

function WipLink({ label, wipLabel }: { label: string; wipLabel: string }) {
  const [hovered, setHovered] = useState(false);
  const [fallen, setFallen] = useState(false);

  function handleClick() {
    if (fallen) return;
    setFallen(true);
    setTimeout(() => setFallen(false), 600);
  }

  return (
    <motion.span
      className="hero-meta-wip"
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={handleClick}
      animate={fallen ? { rotate: -8, y: 80, opacity: 0 } : { rotate: 0, y: 0, opacity: 1 }}
      transition={
        fallen
          ? { type: 'spring', damping: 18, stiffness: 200 }
          : { type: 'spring', damping: 24, stiffness: 300 }
      }
      style={{ display: 'inline-block' }}
    >
      {/* Fixed-width container so swapped text doesn't shift layout */}
      <span style={{ position: 'relative', display: 'inline-block', minWidth: '6ch' }}>
        <AnimatePresence mode="wait" initial={false}>
          {hovered ? (
            <motion.span
              key="wip"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
              style={{ position: 'absolute', left: 0, whiteSpace: 'nowrap' }}
            >
              {wipLabel}
            </motion.span>
          ) : (
            <motion.span
              key="label"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.12 }}
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </motion.span>
  );
}

export default function Hero() {
  const [quote, setQuote] = useState('');

  useEffect(() => {
    setQuote(pickRandom(QUOTES));
  }, []);

  return (
    <section className="hero" id="hero">
      <div className="grain hero-grain" aria-hidden="true" />

      {/* Coords — EasterEggs toggles .show class via DOM */}
      <div className="coords" id="hero-coords" aria-hidden="true">
        <span className="lbl">lat</span> -34.6037&nbsp;&nbsp;
        <span className="lbl">lng</span> -58.3816
      </div>

      <HeroLog />

      <div className="hero-inner">
        <div className="hero-left">
          {quote && <div className="hero-eyebrow">{quote}</div>}
          <h1>
            Software that<br />
            <span className="green">earns its weight</span>.
          </h1>
          <p className="hero-sub">
            I write code, I write about code, and I&apos;m trying to keep both
            worth reading. Most of what I make starts as a problem
            I had on a Tuesday.
          </p>
          <div className="hero-meta">
            <Link href="/blog" className="hero-meta-primary">Blog →</Link>
            <WipLink label="Work →" wipLabel="work in progress →" />
            <WipLink label="About →" wipLabel="work in progress →" />
          </div>
        </div>
        {/* right column reserved by .hero-log absolute positioning */}
        <div />
      </div>
    </section>
  );
}
