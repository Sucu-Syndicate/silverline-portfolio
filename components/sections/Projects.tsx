'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PROJECTS = [
  {
    num: '01',
    name: 'Velvet',
    year: '2026',
    tagline: 'Creator platform. The flagship.',
  },
  {
    num: '02',
    name: 'Myobscelium',
    year: '2026',
    tagline: 'Personal memory OS. Built to think with Claude.',
  },
  {
    num: '03',
    name: 'Meridian Sage',
    year: '2025',
    tagline: 'AI research tool. Solved a real problem.',
  },
];

function ProjectCard({ project, index }: { project: typeof PROJECTS[number]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    /* motion.div handles scroll reveal; article handles hover — no transform conflict */
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ delay: index * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <article
        className="proj"
        style={{
          background: hovered ? 'var(--raised)' : 'var(--bg)',
          boxShadow: hovered ? 'inset 0 2px 0 var(--accent)' : 'none',
          transform: hovered ? 'translateY(-2px)' : 'none',
          transition: 'background 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease',
          padding: '32px 28px',
          minHeight: 380,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          cursor: 'pointer',
          position: 'relative',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Arrow */}
        <div
          style={{
            position: 'absolute',
            top: 28,
            right: 28,
            fontFamily: 'var(--font-structure)',
            fontWeight: 400,
            fontSize: 18,
            color: hovered ? 'var(--accent)' : 'var(--text-2)',
            transform: hovered ? 'translate(4px, -4px)' : 'none',
            transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), color 0.18s ease',
          }}
        >
          ↗
        </div>

        {/* Number + Year row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.10em',
            textTransform: 'uppercase',
          }}
        >
          <span style={{ color: 'var(--accent)' }}>—— {project.num}</span>
          <span style={{ color: 'var(--text-2)' }}>{project.year}</span>
        </div>

        {/* Name */}
        <h3
          style={{
            fontFamily: 'var(--font-structure)',
            fontWeight: 800,
            fontSize: 24,
            letterSpacing: '-0.02em',
            lineHeight: 1.05,
            color: 'var(--text)',
            margin: '4px 0 0',
          }}
        >
          {project.name}
        </h3>

        {/* Tagline */}
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            lineHeight: 1.5,
            color: 'var(--text-2)',
            margin: 0,
            flex: 1,
            letterSpacing: '0.01em',
          }}
        >
          {project.tagline}
        </p>
      </article>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <section
      className="section"
      id="projects"
      style={{ background: 'var(--bg)' }}
    >
      <div className="section-head">
        <div>
          <div className="section-label">Selected work</div>
          <h2 className="section-title">
            Three I&apos;m proud of,<br />more behind them.
          </h2>
        </div>
        <Link href="/work" className="section-link">All projects →</Link>
      </div>

      <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.num} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
