// ═══════════════════════════════════════════════════════════
// NEXT.JS CONFIG
// YP Academy PWA
// ═══════════════════════════════════════════════════════════

import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const monorepoRoot = resolve(__dirname, "../..");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─────────────────────────────────────────────────────────
  // OUTPUT MODE - Standalone for monorepo deployments
  // ─────────────────────────────────────────────────────────
  output: "standalone",

  // ─────────────────────────────────────────────────────────
  // URL CONSISTENCY
  // ─────────────────────────────────────────────────────────
  trailingSlash: false,

  // ─────────────────────────────────────────────────────────
  // TRANSPILE PACKAGES (for CSS imports from @yp/ui)
  // ─────────────────────────────────────────────────────────
  transpilePackages: ["@yp/ui"],

  // ─────────────────────────────────────────────────────────
  // MONOREPO SUPPORT
  // ─────────────────────────────────────────────────────────
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,

  // ─────────────────────────────────────────────────────────
  // EXPERIMENTAL FEATURES
  // ─────────────────────────────────────────────────────────
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },

  // ─────────────────────────────────────────────────────────
  // IMAGES
  // ─────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },

  // ─────────────────────────────────────────────────────────
  // REDIRECTS (Domain Migration)
  // ─────────────────────────────────────────────────────────
  async redirects() {
    return [
      // Redirect old domain to new domain (301 permanent)
      {
        source: "/:path*",
        has: [{ type: "host", value: "academy.youthperformance.com" }],
        destination: "https://app.youthperformance.com/:path*",
        permanent: true,
      },
    ];
  },

  // ─────────────────────────────────────────────────────────
  // HEADERS (PWA + Security)
  // ─────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
        ],
      },
      {
        source: "/sw.js",
        headers: [
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },

  // ─────────────────────────────────────────────────────────
  // WEBPACK (for sound files)
  // ─────────────────────────────────────────────────────────
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp3|wav|ogg)$/,
      type: "asset/resource",
    });
    return config;
  },
};

export default nextConfig;
