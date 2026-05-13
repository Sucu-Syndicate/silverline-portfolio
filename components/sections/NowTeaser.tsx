'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';


function getGreeting(hour: number) {
  if (hour < 6) return 'late · the quiet hours';
  if (hour < 12) return 'morning · coffee on';
  if (hour < 18) return 'afternoon · in flow';
  if (hour < 22) return 'evening · winding down';
  return 'late · the quiet hours';
}

export default function NowTeaser() {
  const [hovered, setHovered] = useState(false);
  const [greeting, setGreeting] = useState('');
  useEffect(() => {
    setGreeting(getGreeting(new Date().getHours()));
  }, []);

  return (
    <section
      className="section"
      id="now"
      style={{ paddingTop: 0, background: 'var(--bg)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link
          href="/now"
          className="now-block"
          style={{ background: hovered ? 'var(--accent-bg)' : 'var(--surface)' }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className="now-label">/now</div>
          <div>
            <div className="now-text">
              Drafting v2 of the portfolio system. Reading Kleppmann.
              Half a chapter behind on Velvet&apos;s task graph. Always Argentina time.
            </div>
          </div>
          <div className="now-greet">{greeting} →</div>
        </Link>
      </motion.div>
    </section>
  );
}
