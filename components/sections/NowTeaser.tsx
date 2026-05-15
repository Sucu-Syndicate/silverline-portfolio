'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function NowTeaser() {
  return (
    <section className="section" id="now" style={{ paddingTop: 0, background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link href="/now" className="now-block">
          <div className="now-left">
            <div className="now-slug">/now</div>
          </div>
          <div className="now-right">
            <div className="now-text">
              Drafting v2 of the portfolio system. Reading Kleppmann.
              Half a chapter behind on Velvet&apos;s task graph. Always Argentina time.
            </div>
            <div className="now-footer">
              <div className="now-updated">
                Updated — <span className="now-date">May 2026</span>
              </div>
              <Link href="/blog" className="now-cta" onClick={(e) => e.stopPropagation()}>
                Read more →
              </Link>
            </div>
          </div>
        </Link>
      </motion.div>
    </section>
  );
}
