'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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
  const [lines, setLines] = useState<LiveLine[]>(() => {
    const seed: LiveLine[] = [];
    for (let i = 0; i < 8; i++) {
      const l = pickRandom(TERMINAL_LINES);
      if (!l) break;
      seed.push({ ...l, ts: nowTs(), id: Math.random() + i, fresh: false });
    }
    return seed;
  });

  useEffect(() => {
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

export default function Hero() {
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
          <div className="hero-eyebrow">Independent · Buenos Aires</div>
          <h1>
            Software that<br />
            <span className="green">earns its weight</span>
            <span className="period">.</span>
          </h1>
          <p className="hero-sub">
            I write code, I write about code, and I&apos;m trying to keep both
            worth reading. Most of what I make starts as a problem
            I had on a Tuesday.
          </p>
          <div className="hero-meta">
            <Link href="/blog">Writing →</Link>
            <a href="#projects">Work →</a>
            <Link href="/about">About →</Link>
          </div>
        </div>
        {/* right column reserved by .hero-log absolute positioning */}
        <div />
      </div>
    </section>
  );
}
