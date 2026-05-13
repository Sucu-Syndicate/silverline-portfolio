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
          <span className="blog-header-eyebrow">From Buenos Aires</span>
          <h1 className="blog-header-title">Writing.</h1>
          <p className="blog-header-sub">
            Code, decisions, and what I learned building in public.
          </p>
        </div>
      </section>

      <section className="blog-list-section">
        <div className="blog-list">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="blog-row"
            >
              <span className="blog-row-date">{post.date}</span>
              <span className="blog-row-tag">{post.tag}</span>
              <span className="blog-row-title">{post.title}</span>
              <span className="blog-row-arrow">→</span>
            </Link>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  );
}
