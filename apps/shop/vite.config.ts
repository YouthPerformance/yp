import {defineConfig} from 'vite';
import {hydrogen} from '@shopify/hydrogen/vite';
import {vitePlugin as remix} from '@remix-run/dev';
import {vercelPreset} from '@vercel/remix/vite';
import tsconfigPaths from 'vite-tsconfig-paths';

// Note: oxygen() plugin removed for Vercel deployment
// For Shopify Oxygen deployment, add it back with: import {oxygen} from '@shopify/mini-oxygen/vite';

export default defineConfig({
  plugins: [
    hydrogen(),
    remix({
      presets: [hydrogen.preset(), vercelPreset()],
      buildDirectory: 'build',
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
      },
    }),
    tsconfigPaths(),
  ],
  build: {
    assetsInlineLimit: 0,
  },
  ssr: {
    optimizeDeps: {
      include: ['typographic-base'],
    },
  },
});
