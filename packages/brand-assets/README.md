# @yp/brand-assets

Centralized brand assets for the Youth Performance monorepo. All logos, images, videos, audio, and fonts in one place with TypeScript support and optimized WebP versions.

## 📦 Installation

This package is already part of the monorepo. Add it to your app's dependencies:

```json
{
  "dependencies": {
    "@yp/brand-assets": "workspace:*"
  }
}
```

## 🚀 Usage

### Import the asset constants

```typescript
import { LOGOS, IMAGES, VIDEOS, AUDIO, FONTS } from '@yp/brand-assets';

// Use in components
<img src={LOGOS.primary.svg} alt="YP Logo" />
<img src={IMAGES.hero.court} alt="Basketball court" />
```

### Use optimized images with WebP fallback

```typescript
import { IMAGES, getOptimizedImage } from '@yp/brand-assets';

// Get optimized image with srcSet
const heroImage = getOptimizedImage(IMAGES.team.james.hero);
// Returns: { src: '/brand-assets/images/team/hero.jpeg', srcSet: '/brand-assets/images/team/hero.webp 1x' }

// Use in React/Next.js
<picture>
  <source srcSet={heroImage.srcSet} type="image/webp" />
  <img src={heroImage.src} alt="James" />
</picture>
```

### Use videos with format fallback

```typescript
import { VIDEOS, getOptimizedVideo } from '@yp/brand-assets';

const loaderVideo = getOptimizedVideo(VIDEOS.loaders.main);

<video autoPlay muted loop>
  <source src={loaderVideo.webm} type="video/webm" />
  <source src={loaderVideo.mp4} type="video/mp4" />
</video>
```

## 📁 Folder Structure

```
packages/brand-assets/
├── logos/
│   ├── primary/          # Main YP logos (SVG, PNG, wordmark)
│   ├── variants/         # Alternative logos (wolf, favicons, color variants)
│   └── sports/           # Sports league logos (NBA, NFL, etc.)
├── images/
│   ├── hero/             # Hero/feature images
│   ├── team/             # Team member photos (James, Adam)
│   ├── academy/          # Academy photos
│   ├── products/         # E-commerce product images
│   ├── icons/            # Brand icons and graphics
│   ├── thumbnails/       # Thumbnail images
│   └── backgrounds/      # Background images
├── videos/
│   ├── loaders/          # Loading animations
│   ├── promotional/      # Brand videos
│   └── product-demos/    # Product demonstration videos
├── audio/
│   └── sfx/              # Sound effects
├── fonts/                # Brand fonts
├── index.ts              # TypeScript exports
├── package.json
└── README.md
```

## 🖼️ Asset Categories

### Logos
| Category | Description | Formats |
|----------|-------------|---------|
| `primary` | Main YP logo and wordmark | SVG, PNG |
| `variants` | Wolf mascot, favicons, color variants | PNG, SVG |
| `sports` | League partner logos (NBA, NFL, etc.) | WebP, PNG |

### Images
| Category | Description | Formats |
|----------|-------------|---------|
| `hero` | Hero/feature images | PNG, WebP |
| `team` | Founder and team photos | JPEG, PNG, WebP |
| `academy` | Academy training photos | JPEG, WebP |
| `products` | E-commerce product shots | PNG, JPEG, WebP |
| `icons` | Branded icons | WebP, PNG |
| `thumbnails` | Thumbnail previews | WebP |
| `backgrounds` | Background textures | JPEG, PNG, WebP |

### Videos
| Category | Description | Formats |
|----------|-------------|---------|
| `loaders` | Loading animations | MP4, WebM |
| `promotional` | Brand videos | MP4, WebM, GIF |
| `product-demos` | Product demonstrations | MP4 |

### Audio
| Category | Description | Format |
|----------|-------------|--------|
| `sfx` | Sound effects | MP3 |

### Fonts
| Font | Use Case | Format |
|------|----------|--------|
| Space Grotesk | Primary display font | TTF (variable) |
| Power Grotesk | Bold headings | WOFF |
| Bebas Neue | Headings/titles | TTF |

## ⚡ Optimization Results

The asset organization achieved:
- **171.2 MB saved** (83.4% reduction)
- All images have WebP versions for modern browsers
- All videos have WebM versions for better compression
- Duplicates removed across apps

## 🔗 Linking to Apps

To serve these assets from your app, you have two options:

### Option 1: Symlink (Recommended for development)

In your app's `public` folder:
```bash
ln -s ../../packages/brand-assets public/brand-assets
```

### Option 2: Copy during build

In your build script:
```json
{
  "scripts": {
    "prebuild": "cp -r ../../packages/brand-assets ./public/brand-assets"
  }
}
```

### Option 3: Next.js configuration

```javascript
// next.config.js
module.exports = {
  async rewrites() {
    return [
      {
        source: '/brand-assets/:path*',
        destination: '../../packages/brand-assets/:path*',
      },
    ];
  },
};
```

## 📋 Migration Guide

### From scattered assets to centralized

Replace old imports:
```typescript
// Before (scattered)
<img src="/logo/yp-logo.png" />
<img src="/images/james/hero.jpeg" />

// After (centralized)
import { LOGOS, IMAGES } from '@yp/brand-assets';
<img src={LOGOS.primary.png} />
<img src={IMAGES.team.james.hero.original} />
```

## 🛠️ Maintenance

### Adding new assets

1. Add the file to the appropriate folder
2. Update `index.ts` with the new path
3. Run the optimizer for images: `python3 organize_assets.py`

### Re-optimizing assets

```bash
cd packages/brand-assets
python3 organize_assets.py
```
