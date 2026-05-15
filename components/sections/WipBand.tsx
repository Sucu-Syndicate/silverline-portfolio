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
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          <div className="section-label" style={{ color: 'var(--accent)' }}>
            WIP
          </div>

          <h2
            style={{
              fontFamily: 'var(--font-structure)',
              fontWeight: 800,
              fontSize: 'clamp(36px, 5vw, 60px)',
              lineHeight: 1.0,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
              margin: 0,
            }}
          >
            Rome wasn&apos;t built<br />in a day.
          </h2>

          <p
            style={{
              fontFamily: 'var(--font-structure)',
              fontWeight: 400,
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              lineHeight: 1.55,
              color: 'var(--text-2)',
              margin: 0,
              maxWidth: 480,
            }}
          >
            This site is still being worked on.
          </p>

          <p
            style={{
              fontFamily: 'var(--font-structure)',
              fontWeight: 400,
              fontSize: 14,
              lineHeight: 1.6,
              color: 'var(--text-2)',
              margin: 0,
              maxWidth: 440,
            }}
          >
            While you wait — take a look at the blog, you&apos;ll find interesting notes about how the real stuff is made.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginTop: 8 }}>
            <Link
              href="/blog"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 11,
                letterSpacing: '0.10em',
                textTransform: 'uppercase',
                color: 'var(--bg)',
                background: 'var(--accent)',
                padding: '12px 24px',
                textDecoration: 'none',
                display: 'inline-block',
                fontWeight: 500,
              }}
            >
              → Read the blog
            </Link>

            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 12,
                letterSpacing: '0.06em',
                color: 'var(--text-dim)',
              }}
            >
              Or just hang around.
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
