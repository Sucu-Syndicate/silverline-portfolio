'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { terminalLines, type TerminalLine } from '@/lib/terminal-lines';
import ASCIIText from '@/components/ASCIIText';

const TICK_MIN = 1000;
const TICK_MAX = 2000;
const MAX_LINES = 30;

const MARKERS: Record<string, string> = {
  commit: '◇',
  build: '▸',
  ship: '↑',
  think: '~',
  note: '·',
  quote: '§',
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
  const [lines, setLines] = useState<LiveLine[]>([]);

  useEffect(() => {
    const seed: LiveLine[] = [];
    for (let i = 0; i < MAX_LINES; i++) {
      const l = pickRandom(terminalLines);
      if (!l) break;
      seed.push({ ...l, ts: nowTs(), id: Math.random() + i, fresh: false });
    }
    setLines(seed);

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      if (cancelled) return;
      setLines((prev) => {
        const pick = pickRandom(terminalLines);
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

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1], delay },
});

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="grain hero-grain" aria-hidden="true" />

      {/* Idle reveal — toggled by EasterEggs via DOM */}
      <div className="coords" id="hero-coords" aria-hidden="true">
        <span className="coords-prompt">&gt;</span>{' '}
        <span id="hero-coords-msg">it works on my machine</span>
        <span className="coords-cursor">_</span>
      </div>

      <HeroLog />

      <div className="hero-inner">
        {/* ASCII heading — full width, spans across hero */}
        <div className="hero-ascii-heading" aria-label="Matheo Guevara">
          <ASCIIText
            text="Matheo Guevara"
            enableWaves={false}
            asciiFontSize={8}
            textFontSize={200}
            textColor="#fdf9f3"
            planeBaseHeight={14}
          />
        </div>

        <div className="hero-left">
          <motion.p className="hero-sub" {...fadeUp(0.9)}>
            AI agent developer. Directs and ships full products solo, using
            AI-directed pipelines end to end.
          </motion.p>

          <motion.div className="hero-meta" {...fadeUp(1.1)}>
            <a href="#projects" className="hero-meta-primary">VIEW PROJECTS</a>
            <a href="/resume.pdf" className="hero-meta-primary" target="_blank" rel="noopener noreferrer">RESUME</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
