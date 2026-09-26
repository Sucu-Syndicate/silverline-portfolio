'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

const links = [
  { label: 'About',   href: '#about'   },
  { label: 'Skills',  href: '#skills'  },
  { label: 'Work',    href: '#work'    },
  { label: 'Blog',    href: '#blog'    },
  { label: 'Contact', href: '#contact' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setScrolled(!e.isIntersecting),
      { threshold: 0 },
    );
    const sentinel = document.getElementById('nav-sentinel');
    if (sentinel) obs.observe(sentinel);
    return () => obs.disconnect();
  }, []);

  return (
    <header
      className="nav"
      style={{
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        background: scrolled ? 'rgba(15,16,14,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
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
