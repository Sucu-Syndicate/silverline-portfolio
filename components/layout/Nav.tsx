'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const links = [
  { label: 'About',   href: '#about'   },
  { label: 'Projects', href: '/projects' },
  { label: 'Posts',   href: '/posts'   },
  { label: 'Contact', href: '/#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById('nav-sentinel');
    if (!sentinel) return;
    const obs = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { threshold: 0 },
    );
    obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <header className={`nav${scrolled ? ' nav--pill' : ''}`}>
      <Link href="/" className="brand">matheo.guevara.ar</Link>
      <nav>
        <ul>
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
