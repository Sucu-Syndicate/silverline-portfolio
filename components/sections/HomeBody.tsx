import Link from 'next/link';

const projects = [
  {
    title: 'Gloss Academy',
    description: 'Hairdressing education platform',
    tags: ['Next.js', 'Supabase', 'Fly.io'],
  },
  {
    title: 'This portfolio',
    description: 'In progress',
    tags: ['Next.js', 'MDX', 'Framer'],
  },
];

const posts = [
  { date: 'Apr 2026', title: 'How I structured a solo SaaS build', tag: 'Process' },
  { date: 'Mar 2026', title: 'The Obsidian system behind this project', tag: 'Product' },
  { date: 'Feb 2026', title: 'Choosing Supabase for a hairdressing app', tag: 'Technical' },
];

export default function HomeBody() {
  return (
    <section id="work" className="bg-parchment py-24 px-6 max-w-screen-xl mx-auto">

      {/* ── Work ──────────────────────────────────────── */}
      <p className="font-archivo font-bold text-[10px] tracking-[0.10em] uppercase text-text-secondary mb-3">
        Work
      </p>
      <h2 className="font-archivo font-extrabold text-[32px] leading-tight [letter-spacing:-0.02em] text-text-primary mb-8">
        Things I&apos;ve built
      </h2>

      <div className="grid grid-cols-2 gap-4 mb-16">
        {projects.map((project) => (
          <div key={project.title} className="bg-linen rounded-none p-6">
            <h3 className="font-archivo font-bold text-[18px] text-text-primary mb-1">
              {project.title}
            </h3>
            <p className="font-archivo font-normal text-[15px] text-text-secondary mb-4">
              {project.description}
            </p>
            {/* Stack tags — Geist Mono instance 2 of 3 (shared across both cards) */}
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="font-mono text-[11px] tracking-[0.02em] text-text-secondary bg-code-surface px-2 py-0.5"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="w-full h-px bg-border-warm mb-16" />

      {/* ── Writing ───────────────────────────────────── */}
      <p className="font-archivo font-bold text-[10px] tracking-[0.10em] uppercase text-text-secondary mb-3">
        Writing
      </p>
      <h2 className="font-archivo font-bold text-[24px] leading-tight [letter-spacing:-0.02em] text-text-primary mb-6">
        From the blog
      </h2>

      <div className="flex flex-col divide-y divide-border-warm mb-16">
        {posts.map((post) => (
          <div key={post.title} className="flex items-center gap-6 py-4">
            {/* Date — Geist Mono instance 3 of 3 */}
            <span className="font-mono text-[11px] tracking-[0.02em] text-text-secondary w-20 shrink-0">
              {post.date}
            </span>
            <span className="font-archivo font-medium text-[15px] text-text-primary flex-1">
              {post.title}
            </span>
            <span className="font-archivo font-bold text-[10px] tracking-[0.10em] uppercase px-2 py-0.5 bg-accent-bg text-accent rounded-full shrink-0">
              {post.tag}
            </span>
          </div>
        ))}
      </div>

      {/* ── Now teaser ────────────────────────────────── */}
      <Link
        href="/now"
        className="font-archivo font-semibold text-[17px] text-text-primary transition-colors duration-150 hover:text-accent"
      >
        ↗ What I&apos;m working on right now
      </Link>

    </section>
  );
}
