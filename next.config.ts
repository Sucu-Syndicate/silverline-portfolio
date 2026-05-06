import type { NextConfig } from "next";

// @next/mdx is incompatible with Turbopack (Next.js 15 default bundler).
// Using next-mdx-remote for Server Component rendering instead.
// pageExtensions still set so .mdx files are recognized.
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
};

export default nextConfig;
