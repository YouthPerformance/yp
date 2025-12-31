// ═══════════════════════════════════════════════════════════
// NEXT.JS CONFIG
// Barefoot Reset PWA
// ═══════════════════════════════════════════════════════════

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─────────────────────────────────────────────────────────
  // TURBOPACK CONFIG (Next.js 16 default)
  // ─────────────────────────────────────────────────────────
  turbopack: {
    // Enable Turbopack with empty config to silence webpack warning
  },

  // ─────────────────────────────────────────────────────────
  // EXPERIMENTAL FEATURES
  // ─────────────────────────────────────────────────────────
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // ─────────────────────────────────────────────────────────
  // IMAGES
  // ─────────────────────────────────────────────────────────
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // ─────────────────────────────────────────────────────────
  // HEADERS (PWA + Security)
  // ─────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Service-Worker-Allowed',
            value: '/',
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
      type: 'asset/resource',
    });
    return config;
  },
};

export default nextConfig;
