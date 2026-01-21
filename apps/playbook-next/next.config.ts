import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable static exports for truly static pages
  // output: 'export', // Uncomment for full static export
  
  // Cloudflare Pages compatibility
  experimental: {
    // Enable PPR (Partial Prerendering) when available
    // ppr: true,
  },
  
  // Image optimization for Cloudflare
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net', // Cloudflare Images
      },
      {
        protocol: 'https',
        hostname: '*.r2.dev', // Cloudflare R2
      },
      {
        protocol: 'https',
        hostname: 'customer-*.cloudflarestream.com', // Cloudflare Stream thumbnails
      },
    ],
  },
  
  // Headers for Answer Engine API
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ];
  },
  
  // Rewrites for API routes to Convex (if needed)
  async rewrites() {
    return [];
  },
};

export default nextConfig;
