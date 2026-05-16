'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CUBE_SIZE = 80;
const HALF = CUBE_SIZE / 2;

const FACE_STYLES: CSSProperties[] = [
  { transform: `translateZ(${HALF}px)` },
  { transform: `rotateY(180deg) translateZ(${HALF}px)` },
  { transform: `rotateY(90deg) translateZ(${HALF}px)` },
  { transform: `rotateY(-90deg) translateZ(${HALF}px)` },
  { transform: `rotateX(90deg) translateZ(${HALF}px)` },
  { transform: `rotateX(-90deg) translateZ(${HALF}px)` },
];

const FACE_LABELS = ['WIP', '404', 'TBD', '////', 'NaN', '...'];

const LOG_POOL = [
  'INIT  loading page assets...',
  'WARN  printer ran out of ink',
  'INFO  Claude requests a break',
  'INFO  turning it off and on again',
  'HINT  try back after the next commit',
  'WAIT  negotiating with deadline (timeout: ∞)',
  'SYS   ETA: Maybe.',
];

const ERR_POOL = [
  'ERR   content was not found in this dimension, check the neighbouring ones',
  'ERR   auto-merge failed: codebase caught fire during reconciliation',
];

function buildSequence(): string[] {
  const shuffled = [...LOG_POOL].sort(() => Math.random() - 0.5).slice(0, 5);
  const err = ERR_POOL[Math.floor(Math.random() * ERR_POOL.length)];
  return [...shuffled, err];
}

interface WorkInProgressProps {
  label: string;
}

export default function WorkInProgress({ label }: WorkInProgressProps) {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  // Set all lines at once — CSS animation-delay handles the drip-in visually.
  // This avoids interval + Strict Mode interaction that was cutting off lines.
  useEffect(() => {
    const sequence = buildSequence();
    setLines(sequence);
    return () => setLines([]);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 97) {
          clearInterval(id);
          return 97;
        }
        return p + 1;
      });
    }, 25);
    return () => clearInterval(id);
  }, []);

  return (
    <main
      style={{
        background: 'var(--bg)',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3rem 1.5rem',
        gap: 0,
      }}
    >
      {/* 3D spinning cube */}
      <div style={{ perspective: '600px', marginBottom: '2.5rem' }}>
        <motion.div
          animate={{ rotateY: [0, 360], rotateX: [0, 15, 0, -15, 0] }}
          transition={{
            rotateY: { repeat: Infinity, duration: 7, ease: 'linear' },
            rotateX: { repeat: Infinity, duration: 14, ease: 'easeInOut' },
          }}
          style={{
            width: CUBE_SIZE,
            height: CUBE_SIZE,
            transformStyle: 'preserve-3d',
            position: 'relative',
          }}
        >
          {FACE_STYLES.map((faceStyle, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                width: CUBE_SIZE,
                height: CUBE_SIZE,
                border: '1px solid var(--accent)',
                background: 'color-mix(in srgb, var(--accent-bg) 60%, transparent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                color: 'var(--accent)',
                letterSpacing: '0.08em',
                ...faceStyle,
              }}
            >
              {FACE_LABELS[i]}
            </div>
          ))}
        </motion.div>
      </div>

      {/* Status label */}
      <p
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.2em',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          marginBottom: '0.5rem',
        }}
      >
        system status
      </p>

      <h1
        style={{
          fontFamily: 'var(--font-structure)',
          color: 'var(--text)',
          fontSize: 'clamp(2rem, 6vw, 3.5rem)',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1,
          marginBottom: '2.5rem',
          textAlign: 'center',
        }}
      >
        {label}
      </h1>

      {/* Terminal log */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          lineHeight: 2,
          background: 'var(--surface-2)',
          border: '1px solid var(--border)',
          padding: '1rem 1.25rem',
          width: '100%',
          maxWidth: 480,
          marginBottom: '1.5rem',
          minHeight: 80,
        }}
      >
        {lines.filter(Boolean).map((line, i) => (
          <div
            key={i}
            style={{
              color: line.startsWith('ERR') ? '#c97070' : 'var(--text-2)',
              opacity: 0,
              animation: `wip-line-in 0.3s ease ${i * 700}ms forwards`,
            }}
          >
            <span style={{ color: 'var(--accent)', opacity: 0.5 }}>{'>'}</span>{' '}
            {line}
          </div>
        ))}
        <span
          style={{
            color: 'var(--accent)',
            animation: 'blink 1.1s step-end infinite',
          }}
        >
          _
        </span>
      </div>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: 480, marginBottom: '2.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--text-dim)',
            marginBottom: '0.4rem',
          }}
        >
          <span>building {label.toLowerCase()}...</span>
          <span>{progress}%</span>
        </div>
        <div
          style={{
            height: 2,
            background: 'var(--border)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <motion.div
            style={{ height: '100%', background: 'var(--accent)', originX: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut', duration: 0.4 }}
          />
        </div>
      </div>

      {/* Back link */}
      <Link
        href="/"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--text-dim)',
          textDecoration: 'none',
          letterSpacing: '0.05em',
          transition: 'color 0.2s',
        }}
        onMouseEnter={(e) => ((e.target as HTMLElement).style.color = 'var(--text)')}
        onMouseLeave={(e) => ((e.target as HTMLElement).style.color = 'var(--text-dim)')}
      >
        ← back to home
      </Link>
    </main>
  );
}
