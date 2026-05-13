'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function WipBand() {
  return (
    <section
      style={{
        background: 'var(--surface)',
        padding: 'clamp(80px, 12vh, 140px) clamp(20px, 4vw, 56px)',
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-structure)',
              fontWeight: 800,
              fontSize: 'clamp(28px, 4vw, 44px)',
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              color: 'var(--text)',
              margin: '0 0 12px',
            }}
          >
            The full site is on its way.
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-structure)',
              fontWeight: 400,
              fontSize: 16,
              lineHeight: 1.55,
              color: 'var(--text-2)',
              margin: '0 0 28px',
            }}
          >
            In the meantime — the blog is live. That&apos;s the point anyway.
          </p>
          <Link href="/blog" className="section-link">
            Read the blog →
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
