'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NowTeaser() {
  const router = useRouter();

  return (
    <section className="section" id="now" style={{ paddingTop: 0, background: 'var(--bg)' }}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div
          className="now-block"
          onClick={() => router.push('/now')}
          style={{ cursor: 'pointer' }}
        >
          <div className="now-left">
            <div className="now-slug">/now</div>
          </div>
          <div className="now-right">
            <div className="now-text">
              Portfolio MVP shipped, working on the first real posts.
              Velvet&apos;s in active development, working on the frontend (again).
            </div>
            <div className="now-footer">
              <div className="now-updated">
                Updated — <span className="now-date">May 2026</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
