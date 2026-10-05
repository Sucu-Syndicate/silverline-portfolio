'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import ScrollReveal from '@/components/ui/ScrollReveal';
import BorderGlow from '@/components/ui/BorderGlow';

const FlexCarousel = dynamic(() => import('@/components/ui/FlexCarousel'), { ssr: false });

const CAROUSEL_ITEMS = [
  { src: '/images/carousel/c09.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c03.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c14.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c05.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c01.webp', alt: 'Project screenshot' },
  { src: '/images/carousel/c11.webp', alt: 'Project screenshot' },
];

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M22 7l-10 7L2 7" />
    </svg>
  );
}

function CopyIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="9" y="9" width="13" height="13" rx="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function Contact() {
  const [copied, setCopied] = useState(false);

  function copyEmail() {
    navigator.clipboard.writeText('teh.dsc@gmail.com').then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <section id="contact">
      <div className="projects-see-all">
        {/* Background carousel */}
        <div className="projects-see-all-carousel-bg" aria-hidden="true">
          <FlexCarousel
            items={CAROUSEL_ITEMS}
            preset="liquid"
            intro="deal"
            cardHeight={0.5}
            gap={12}
            bend={0.38}
            reach={0.40}
            squeeze={0.2}
            focusOnClick={false}
            captions={false}
            captureWheel={false}
            autoplay
          />
        </div>
        <BorderGlow
          backgroundColor="#0F100E"
          borderRadius={28}
          glowColor="42 18 60"
          colors={['#E8E6DD', '#B8B6AD', '#E8E6DD']}
          glowRadius={52}
          glowIntensity={0.9}
          fillOpacity={0.18}
          alwaysOn
        >
          <div className="projects-see-all-inner">
            <div className="projects-see-all-text">
              <ScrollReveal delay={0.08}>
                <h2 className="projects-see-all-heading">LET&apos;S CONNECT</h2>
              </ScrollReveal>
              <ScrollReveal delay={0.16}>
                <p className="projects-see-all-sub">
                  Always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Just reach out.
                </p>
              </ScrollReveal>
            </div>
            <ScrollReveal delay={0.22}>
              <div className="contact-cta-actions">
                <button
                  className={`contact-email-btn${copied ? ' contact-email-btn--copied' : ''}`}
                  onClick={copyEmail}
                  aria-label="Copy email address teh.dsc@gmail.com"
                >
                  <span className="contact-email-btn__idle">
                    <MailIcon />
                    <span>CONTACT</span>
                  </span>
                  <span className="contact-email-btn__reveal" aria-hidden="true">
                    {copied ? <CheckIcon /> : <CopyIcon />}
                    <span className="contact-email-btn__addr">teh.dsc@gmail.com</span>
                  </span>
                </button>
                <a href="/projects" className="projects-see-all-btn">
                  See all projects
                </a>
              </div>
            </ScrollReveal>
          </div>
        </BorderGlow>
      </div>
    </section>
  );
}
