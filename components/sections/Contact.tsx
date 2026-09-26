'use client';

import { useRef } from 'react';
import type { MouseEvent } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import ScrollReveal from '@/components/ui/ScrollReveal';

function MagneticButton() {
  const ref = useRef<HTMLButtonElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 150, damping: 15 });
  const y = useSpring(rawY, { stiffness: 150, damping: 15 });

  function onMouseMove(e: MouseEvent<HTMLButtonElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    rawX.set((e.clientX - (rect.left + rect.width / 2)) * 0.35);
    rawY.set((e.clientY - (rect.top + rect.height / 2)) * 0.35);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <motion.button
      ref={ref}
      type="submit"
      className="magnetic-btn"
      style={{ x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      SEND
    </motion.button>
  );
}

export default function Contact() {
  return (
    <section className="section" id="contact">
      <ScrollReveal>
        <div className="section-head">
          <div>
            <p className="section-label">Contact</p>
            <h2 className="section-title">CONTACT</h2>
          </div>
        </div>
      </ScrollReveal>

      <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
        <ScrollReveal delay={0.08}>
          <input
            className="contact-input"
            type="text"
            name="name"
            placeholder="Name"
            autoComplete="off"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.15}>
          <textarea
            className="contact-textarea"
            name="message"
            placeholder="Message"
          />
        </ScrollReveal>
        <ScrollReveal delay={0.22}>
          <div className="magnetic-wrap">
            <MagneticButton />
          </div>
        </ScrollReveal>
      </form>
    </section>
  );
}
