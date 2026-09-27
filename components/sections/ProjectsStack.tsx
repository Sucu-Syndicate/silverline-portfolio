'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { getGPUTier } from 'detect-gpu';
import ScrollReveal from '@/components/ui/ScrollReveal';

// ── Backgrounds — dynamic (client-only, code-split) ──────────────────────────
const MoltenMetal = dynamic(() => import('@/components/backgrounds/MoltenMetal'), { ssr: false });
const Silk        = dynamic(() => import('@/components/backgrounds/Silk'),        { ssr: false });
const Topography  = dynamic(() => import('@/components/backgrounds/Topography'),  { ssr: false });
const ColorBends  = dynamic(() => import('@/components/backgrounds/ColorBends'),  { ssr: false });

// ── Project data ──────────────────────────────────────────────────────────────
const projects = [
  {
    number:  '01',
    label:   'PROJECT 01',
    name:    'VELVET',
    tagline: 'AI-native financial platform — built solo from architecture to deployment.',
    tags:    ['Next.js', 'TypeScript', 'Supabase', 'Clerk', 'Stripe'],
  },
  {
    number:  '02',
    label:   'PROJECT 02',
    name:    'MYOBSCELIUM MCP',
    tagline: 'Open-source knowledge retrieval server & development OS for Claude Desktop.',
    tags:    ['Python', 'Model Context Protocol', 'Anthropic', 'Obsidian'],
  },
  {
    number:  '03',
    label:   'PROJECT 03',
    name:    'MERIDIAN SAGE',
    tagline: 'Domain-specific AI consultant with a 7-stage hybrid retrieval engine.',
    tags:    ['Next.js', 'FastAPI', 'Vertex AI', 'ChromaDB'],
  },
  {
    number:  '04',
    label:   'PROJECT 04',
    name:    'FACTUR2D2',
    tagline: 'Automated tax filing bot & headless Selenium infrastructure.',
    tags:    ['Python', 'Selenium', 'Telegram API', 'Raspberry Pi'],
  },
] as const;

// ── Background renderer — one-per-card ────────────────────────────────────────
function CardBackground({ index, paused, quality }: { index: number; paused: boolean; quality: 'low' | 'medium' | 'high' }) {
  switch (index) {
    case 0:
      return (
        <MoltenMetal
          color1="#0d0b0e"
          color2="#c4a265"
          color3="#efddbd"
          colorMode="molten"
          speed={0.2}
          scale={4}
          detail={3}
          glow={1.6}
          coreSize={0.11}
          swirl={0.85}
          fold={-0.2}
          blackPoint={0.05}
          brightness={1.35}
          opacity={1}
          grain
          grainIntensity={0.05}
          mouseInteraction={false}
          mouseStrength={0}
          paused={paused}
        />
      );
    case 1:
      return (
        <Silk
          speed={5}
          scale={1}
          color="#8923eb"
          noiseIntensity={1.5}
          rotation={0}
          paused={paused}
        />
      );
    case 2:
      return (
        <Topography
          lowColor="#8f73ff"
          midColor="#ffcafd"
          highColor="#ffffff"
          speed={0.3}
          morphAmount={3.0}
          morphSpeed={0.05}
          bands={1.5}
          thickness={0.01}
          scale={1.0}
          pixelSize={1.0}
          glow={0.5}
          colorMode="elevation"
          contrast={3.0}
          brightness={1.0}
          fillBands={false}
          opacity={1.0}
          grain={false}
          mouseInteraction={false}
          mouseRadius={0.05}
          mouseStrength={0}
          paused={paused}
        />
      );
    case 3:
      return (
        <ColorBends
          rotation={90}
          speed={0.6}
          colors={['#438bff']}
          transparent
          autoRotate={0}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={0}
          parallax={0.5}
          noise={0.15}
          iterations={1}
          intensity={1.5}
          bandWidth={2.5}
          paused={paused}
        />
      );
    default:
      return null;
  }
}

// ── Single project card ───────────────────────────────────────────────────────
interface ProjectCardProps {
  project: (typeof projects)[number];
  index: number;
  paused: boolean;
  quality: 'low' | 'medium' | 'high';
}

function ProjectCard({ project, index, paused, quality }: ProjectCardProps) {
  return (
    <div
      className={`project-card project-card--${index + 1}`}
      style={{ zIndex: index + 1 }}
    >
      {/* WebGL background — always mounted, paused when not active */}
      <div className="project-card-bg" aria-hidden="true">
        <CardBackground index={index} paused={paused} quality={quality} />
      </div>

      {/* Top edge fade — casts a shadow band when the next card slides in */}
      <div className="project-card-edge" aria-hidden="true" />

      {/* Glass card content */}
      <div className="project-card-inner">
        <div className="project-glass-card">
          <ScrollReveal delay={0}>
            <p className="project-card-label">{project.label}</p>
          </ScrollReveal>

          <h2 className="project-card-title">{project.name}</h2>

          <ScrollReveal delay={0.1}>
            <p className="project-card-tagline">{project.tagline}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.16}>
            <div className="project-glass-sep" aria-hidden="true" />
          </ScrollReveal>

          <ScrollReveal delay={0.22}>
            <div className="project-card-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-glass-tag">{tag}</span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </div>
    </div>
  );
}

// ── Container ─────────────────────────────────────────────────────────────────
/*
  All 4 backgrounds always mounted so WebGL init cost is paid once on page load.
  Scroll tracker computes which card is active and pauses the other 3 RAF loops.
  Up to 2 cards run during card transitions (0.05–0.95 of a card height).
*/
function getCachedGPUQuality(): 'low' | 'medium' | 'high' {
  try {
    const v = localStorage.getItem('sl-gpu-quality');
    if (v === 'low' || v === 'medium' || v === 'high') return v;
  } catch {}
  return 'medium';
}

export default function ProjectsStack() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [activeSet, setActiveSet] = useState<ReadonlySet<number>>(() => new Set([0]));
  const prevKeyRef = useRef('0');
  const [gpuQuality, setGpuQuality] = useState<'low' | 'medium' | 'high'>(() =>
    typeof window !== 'undefined' ? getCachedGPUQuality() : 'medium'
  );

  // Detect GPU tier — updates quality for current and future sessions
  useEffect(() => {
    getGPUTier().then(({ tier }) => {
      const q: 'low' | 'medium' | 'high' = tier <= 1 ? 'low' : tier === 2 ? 'medium' : 'high';
      try { localStorage.setItem('sl-gpu-quality', q); } catch {}
      setGpuQuality(q);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    let raf = 0;

    const tick = () => {
      const s = -outer.getBoundingClientRect().top / window.innerHeight;
      const sc = Math.min(Math.max(s, 0), 4);
      const base = Math.min(3, Math.floor(sc));
      const frac = sc - base;
      const next = new Set<number>();
      if (frac < 0.95) next.add(base);
      if (frac > 0.05 && base < 3) next.add(base + 1);
      if (next.size === 0) next.add(base); // clamped edge (s < 0 or s ≥ 4)
      const key = [...next].sort().join(',');
      if (key !== prevKeyRef.current) {
        prevKeyRef.current = key;
        setActiveSet(next);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="projects-stack-outer" id="work" ref={outerRef}>
      {projects.map((project, i) => (
        <ProjectCard
          key={project.number}
          project={project}
          index={i}
          paused={!activeSet.has(i)}
          quality={gpuQuality}
        />
      ))}
    </div>
  );
}
