'use client';

// @ts-ignore — React Bits component, no type declarations
import DecryptedText from '@/components/DecryptedText';

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

export default function ProjectsStack() {
  return (
    <div className="projects-stack-outer" id="work">
      {projects.map((project, i) => (
        <div
          key={project.number}
          className={`project-card project-card--${i + 1}`}
          style={{ zIndex: i + 1 }}
        >
          {/* CSS-animated background — compositor-threaded, zero JS overhead */}
          <div className="project-card-bg" aria-hidden="true">
            <div className={`project-card-bg-fill project-card-bg-fill--${i + 1}`} />
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
                rootMargin="0px 0px 400px 0px"
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
