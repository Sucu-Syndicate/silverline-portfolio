'use client';

import ScrollReveal from '@/components/ui/ScrollReveal';

export default function Blog() {
  return (
    <section className="section" id="posts">
      <ScrollReveal>
        <div className="section-head">
          <div>
            <h2 className="section-title">POSTS</h2>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <p style={{ color: 'var(--text-dim)', fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', letterSpacing: '0.04em' }}>
          Writing in progress.
        </p>
      </ScrollReveal>
    </section>
  );
}
