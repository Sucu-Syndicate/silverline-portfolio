import type { NextConfig } from "next";

const SECURITY_HEADERS = [
  // Prevent this site from being embedded in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing the content type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send origin when navigating to a same-origin URL
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features this site doesn't use
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

// @next/mdx is incompatible with Turbopack (Next.js 15 default bundler).
// Using next-mdx-remote for Server Component rendering instead.
// pageExtensions still set so .mdx files are recognized.
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: SECURITY_HEADERS,
      },
    ];
  },
};

export default nextConfig;
