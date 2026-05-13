import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/mdx";
import Footer from "@/components/layout/Footer";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  try {
    const { meta } = getPostBySlug(slug);
    return { title: `${meta.title} — Mathe`, description: meta.description };
  } catch {
    return {};
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  let post: ReturnType<typeof getPostBySlug>;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { meta, content, readTime } = post;

  return (
    <main>
      {/* Dark post header */}
      <div className="post-header">
        <div className="post-header-inner">
          <div className="post-header-meta">
            <span className="post-meta-date">{meta.date}</span>
            <span className="post-meta-sep">/</span>
            <span className="post-meta-tag">{meta.tag}</span>
            <span className="post-meta-sep">/</span>
            <span className="post-meta-readtime">{readTime} min read</span>
          </div>
          <h1 className="post-title">{meta.title}</h1>
        </div>
      </div>

      {/* Warm-cream reading area */}
      <div className="blog-reading-area">
        <article className="blog-prose">
          <MDXRemote source={content} />
        </article>
      </div>

      <Footer />
    </main>
  );
}
