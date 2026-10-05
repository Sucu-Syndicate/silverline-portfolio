'use client';

import { useEffect, useReducer, useRef } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

const SLIDES = [
  { src: '/mockups/velvet/dashboard.png',      alt: 'Velvet dashboard' },
  { src: '/mockups/velvet/catalog.png',        alt: 'Velvet course catalog' },
  { src: '/mockups/velvet/course-details.png', alt: 'Velvet course details' },
  { src: '/mockups/velvet/quiz.png',           alt: 'Velvet quiz' },
  { src: '/mockups/velvet/login.png',          alt: 'Velvet login' },
  { src: '/mockups/velvet/footer.png',         alt: 'Velvet home' },
];

const SLIDE_DURATION = 3000;
const FADE_DURATION  = 0.6;

// URL labels per slide
const URLS = [
  'velvet.app/dashboard',
  'velvet.app/cursos',
  'velvet.app/cursos/peluqueria-basica',
  'velvet.app/quiz',
  'velvet.app/iniciar-sesion',
  'velvet.app/',
];

export default function VelvetMockup() {
  const reduce = useReducedMotion();
  const [index, next] = useReducer((i: number) => (i + 1) % SLIDES.length, 0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (reduce) return;
    timerRef.current = setInterval(next, SLIDE_DURATION);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [reduce]);

  const slide = SLIDES[index];
  const url   = URLS[index];

  return (
    <div className="velvet-mockup" aria-label="Velvet app preview">
      {/* Browser chrome */}
      <div className="velvet-mockup-chrome">
        {/* Traffic lights */}
        <div className="velvet-mockup-dots" aria-hidden="true">
          <span className="velvet-dot velvet-dot--red"   />
          <span className="velvet-dot velvet-dot--yellow"/>
          <span className="velvet-dot velvet-dot--green" />
        </div>
        {/* URL bar */}
        <div className="velvet-mockup-url" aria-hidden="true">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5, flexShrink: 0 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="velvet-mockup-url-text">{url}</span>
        </div>
      </div>

      {/* Screenshot area */}
      <div className="velvet-mockup-screen">
        <AnimatePresence>
          <motion.img
            key={slide.src}
            src={slide.src}
            alt={slide.alt}
            className="velvet-mockup-img"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: FADE_DURATION, ease: [0.16, 1, 0.3, 1] }}
            draggable={false}
          />
        </AnimatePresence>
        {/* Slide indicator dots */}
        <div className="velvet-mockup-indicators" aria-hidden="true">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className="velvet-mockup-dot-indicator"
              data-active={i === index ? '' : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
