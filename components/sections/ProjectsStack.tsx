'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { getGPUTier } from 'detect-gpu';
import GradientText from '@/components/ui/GradientText';
import ScrollReveal from '@/components/ui/ScrollReveal';

// ── Backgrounds — dynamic (client-only, code-split) ──────────────────────────
const MoltenMetal    = dynamic(() => import('@/components/backgrounds/MoltenMetal'), { ssr: false });
const Silk           = dynamic(() => import('@/components/backgrounds/Silk'),        { ssr: false });
const ColorBends     = dynamic(() => import('@/components/backgrounds/ColorBends'),  { ssr: false });

// ── Mockups — dynamic (client-only, code-split) ───────────────────────────────
const VelvetMockup      = dynamic(() => import('@/components/mockups/VelvetMockup'),      { ssr: false });
const MyobsceliumMockup = dynamic(() => import('@/components/mockups/MyobsceliumMockup'), { ssr: false });

// ── Tech icon lookup (simple-icons CDN) ──────────────────────────────────────
const TECH_ICONS: Record<string, string> = {
  'Next.js':               'https://cdn.simpleicons.org/nextdotjs/B8B6AD',
  'TypeScript':            'https://cdn.simpleicons.org/typescript/B8B6AD',
  'Supabase':              'https://cdn.simpleicons.org/supabase/B8B6AD',
  'Clerk':                 'https://cdn.simpleicons.org/clerk/B8B6AD',
  'Stripe':                'https://cdn.simpleicons.org/stripe/B8B6AD',
  'Python':                'https://cdn.simpleicons.org/python/B8B6AD',
  'Anthropic':             'https://cdn.simpleicons.org/anthropic/B8B6AD',
  'Obsidian':              'https://cdn.simpleicons.org/obsidian/B8B6AD',
  'Selenium':              'https://cdn.simpleicons.org/selenium/B8B6AD',
  'Telegram API':          'https://cdn.simpleicons.org/telegram/B8B6AD',
  'Raspberry Pi':          'https://cdn.simpleicons.org/raspberrypi/B8B6AD',
};

// ── Project data ──────────────────────────────────────────────────────────────
const projects = [
  {
    number:       '01',
    label:        'FEATURED PROJECT 1',
    name:         'VELVET',
    tagline:      'A Spanish-language, mobile-first video course platform with streaming, quizzes, certificates, checkout and admin, taken from a vague brief to a working MVP in 22 days. Built by directing a multi-agent AI workflow with spec-first rules and verification gates, so no task ships on an agent\'s self-report.',
    tags:         ['Next.js', 'TypeScript', 'Supabase', 'Clerk', 'Stripe'] as const,
    slug:         'velvet',
    accentColors: ['#C4A265', '#EFDdbd', '#C4A265', '#A07840'],
  },
  {
    number:       '02',
    label:        'FEATURED PROJECT 2',
    name:         'MYOBSCELIUM MCP',
    tagline:      'An open-source Python MCP server that turns an Obsidian vault into persistent, searchable memory for Claude Desktop and Claude Code, so a new chat never starts from zero. Its 19 tools and three-tier retrieval keep token cost low, and the design was shaped by failures found in real use.',
    tags:         ['Python', 'Model Context Protocol', 'Anthropic', 'Obsidian'] as const,
    slug:         'myobscelium-mcp',
    accentColors: ['#8B5CF6', '#C084FC', '#8B5CF6', '#6D28D9'],
  },
  {
    number:       '03',
    label:        'FEATURED PROJECT 3',
    name:         'FACTUR2D2',
    tagline:      'A Telegram bot that turns filing Argentine tax invoices on the AFIP/ARCA portal into a few taps, with over 200 real invoices filed since September 2025. When AFIP\'s official API proved a dead end, it was built on hand-written Selenium that drives the public portal from a Raspberry Pi, with a test-mode gate on the one irreversible send.',
    tags:         ['Python', 'Selenium', 'Telegram API', 'Raspberry Pi'] as const,
    slug:         'factur2d2',
    accentColors: ['#438BFF', '#60A5FA', '#438BFF', '#1D4ED8'],
  },
] as const;

// ── Background renderer ───────────────────────────────────────────────────────
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
      {/* WebGL background */}
      <div className="project-card-bg" aria-hidden="true">
        {webglEnabled && <CardBackground index={index} paused={paused} quality={quality} />}
      </div>

      {/* Top edge fade */}
      <div className="project-card-edge" aria-hidden="true" />

      {/* Glass card content */}
      <div className="project-card-inner">
        <div className="project-glass-card">

          {/* Animated gradient label */}
          <motion.div
            className="project-glass-label-row"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          >
            <GradientText
              colors={[...project.accentColors]}
              animationSpeed={7}
              className="project-glass-label"
            >
              {project.label}
            </GradientText>
          </motion.div>

          <h2 className="project-card-title">{project.name}</h2>

          <ScrollReveal delay={0.1}>
            <p className="project-card-tagline">{project.tagline}</p>
          </ScrollReveal>

          <ScrollReveal delay={0.14}>
            <a href={`/project/${project.slug}`} className="project-glass-cta">
              See in detail
            </a>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="project-glass-sep" aria-hidden="true" />
          </ScrollReveal>

          <ScrollReveal delay={0.26}>
            <div className="project-card-tags">
              {project.tags.map((tag) => {
                const iconUrl = TECH_ICONS[tag as string];
                return (
                  <span key={tag} className="project-glass-tag">
                    {iconUrl && (
                      <img
                        src={iconUrl}
                        alt=""
                        aria-hidden="true"
                        className="project-glass-tag-icon"
                      />
                    )}
                    {tag}
                  </span>
                );
              })}
            </div>
          </ScrollReveal>

        </div>

        {/* Right-side mockup — desktop only, hidden below 1200px via CSS */}
        {index === 0 && (
          <div className="project-card-mockup">
            <VelvetMockup />
          </div>
        )}
        {index === 1 && (
          <div className="project-card-mockup">
            <MyobsceliumMockup paused={paused} />
          </div>
        )}

      </div>
    </div>
  );
}

// ── GPU tier cache ────────────────────────────────────────────────────────────
function getCachedGPUQuality(): 'low' | 'medium' | 'high' {
  try {
    const v = localStorage.getItem('sl-gpu-quality');
    if (v === 'low' || v === 'medium' || v === 'high') return v;
  } catch {}
  return 'medium';
}

// ── Container ─────────────────────────────────────────────────────────────────
export default function ProjectsStack() {
  const outerRef   = useRef<HTMLDivElement>(null);
  const [activeSet, setActiveSet] = useState<ReadonlySet<number>>(() => new Set([0]));
  const prevKeyRef = useRef('0');
  const [gpuQuality, setGpuQuality] = useState<'low' | 'medium' | 'high'>(() =>
    typeof window !== 'undefined' ? getCachedGPUQuality() : 'medium'
  );

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
      if (next.size === 0) next.add(base);
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
    </section>
  );
}
