'use client';

import dynamic from 'next/dynamic';
// @ts-ignore — React Bits component, no type declarations
import DecryptedText from '@/components/DecryptedText';

// Canvas backgrounds — dynamic ssr:false prevents server-side canvas errors
const SoftAurora = dynamic(() => import('@/components/SoftAurora'), { ssr: false });
const Threads    = dynamic(() => import('@/components/Threads'),    { ssr: false });
const Topography = dynamic(() => import('@/components/Topography'), { ssr: false });
const Waves      = dynamic(() => import('@/components/Waves'),      { ssr: false });

const projects = [
  {
    number: '01',
    label:  'PROJECT 01',
    name:   'VELVET',
    tagline: 'AI-native financial platform — built solo from architecture to deployment.',
    tags:   ['Next.js', 'Supabase', 'OpenAI'],
  },
  {
    number: '02',
    label:  'PROJECT 02',
    name:   'MYOBSCELIUM-MCP',
    tagline: 'Placeholder — add your tagline here.',
    tags:   ['Python', 'React', 'FastAPI'],
  },
  {
    number: '03',
    label:  'PROJECT 03',
    name:   'MERIDIAN SAGE',
    tagline: 'Placeholder — add your tagline here.',
    tags:   ['React', 'Tailwind', 'Node.js'],
  },
  {
    number: '04',
    label:  'PROJECT 04',
    name:   'FACTUR2D2',
    tagline: 'Placeholder — add your tagline here.',
    tags:   ['Python', 'Power Automate'],
  },
] as const;

function ProjectBackground({ index }: { index: number }) {
  // Velvet — dark navy + green aurora wash. Premium, financial.
  if (index === 0) {
    return (
      <SoftAurora
        color1="#0D1B26"
        color2="#5DA67A"
        speed={0.4}
        brightness={1.5}
        bandHeight={0.4}
        bandSpread={1.3}
        scale={1.2}
        enableMouseInteraction={false}
      />
    );
  }
  // Myopsilian — warm thread lines, delicate and analytical.
  if (index === 1) {
    return (
      <Threads
        color={[0.72, 0.71, 0.68]}
        amplitude={0.65}
        distance={0.25}
        enableMouseInteraction={false}
      />
    );
  }
  // Meridian Sage — topographic green contours, terrain / sage / meridian.
  if (index === 2) {
    return (
      <Topography
        lowColor="#5DA67A"
        midColor="#2E5842"
        highColor="#B8B6AD"
        thickness={0.012}
        fillBands={true}
        grain={false}
        bands={3}
        speed={0.25}
        mouseInteraction={false}
        opacity={1}
      />
    );
  }
  // Factorito — mechanical wave threads, rhythmic and precise.
  if (index === 3) {
    return (
      <Waves
        lineColor="#6E7068"
        backgroundColor="transparent"
        waveAmpX={18}
        waveAmpY={8}
        xGap={20}
        yGap={30}
        waveSpeedX={0.008}
        waveSpeedY={0.003}
      />
    );
  }
  return null;
}

export default function ProjectsStack() {
  return (
    <div className="projects-stack-outer" id="work">
      {projects.map((project, i) => (
        <div
          key={project.number}
          className={`project-card project-card--${i + 1}`}
          style={{ zIndex: i + 1 }}
        >
          {/* Canvas background — right half, faded */}
          <div className="project-card-bg" aria-hidden="true">
            <ProjectBackground index={i} />
          </div>

          {/* Left gradient veil — bleeds card background over the canvas */}
          <div className="project-card-veil" aria-hidden="true" />

          {/* Top edge shadow — depth when card slides under the next */}
          <div className="project-card-edge" aria-hidden="true" />

          {/* Content */}
          <div className="project-card-inner">
            <p className="project-card-label">{project.label}</p>
            <h2 className="project-card-title">
              <DecryptedText
                text={project.name}
                animateOn="view"
                sequential
                speed={35}
                characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$&"
                revealDirection="start"
                encryptedClassName="project-title-enc"
              />
            </h2>
            <p className="project-card-tagline">{project.tagline}</p>
            <div className="project-card-tags">
              {project.tags.map((tag) => (
                <span key={tag} className="project-card-tag">{tag}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
