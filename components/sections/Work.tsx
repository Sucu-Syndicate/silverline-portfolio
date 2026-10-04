'use client';

import { useRef } from 'react';
import type { ReactNode, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

function TiltCard({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(rawX, { stiffness: 200, damping: 25 });

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set(((e.clientX - rect.left) / rect.width - 0.5) * 10);
    rawY.set(-((e.clientY - rect.top) / rect.height - 0.5) * 10);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div style={{ perspective: 800 }}>
      <motion.div
        ref={ref}
        className="work-card"
        style={{ rotateX, rotateY }}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </motion.div>
    </div>
  );
}

function PlaceholderPreview({ label }: { label: string }) {
  return (
    <div className="work-card-preview">
      <svg
        className="work-card-placeholder-svg"
        viewBox="0 0 4 3"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <line x1="0" y1="0" x2="4" y2="3" stroke="var(--border)" strokeWidth="0.05" />
        <line x1="4" y1="0" x2="0" y2="3" stroke="var(--border)" strokeWidth="0.05" />
      </svg>
      <span className="work-card-preview-label">{label}</span>
    </div>
  );
}

function TerminalPreview() {
  return (
    <div className="work-card-preview work-card-terminal">
      <div><span className="t-prompt">$</span> run: replay log</div>
      <div><span className="t-prompt">&gt;</span> step 1<span className="t-ok"> ok</span></div>
      <div><span className="t-prompt">&gt;</span> step 2<span className="t-ok"> ok</span></div>
      <div><span className="t-prompt">&gt;</span> done_</div>
    </div>
  );
}

const cards = [
  {
    preview: <PlaceholderPreview label="EMBEDDED DEMO" />,
    outcome: 'Placeholder outcome — what changed because this exists.',
    tags: ['Tag', 'Tag'],
    links: [{ label: 'Code', href: '#' }, { label: 'Demo', href: '#' }],
  },
  {
    preview: <TerminalPreview />,
    outcome: 'Placeholder outcome — what changed because this exists.',
    tags: ['Tag', 'Tag'],
    links: [{ label: 'Code', href: '#' }, { label: 'Demo', href: '#' }],
  },
  {
    preview: <PlaceholderPreview label="WALKTHROUGH" />,
    outcome: 'Placeholder outcome — what changed because this exists.',
    tags: ['Tag', 'Tag'],
    links: [{ label: 'Case Study', href: '#' }],
  },
];

export default function Work() {
  return (
    <section className="section" id="work">
      <div className="section-head">
        <div>
          <h2 className="section-title">SELECTED WORK</h2>
        </div>
      </div>

      <div className="work-grid">
        {cards.map((card, i) => (
          <TiltCard key={i}>
            {card.preview}
            <div className="work-card-footer">
              <p className="work-card-outcome">{card.outcome}</p>
              <div className="work-card-tags">
                {card.tags.map((t, j) => (
                  <span key={j} className="work-tag">{t}</span>
                ))}
              </div>
              <div className="work-card-links">
                {card.links.map((l, j) => (
                  <a key={j} href={l.href}>{l.label}</a>
                ))}
              </div>
            </div>
          </TiltCard>
        ))}
      </div>
    </section>
  );
}
