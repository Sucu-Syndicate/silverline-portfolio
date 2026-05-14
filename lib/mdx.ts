import fs from "fs";
import path from "path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface PostMeta {
  title: string;
  date: string;
  slug: string;
  tag: string;
  description: string;
  readTime: number;
}

function calcReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export function getAllPosts(): PostMeta[] {
  const files = fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"));

  return files
    .map((filename) => {
      const slug = filename.replace(/\.mdx$/, "");
      const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
      const { data, content } = matter(raw);
      return {
        title: (data.title as string) ?? slug,
        date: (data.date as string) ?? "",
        slug,
        tag: (data.tag as string) ?? "",
        description: (data.description as string) ?? "",
        readTime: calcReadTime(content),
      };
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPostBySlug(slug: string): {
  meta: PostMeta;
  content: string;
  readTime: number;
} {
  const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);
  const readTime = calcReadTime(content);
  return {
    meta: {
      title: (data.title as string) ?? slug,
      date: (data.date as string) ?? "",
      slug,
      tag: (data.tag as string) ?? "",
      description: (data.description as string) ?? "",
      readTime,
    },
    content,
    readTime,
  };
}
