import Link from 'next/link';

export default function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="brand">
        matheog<span style={{ color: 'var(--accent)' }}>.</span>
      </Link>

      <ul>
        <li><Link href="/blog">Writing</Link></li>
        <li><Link href="#projects">Work</Link></li>
        <li><Link href="/about">About</Link></li>
      </ul>
    </header>
  );
}
