import type { NextConfig } from "next";

// Content-Security-Policy notes:
// - 'unsafe-inline' + 'unsafe-eval' (script): Next.js App Router injects inline scripts at runtime
//   (router bootstrap, server action hydration). These cannot be nonce'd without a custom middleware.
//   'unsafe-eval' is also required by Three.js/R3F for runtime GLSL shader compilation.
// - 'unsafe-inline' (style): required by next/font/google's inline style injection
// - fonts.googleapis.com (style-src): ASCIIText.tsx uses a runtime @import url() for IBM Plex Mono
// - fonts.gstatic.com (font-src): Google Fonts CDN serves the actual font binary files
// - blob: (img, worker): used by WebGL canvas readback and potential workers
// When adding Supabase: add *.supabase.co to connect-src
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' fonts.googleapis.com",
  "font-src 'self' fonts.gstatic.com data:",
  "connect-src 'self'",
  "img-src 'self' data: blob: https://cdn.simpleicons.org",
  "worker-src blob:",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const SECURITY_HEADERS = [
  // Prevent this site from being embedded in iframes (clickjacking)
  { key: "X-Frame-Options", value: "DENY" },
  // Stop browsers from MIME-sniffing the content type
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Only send origin when navigating to a same-origin URL
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Disable browser features this site doesn't use
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), accelerometer=(), gyroscope=(), magnetometer=()" },
  // Force HTTPS for 1 year (Vercel enforces HTTPS; this tells browsers to pre-commit)
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  // Prevent cross-origin sites from hotlinking this origin's resources
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  // XSS / injection mitigation fallback and script blocking
  { key: "Content-Security-Policy", value: CSP },
];

// @next/mdx is incompatible with Turbopack (Next.js 15 default bundler).
// Using next-mdx-remote for Server Component rendering instead.
// pageExtensions still set so .mdx files are recognized.
const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "mdx"],
  async redirects() {
    return [
      { source: '/work', destination: '/projects', permanent: true },
    ];
  },
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
