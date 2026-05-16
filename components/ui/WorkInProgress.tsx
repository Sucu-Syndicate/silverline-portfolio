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

const LOG_LINES = [
  'INIT  loading page assets...',
  'SCAN  searching /dev/mathe/ideas...',
  'WARN  content not found in this dimension',
  'INFO  deploying placeholder consciousness',
  'ERR   stack overflow in creative_process.ts',
  'WAIT  negotiating with deadline (timeout: ∞)',
  'INFO  running npm install coffee --save-mental-health',
  'ERR   coffee not found in node_modules',
  'HINT  try back after the next commit',
  'SYS   ETA: soon™',
];

interface WorkInProgressProps {
  label: string;
}

export default function WorkInProgress({ label }: WorkInProgressProps) {
  const [lines, setLines] = useState<string[]>([LOG_LINES[0]]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let i = 1;
    const id = setInterval(() => {
      if (i < LOG_LINES.length) {
        setLines((prev) => [...prev, LOG_LINES[i++]]);
      } else {
        clearInterval(id);
      }
    }, 700);
    return () => clearInterval(id);
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
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              color: line.startsWith('ERR') ? '#c97070' : 'var(--text-2)',
            }}
          >
            <span style={{ color: 'var(--accent)', opacity: 0.5 }}>{'>'}</span>{' '}
            {line}
          </motion.div>
        ))}
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ repeat: Infinity, duration: 1.1, ease: 'linear', repeatType: 'mirror' }}
          style={{ color: 'var(--accent)' }}
        >
          _
        </motion.span>
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
