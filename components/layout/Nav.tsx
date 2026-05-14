import Link from 'next/link';

export default function Nav() {
  return (
    <header className="nav">
      <Link href="/" className="brand">
        matheog<span style={{ color: 'var(--accent)' }}>.</span>
      </Link>

      <ul>
        <li><Link href="/blog">Blog</Link></li>
        <li><span className="nav-disabled">Work</span></li>
        <li><span className="nav-disabled">About</span></li>
      </ul>
    </header>
  );
}
