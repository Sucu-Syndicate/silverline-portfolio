'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

const PROJECTS = [
  {
    num: '01',
    name: 'Velvet',
    year: '2026',
    tagline: 'Creator platform. The flagship.',
    description:
      'A full-stack SaaS LMS built for a client in the hairdressing education space. Authentication, course delivery, self-hosted encrypted video, dual-currency payments, admin panel, student management, analytics, progress tracking, the complete package, production-grade and actively growing. Five phases, 22 days, five months ahead of deadline. White-label architecture from day one.',
  },
  {
    num: '02',
    name: 'Myobscelium',
    year: '2026',
    tagline: 'Personal memory OS. Built to think with Claude.',
    description:
      'A 19-tool Python MCP server connecting Claude directly to an Obsidian vault, named after mycelium, the fungal network that invisibly passes signals between trees. Simple on paper. The real power is what it unlocks: context is the most valuable currency when working with AI, and Myobscelium gives you unlimited amounts of it, any note, any project, any depth, retrievable mid-session through a tiered system (L0/L1/L2) that loads exactly as much as needed without burning tokens. That persistent memory layer is what made larger and larger builds possible, spawned VARRO, a full dual-agent project operating system, and ultimately what let this portfolio site get built at the speed it did.',
  },
  {
    num: '03',
    name: 'Meridian Sage',
    year: '2025',
    tagline: 'AI research tool. Solved a real problem.',
    description:
      'The best thinking in the world lives in YouTube. Decades of lectures, investor frameworks, scientific breakdowns, founder stories, all completely unsearchable, buried in video. Meridian Sage fixes that: a full RAG pipeline that scrapes transcripts, chunks and embeds them into ChromaDB, runs hybrid BM25 + semantic retrieval with cross-encoder reranking, and feeds the results into Gemini 2.0 Flash for query expansion, grounded synthesis, and inline citations linking back to the exact timestamp. 249,000+ chunks, 80+ channels across 15 domains, running as a full Next.js + FastAPI web app. Built from zero to production in a single sprint, then scaled into something genuinely useful.',
  },
];

const SPIN_MS  = 4000;
const CORNER   = 53;
const GLOW_WIN = 16;
const DECAY    = 0.972;

// 03 fires first, 02 +0.3s, 01 +0.55s (in array order 0=01, 1=02, 2=03)
const ANGLE_OFFSETS = [
  (0.55 / (SPIN_MS / 1000)) * 360,
  (0.30 / (SPIN_MS / 1000)) * 360,
  0,
];

function smoothstep(t: number): number {
  return t * t * (3 - 2 * t);
}

function ProjectsAnimation({
  spinnerRefs,
  numRefs,
}: {
  spinnerRefs: React.RefObject<(HTMLDivElement | null)[]>;
  numRefs: React.RefObject<(HTMLDivElement | null)[]>;
}) {
  useEffect(() => {
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const glowLevels = [0, 0, 0];
    let rafId: number;

    function loop(ts: number) {
      const angle = ((ts % SPIN_MS) / SPIN_MS) * 360;

      spinnerRefs.current?.forEach((el) => {
        if (el) el.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
      });

      numRefs.current?.forEach((el, i) => {
        if (!el) return;
        const eff  = ((angle - ANGLE_OFFSETS[i]) % 360 + 360) % 360;
        const raw  = Math.abs(eff - CORNER);
        const dist = Math.min(raw, 360 - raw);

        if (dist < GLOW_WIN) {
          glowLevels[i] = Math.min(1, glowLevels[i] + 0.15 * smoothstep(1 - dist / GLOW_WIN));
        } else {
          glowLevels[i] *= DECAY;
        }

        const g = glowLevels[i];
        if (g > 0.005) {
          el.style.webkitTextStrokeColor = `rgba(93,166,122,${(0.07 + 0.83 * g).toFixed(3)})`;
          el.style.filter = `drop-shadow(0 0 ${(20 * g).toFixed(1)}px rgba(93,166,122,${(0.55 * g).toFixed(3)})) drop-shadow(0 0 ${(42 * g).toFixed(1)}px rgba(93,166,122,${(0.16 * g).toFixed(3)}))`;
        } else {
          el.style.webkitTextStrokeColor = 'rgba(93,166,122,0.07)';
          el.style.filter = 'none';
        }
      });

      rafId = requestAnimationFrame(loop);
    }

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [spinnerRefs, numRefs]);

  return null;
}

export default function Projects() {
  const spinnerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const numRefs     = useRef<(HTMLDivElement | null)[]>([]);

  return (
    <section className="section" id="projects" style={{ background: 'var(--bg)' }}>
      <ProjectsAnimation spinnerRefs={spinnerRefs} numRefs={numRefs} />

      <div className="section-head">
        <div>
          <div className="section-label" style={{ color: 'var(--accent)' }}>The triumvirate</div>
          <h2 className="section-title" style={{ fontSize: 'clamp(32px, 4vw, 52px)' }}>
            Flagship projects
          </h2>
        </div>
        <Link href="/blog" className="section-link">Read about the process →</Link>
      </div>

      <div className="projects-grid">
        {PROJECTS.map((p, i) => (
          <motion.div
            key={p.num}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* card-shell: padding: 1px so the spinner gradient shows as the border */}
            <div className="proj-shell">
              <div
                className="proj-spinner"
                ref={(el) => { spinnerRefs.current[i] = el; }}
              />
              <div className="proj-card">
                <div className="proj-bar" />
                <div
                  className="proj-num"
                  ref={(el) => { numRefs.current[i] = el; }}
                >
                  {p.num}
                </div>
                <div className="proj-year">{p.year}</div>
                <div className="proj-name">{p.name}</div>
                <div className="proj-tagline">{p.tagline}</div>
                <p className="proj-desc">{p.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
