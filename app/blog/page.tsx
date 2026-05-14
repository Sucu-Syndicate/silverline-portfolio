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
          <span className="blog-header-eyebrow">the notes.</span>
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
