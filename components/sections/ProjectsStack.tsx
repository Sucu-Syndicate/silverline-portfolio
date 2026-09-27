'use client';

import dynamic from 'next/dynamic';
import { useRef, useState, useEffect, useCallback } from 'react';
// @ts-ignore — React Bits component, no type declarations
import DecryptedText from '@/components/DecryptedText';
import ScrollReveal from '@/components/ui/ScrollReveal';

// ── Backgrounds — dynamic (client-only, chunked, lazy-activated) ──────────────
const MoltenMetal = dynamic(() => import('@/components/backgrounds/MoltenMetal'), { ssr: false });
const Silk        = dynamic(() => import('@/components/backgrounds/Silk'),        { ssr: false });
const LightPillar = dynamic(() => import('@/components/backgrounds/LightPillar'), { ssr: false });
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
function CardBackground({ index }: { index: number }) {
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
        />
      );
    case 2:
      return (
        <LightPillar
          topColor="#8f73ff"
          bottomColor="#ffcafd"
          intensity={1}
          rotationSpeed={0.3}
          interactive={false}
          glowAmount={0.002}
          pillarWidth={5}
          pillarHeight={0.3}
          noiseIntensity={0.5}
          pillarRotation={90}
          quality="medium"
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
  isActive: boolean;
  isMounted: boolean;
  onCardRef: (index: number, el: HTMLDivElement | null) => void;
}

function ProjectCard({ project, index, isActive, isMounted, onCardRef }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    onCardRef(index, cardRef.current);
    return () => { onCardRef(index, null); };
  }, [index, onCardRef]);

  return (
    <div
      ref={cardRef}
      className={`project-card project-card--${index + 1}`}
      style={{ zIndex: index + 1 }}
    >
      {/* WebGL background — mounted for active + entering card */}
      <div className="project-card-bg" aria-hidden="true">
        {isMounted && <CardBackground index={index} />}
      </div>

      {/* Top edge fade — casts a shadow band when the next card slides in */}
      <div className="project-card-edge" aria-hidden="true" />

      {/* Glass card content */}
      <div className="project-card-inner">
        <div className="project-glass-card">
          <ScrollReveal delay={0}>
            <p className="project-card-label">{project.label}</p>
          </ScrollReveal>

          <h2 className="project-card-title">
            <DecryptedText
              text={project.name}
              animateOn="view"
              sequential
              speed={35}
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&"
              revealDirection="start"
              encryptedClassName="project-title-enc"
              rootMargin="0px 0px 400px 0px"
            />
          </h2>

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
  Scroll-based background management — avoids IntersectionObserver sticky quirks.

  Uses getBoundingClientRect on each card element to determine:
    • "stuck" card   — rect.top near 0 (is the topmost visible sticky card)
    • "entering" card — rect.top in (STUCK_THRESH, viewport height)
                        (visible in viewport but not yet stuck)

  activeIndex = highest-indexed "stuck" card (it's visually on top)
  mountedSet  = stuck cards ∪ entering cards  (max 2 at a time during transitions)

  This fires on every Lenis tick because Lenis uses window.scrollTo(), so
  window.scroll events fire in real-time during smooth scroll animations.
*/
export default function ProjectsStack() {
  const cardEls = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [mountedSet, setMountedSet]   = useState<ReadonlySet<number>>(new Set([0]));

  const handleCardRef = useCallback((index: number, el: HTMLDivElement | null) => {
    cardEls.current[index] = el;
  }, []);

  useEffect(() => {
    const STUCK_THRESH = 10; // px — tolerance for "stuck at top"

    const update = () => {
      const vh = window.innerHeight;
      let nextActive  = 0;
      let enteringIdx = -1;

      cardEls.current.forEach((el, i) => {
        if (!el) return;
        const top = el.getBoundingClientRect().top;

        if (top >= -STUCK_THRESH && top <= STUCK_THRESH) {
          // Card is stuck at viewport top → track highest index
          nextActive = Math.max(nextActive, i);
        } else if (top > STUCK_THRESH && top < vh) {
          // Card is entering from below → track highest index
          enteringIdx = Math.max(enteringIdx, i);
        }
      });

      const next = new Set<number>();
      next.add(nextActive);
      if (enteringIdx >= 0) next.add(enteringIdx);

      setActiveIndex(nextActive);
      setMountedSet(next);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);

  return (
    <div className="projects-stack-outer" id="work">
      {projects.map((project, i) => (
        <ProjectCard
          key={project.number}
          project={project}
          index={i}
          isActive={activeIndex === i}
          isMounted={mountedSet.has(i)}
          onCardRef={handleCardRef}
        />
      ))}
    </div>
  );
}
