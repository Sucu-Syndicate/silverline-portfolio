'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';
import ScrollVelocity from '@/components/ui/ScrollVelocity';

/*
const posts = [
  { title: 'How I Shipped a SaaS in 3 Months as a CS Student', date: 'Sep 2026', href: '#' },
  { title: 'AI-Directed Pipelines: What That Actually Means', date: 'Aug 2026', href: '#' },
  { title: 'Building Velvet: Architecture Decisions I Would Make Again', date: 'Jul 2026', href: '#' },
];
*/

export default function Blog() {
  return (
    <section className="section" id="blog">
      <ScrollReveal>
        <div className="section-head">
          <div>
            <h2 className="section-title">BLOG</h2>
          </div>
        </div>
      </ScrollReveal>

      <div className="blog-wip">
        <ScrollReveal>
          <p className="blog-wip-note">Writing in progress — posts coming soon.</p>
        </ScrollReveal>
        <ScrollVelocity
          texts={['WRITING IN PROGRESS //', 'COMING SOON //']}
          velocity={60}
          numCopies={8}
        />
      </div>

      {/*
      <div className="blog-list">
        {posts.map((p, i) => (
          <ScrollReveal key={p.href + p.title} delay={i * 0.08}>
            <a href={p.href} className="blog-row">
              <span className="blog-row-title">{p.title}</span>
              <span className="blog-row-date">{p.date}</span>
            </a>
          </ScrollReveal>
        ))}
      </div>
      */}
    </section>
  );
}
