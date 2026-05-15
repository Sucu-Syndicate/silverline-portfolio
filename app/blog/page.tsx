import Link from "next/link";
import { getAllPosts } from "@/lib/mdx";
import Footer from "@/components/layout/Footer";

export const metadata = {
  title: "Writing — Mathe",
  description: "Code, decisions, and what I learned building in public.",
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <main>
      <section className="blog-header">
        <div className="blog-header-inner">
          <span className="blog-header-eyebrow">the notes</span>
          <h1 className="blog-header-title">Writing.</h1>
          <p className="blog-header-sub">
            Code, decisions, and what I learned building in public.
          </p>
        </div>
      </section>

      <section className="blog-list-section">
        <div className="note-list">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="note-card"
            >
              <span className="note-arrow">↗</span>
              <div className="note-header">
                <div className="note-header-left">
                  <span className="note-icon" aria-hidden="true">
                    <svg width="14" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                      <polyline points="14,2 14,8 20,8"/>
                      <line x1="16" y1="13" x2="8" y2="13"/>
                      <line x1="16" y1="17" x2="8" y2="17"/>
                    </svg>
                  </span>
                  <span className="note-date">{post.date}</span>
                  <div className="note-sep" />
                  <span className="note-tag">{post.tag}</span>
                </div>
                <span className="note-readtime">{post.readTime} min read</span>
              </div>
              <div className="note-body">
                <div className="note-title">{post.title}</div>
                {post.description && (
                  <div className="note-desc">{post.description}</div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
