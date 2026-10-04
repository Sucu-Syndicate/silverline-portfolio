'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { getGPUTier } from 'detect-gpu';
import ScrollReveal from '@/components/ui/ScrollReveal';
import BorderGlow from '@/components/ui/BorderGlow';

// ── Backgrounds — dynamic (client-only, code-split) ──────────────────────────
const MoltenMetal    = dynamic(() => import('@/components/backgrounds/MoltenMetal'), { ssr: false });
const Silk           = dynamic(() => import('@/components/backgrounds/Silk'),        { ssr: false });
const ColorBends     = dynamic(() => import('@/components/backgrounds/ColorBends'),  { ssr: false });
const FlexCarousel   = dynamic(() => import('@/components/ui/FlexCarousel'),         { ssr: false });

// ── Carousel images for the "see all" section background ─────────────────────
const CAROUSEL_ITEMS = [
  { src: '/images/carousel/c09.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c03.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c14.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c05.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c01.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c11.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c06.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c04.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c10.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c13.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c02.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c07.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c12.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c08.webp', alt: 'Project screenshot' },
];

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
    name:    'FACTUR2D2',
    tagline: 'Automated tax filing bot & headless Selenium infrastructure.',
    tags:    ['Python', 'Selenium', 'Telegram API', 'Raspberry Pi'],
  },
] as const;

// ── Background renderer — only mounted when webgl is enabled ─────────────────
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
  webglEnabled: boolean;
}

function ProjectCard({ project, index, paused, quality, webglEnabled }: ProjectCardProps) {
  return (
    <div
      className={`project-card project-card--${index + 1}`}
      style={{ zIndex: index + 1 }}
    >
      {/* WebGL background — only mounted when the user enables moving backgrounds */}
      <div className="project-card-bg" aria-hidden="true">
        {webglEnabled && <CardBackground index={index} paused={paused} quality={quality} />}
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
  const outerRef   = useRef<HTMLDivElement>(null);
  const [activeSet, setActiveSet] = useState<ReadonlySet<number>>(() => new Set([0]));
  const prevKeyRef = useRef('0');
  const [gpuQuality,   setGpuQuality]   = useState<'low' | 'medium' | 'high'>(() =>
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
      const sc = Math.min(Math.max(s, 0), 3);
      const base = Math.min(2, Math.floor(sc));
      const frac = sc - base;
      const next = new Set<number>();
      if (frac < 0.95) next.add(base);
      if (frac > 0.05 && base < 2) next.add(base + 1);
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
    <section id="projects">
      {/* Sticky scroll stack — no header, cards speak for themselves */}
      <div className="projects-stack-outer" ref={outerRef}>
        {projects.map((project, i) => (
          <ProjectCard
            key={project.number}
            project={project}
            index={i}
            paused={!activeSet.has(i)}
            quality={gpuQuality}
            webglEnabled={true}
          />
        ))}
      </div>

      {/* See all projects — plain-flow rectangle, no sticky */}
      <div className="projects-see-all">
        {/* Background carousel — behind the card, no interaction */}
        <div className="projects-see-all-carousel-bg" aria-hidden="true">
          <FlexCarousel
            items={CAROUSEL_ITEMS}
            preset="liquid"
            intro="deal"
            cardHeight={0.5}
            gap={12}
            bend={0.38}
            reach={0.40}
            squeeze={0.2}
            focusOnClick={false}
            captions={false}
            captureWheel={false}
            autoplay
          />
        </div>
        <BorderGlow
          backgroundColor="#0F100E"
          borderRadius={28}
          glowColor="42 18 60"
          colors={['#E8E6DD', '#B8B6AD', '#E8E6DD']}
          glowRadius={52}
          glowIntensity={0.9}
          fillOpacity={0.18}
          alwaysOn
        >
          <div className="projects-see-all-inner">
            <div className="projects-see-all-text">
              <ScrollReveal delay={0}>
                <p className="projects-see-all-label">PROJECT ARCHIVE</p>
              </ScrollReveal>
              <ScrollReveal delay={0.08}>
                <h2 className="projects-see-all-heading">BEYOND THE HIGHLIGHTS</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="projects-see-all-sub">
                  Explore more of my projects, experiments, and technical work, with the ideas, decisions, and lessons behind each one.
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.22}>
              <a href="/work" className="projects-see-all-btn">
                See all projects
              </a>
            </ScrollReveal>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}
