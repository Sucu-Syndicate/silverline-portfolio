'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    // ── Project card snap ────────────────────────────────────────────────────
    // Lenis v1 ignores CSS scroll-snap, so we snap programmatically.
    // When scroll settles (velocity → 0) inside the project section,
    // we snap to the nearest card boundary (sectionTop + n * vh).
    let isSnapping = false;

    lenis.on('scroll', ({ scroll, velocity }: { scroll: number; velocity: number }) => {
      if (isSnapping) return;

      const section = document.getElementById('projects');
      if (!section) return;

      const vh = window.innerHeight;
      const sectionTop = section.offsetTop;

      // Only engage within the snap zone (entry edge → past card 3 entry)
      if (scroll < sectionTop - vh * 0.5 || scroll > sectionTop + vh * 2.5) return;

      // Wait for scroll to settle
      if (Math.abs(velocity) > 0.08) return;

      const snapPoints = [sectionTop, sectionTop + vh, sectionTop + vh * 2];
      const nearest = snapPoints.reduce((a, b) =>
        Math.abs(b - scroll) < Math.abs(a - scroll) ? b : a
      );

      // Only snap if meaningfully off-target (avoids micro-jitter loops)
      if (Math.abs(nearest - scroll) > 4) {
        isSnapping = true;
        lenis.scrollTo(nearest, {
          onComplete: () => { isSnapping = false; },
        });
      }
    });
    // ────────────────────────────────────────────────────────────────────────

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const id = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
    };
  }, []);

  return null;
}
