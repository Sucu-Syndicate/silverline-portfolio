'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

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
    <section className="section contact-cta" id="contact">
      <ScrollReveal>
        <h2 className="section-title">LET&apos;S CONNECT</h2>
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <p className="contact-cta-tagline">
          Always open to new projects, creative ideas, and opportunities worth pursuing — reach out.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.16}>
        <div className="contact-cta-actions">
          <button
            className={`contact-email-btn${copied ? ' contact-email-btn--copied' : ''}`}
            onClick={copyEmail}
            aria-label="Copy email address teh.dsc@gmail.com"
          >
            {/* Idle: mail icon + CONTACT — absolute overlay */}
            <span className="contact-email-btn__idle">
              <MailIcon />
              <span>CONTACT</span>
            </span>
            {/* Reveal: email + copy/check — in-flow, sets button width */}
            <span className="contact-email-btn__reveal" aria-hidden="true">
              <span className="contact-email-btn__addr">teh.dsc@gmail.com</span>
              {copied ? <CheckIcon /> : <CopyIcon />}
            </span>
          </button>
          <a href="#projects" className="hero-meta-primary">SEE PROJECTS</a>
        </div>
      </ScrollReveal>
    </section>
  );
}
