'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ui/ScrollReveal';

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
        <p className="section-label">Connect</p>
      </ScrollReveal>
      <ScrollReveal delay={0.06}>
        <h2 className="section-title">LET&apos;S CONNECT</h2>
      </ScrollReveal>
      <ScrollReveal delay={0.12}>
        <p className="contact-cta-tagline">
          Always open to new projects, creative ideas, and opportunities worth pursuing.
          If it sounds interesting — reach out.
        </p>
      </ScrollReveal>
      <ScrollReveal delay={0.18}>
        <div className="contact-cta-actions">
          <button className="hero-meta-primary" onClick={copyEmail}>
            {copied ? 'COPIED' : 'teh.dsc@gmail.com'}
          </button>
          <a href="#projects" className="hero-meta-primary">SEE PROJECTS</a>
        </div>
      </ScrollReveal>
    </section>
  );
}
