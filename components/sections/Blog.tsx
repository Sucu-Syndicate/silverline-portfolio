const posts = [
  { title: 'How I Shipped a SaaS in 3 Months as a CS Student', date: 'Sep 2026', href: '#' },
  { title: 'AI-Directed Pipelines: What That Actually Means', date: 'Aug 2026', href: '#' },
  { title: 'Building Velvet: Architecture Decisions I Would Make Again', date: 'Jul 2026', href: '#' },
];

export default function Blog() {
  return (
    <section className="section" id="blog">
      <div className="section-head">
        <div>
          <p className="section-label">Blog</p>
          <h2 className="section-title">BLOG</h2>
        </div>
      </div>

      <div className="blog-list">
        {posts.map((p) => (
          <a key={p.href + p.title} href={p.href} className="blog-row">
            <span className="blog-row-title">{p.title}</span>
            <span className="blog-row-date">{p.date}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
