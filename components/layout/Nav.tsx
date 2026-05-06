'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { label: 'Work', href: '/work' },
  { label: 'Writing', href: '/blog' },
  { label: 'About', href: '/about' },
];

export default function Nav() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('hero-sentinel');

    // No hero on this page — default to light state
    if (!sentinel) {
      setIsLight(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        // Switch to light when sentinel (hero bottom) leaves viewport
        setIsLight(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isLight
          ? 'bg-parchment border-b border-border-warm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <nav className="flex items-center justify-between px-8 lg:px-16 h-14">
        {/* Logo placeholder — Mathe decides content later */}
        <div />

        <ul className="flex items-center gap-8">
          {NAV_LINKS.map(({ label, href }) => (
            <li key={label}>
              <Link
                href={href}
                className={`font-archivo font-medium text-[14px] transition-colors duration-150 ${
                  isLight
                    ? 'text-text-primary'
                    : 'text-hero-text opacity-70'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
