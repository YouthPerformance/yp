# Spec 010: Marketing Layer Components

> **Codename:** Digital Supercar
> **Status:** Draft
> **Created:** 2026-01-17
> **Depends On:** 008-james-profile, 009-adam-profile-v2

---

## Summary

A shared component library for high-performance marketing pages within the Next.js web-academy app. These components power both the James Scott and Adam Harrington profile pages, ensuring consistent interaction patterns while allowing visual differentiation through theming.

---

## 1. Architecture Overview

```
apps/web-academy/src/
├── app/
│   ├── james/          # Uses marketing components
│   └── adam/           # Uses marketing components
└── components/
    └── marketing/      # Shared marketing layer
        ├── heroes/
        │   ├── UnicornHero.tsx
        │   └── VideoHero.tsx
        ├── scroll/
        │   ├── ParallaxDeck.tsx
        │   ├── StickySection.tsx
        │   └── ScrollReveal.tsx
        ├── marquee/
        │   ├── VelocityMarquee.tsx
        │   └── LogoMarquee.tsx
        ├── interactive/
        │   ├── MagneticButton.tsx
        │   ├── TimelineDrawer.tsx
        │   └── HoverCard.tsx
        ├── effects/
        │   ├── GrainOverlay.tsx
        │   └── MotionConfig.tsx
        └── index.ts
```

---

## 2. Component Specifications

### 2.1 UnicornHero

**Purpose:** WebGL-powered hero section with mouse-linked distortion effects.

**Props:**
```typescript
interface UnicornHeroProps {
  projectId: string;           // Unicorn Studio project ID
  videoSrc?: string;           // Optional video source
  posterSrc?: string;          // Poster image for loading
  children?: React.ReactNode;  // Overlay content (title, etc.)
  scale?: number;              // Performance scale (default: 0.8)
  fallback?: React.ReactNode;  // Fallback for no WebGL support
}
```

**Implementation:**
```tsx
'use client';
import { useEffect, useState } from 'react';
import Script from 'next/script';

export function UnicornHero({
  projectId,
  videoSrc,
  posterSrc,
  children,
  scale = 0.8,
  fallback
}: UnicornHeroProps) {
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    setWebglSupported(!!gl);
  }, []);

  if (!webglSupported) {
    return fallback || <VideoHero src={videoSrc} poster={posterSrc}>{children}</VideoHero>;
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Unicorn Canvas */}
      <div
        data-us-project={projectId}
        data-us-scale={scale.toString()}
        className="w-full h-full"
      />

      {/* Overlay Content */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {children}
      </div>

      {/* Unicorn Script */}
      <Script
        src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v2.0.2/dist/unicornStudio.umd.js"
        strategy="lazyOnload"
      />
    </div>
  );
}
```

**Mobile Behavior:**
- Detect touch device → Use fallback (video with overlay)
- No mouse tracking on mobile

---

### 2.2 ParallaxDeck

**Purpose:** Scroll-linked card stack where cards slide over each other.

**Props:**
```typescript
interface ParallaxDeckProps {
  cards: CardData[];
  scrollHeight?: string;       // Default: "300vh"
  cardClassName?: string;      // Custom card styling
  scaleRange?: [number, number]; // Default: [1, 0.85]
  rotateRange?: [number, number]; // Default: [0, -5]
}

interface CardData {
  id: string;
  content: React.ReactNode;
  image?: string;
}
```

**Implementation:**
```tsx
'use client';
import { useScroll, useTransform, motion } from 'framer-motion';
import { useRef } from 'react';

export function ParallaxDeck({
  cards,
  scrollHeight = "300vh",
  cardClassName,
  scaleRange = [1, 0.85],
  rotateRange = [0, -5]
}: ParallaxDeckProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  return (
    <div ref={containerRef} className={`relative bg-black`} style={{ height: scrollHeight }}>
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        {cards.map((card, index) => {
          const progress = index / cards.length;
          const scale = useTransform(
            scrollYProgress,
            [progress, progress + 0.3],
            scaleRange
          );
          const rotate = useTransform(
            scrollYProgress,
            [progress, progress + 0.3],
            rotateRange
          );

          return (
            <motion.div
              key={card.id}
              style={{ scale, rotate, zIndex: cards.length - index }}
              className={`absolute w-[85%] max-w-4xl aspect-[3/4] rounded-2xl ${cardClassName}`}
            >
              {card.content}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

---

### 2.3 VelocityMarquee

**Purpose:** Infinite horizontal scroll that speeds up based on scroll velocity.

**Props:**
```typescript
interface VelocityMarqueeProps {
  children: React.ReactNode;
  baseVelocity?: number;       // Default: 50
  direction?: 'left' | 'right';
  pauseOnHover?: boolean;
  className?: string;
}
```

**Implementation:**
```tsx
'use client';
import { motion, useScroll, useVelocity, useSpring, useTransform } from 'framer-motion';
import { useRef } from 'react';

export function VelocityMarquee({
  children,
  baseVelocity = 50,
  direction = 'left',
  pauseOnHover = true,
  className
}: VelocityMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 });
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], { clamp: false });

  // Animation implementation...
  return (
    <div
      ref={containerRef}
      className={`overflow-hidden ${className}`}
      style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}
    >
      <motion.div
        className="flex gap-8 whitespace-nowrap"
        animate={{ x: direction === 'left' ? '-50%' : '0%' }}
        transition={{
          duration: 100 / baseVelocity,
          repeat: Infinity,
          ease: 'linear'
        }}
      >
        {children}
        {children} {/* Duplicate for seamless loop */}
      </motion.div>
    </div>
  );
}
```

---

### 2.4 MagneticButton

**Purpose:** CTA button with magnetic cursor attraction effect.

**Props:**
```typescript
interface MagneticButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'gold';
  magneticStrength?: number;   // Default: 0.3
  className?: string;
}
```

**Implementation:**
```tsx
'use client';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useRef } from 'react';

export function MagneticButton({
  children,
  href,
  onClick,
  variant = 'primary',
  magneticStrength = 0.3,
  className
}: MagneticButtonProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 150, damping: 15 });
  const springY = useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * magneticStrength);
    y.set((e.clientY - centerY) * magneticStrength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Component = href ? motion.a : motion.button;

  return (
    <Component
      ref={ref}
      href={href}
      onClick={onClick}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-button ${variant} ${className}`}
    >
      {children}
    </Component>
  );
}
```

---

### 2.5 GrainOverlay

**Purpose:** Film grain texture overlay for cinematic feel.

**Props:**
```typescript
interface GrainOverlayProps {
  opacity?: number;            // Default: 0.05
  blendMode?: string;          // Default: 'overlay'
  animate?: boolean;           // Default: true
}
```

**Implementation:**
```tsx
export function GrainOverlay({
  opacity = 0.05,
  blendMode = 'overlay',
  animate = true
}: GrainOverlayProps) {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        opacity,
        mixBlendMode: blendMode as any,
        backgroundImage: `url("data:image/svg+xml,...")`, // Noise SVG
        animation: animate ? 'grain 0.5s steps(10) infinite' : 'none'
      }}
    />
  );
}
```

---

### 2.6 ScrollReveal

**Purpose:** Wrapper for scroll-triggered animations.

**Props:**
```typescript
interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: 'fadeUp' | 'fadeIn' | 'slideLeft' | 'slideRight' | 'scale';
  delay?: number;
  duration?: number;
  threshold?: number;          // Default: 0.2
  once?: boolean;              // Default: true
}
```

---

## 3. Theming System

Both pages share components but use different theme tokens:

```typescript
// lib/marketing/themes.ts
export const themes = {
  blackout: {
    name: 'James Scott',
    background: '#050505',
    surface: '#1a1a1a',
    text: '#f5f5f5',
    accent: '#FF4500',
    accentSecondary: '#FACC15',
    grain: 0.05,
    font: {
      hero: 'Tungsten, sans-serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    }
  },
  blueprint: {
    name: 'Adam Harrington',
    background: '#0B1021',
    surface: '#161B2E',
    text: '#F5F5F0',
    accent: '#C9A962',
    accentSecondary: '#FF3B30',
    grain: 0.02,
    font: {
      hero: 'Editorial New, serif',
      body: 'Inter, sans-serif',
      mono: 'JetBrains Mono, monospace'
    }
  }
} as const;
```

**Usage:**
```tsx
// app/james/page.tsx
import { ThemeProvider } from '@/components/marketing/ThemeProvider';
import { themes } from '@/lib/marketing/themes';

export default function JamesPage() {
  return (
    <ThemeProvider theme={themes.blackout}>
      {/* Page content */}
    </ThemeProvider>
  );
}
```

---

## 4. Performance Targets

| Metric | Target | Strategy |
|--------|--------|----------|
| LCP | < 2.5s | Poster images, lazy video |
| FID | < 100ms | Code splitting, defer non-critical |
| CLS | < 0.1 | Reserved space for images |
| WebGL | 60fps | 0.8x scale, GPU detection |
| Bundle | < 100KB | Tree-shaking, dynamic imports |

---

## 5. Dependencies

```json
{
  "dependencies": {
    "framer-motion": "^11.x",
    "next": "^15.x",
    "react": "^19.x"
  },
  "devDependencies": {
    "@types/react": "^19.x"
  }
}
```

**External:**
- Unicorn Studio (CDN script, no npm package)

---

## 6. Accessibility Requirements

| Component | Requirement |
|-----------|-------------|
| UnicornHero | Fallback for no WebGL, reduced motion support |
| ParallaxDeck | `prefers-reduced-motion` disables transforms |
| VelocityMarquee | Pause button, keyboard navigation |
| MagneticButton | Focus states, keyboard accessible |
| All | Semantic HTML, ARIA labels where needed |

**Reduced Motion:**
```tsx
// components/marketing/MotionConfig.tsx
import { MotionConfig } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';

export function MarketingMotionConfig({ children }: { children: React.ReactNode }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <MotionConfig reducedMotion={shouldReduceMotion ? 'always' : 'never'}>
      {children}
    </MotionConfig>
  );
}
```

---

## 7. File Structure

```
apps/web-academy/src/components/marketing/
├── heroes/
│   ├── UnicornHero.tsx          # WebGL hero with Unicorn Studio
│   ├── VideoHero.tsx            # Fallback video hero
│   └── index.ts
├── scroll/
│   ├── ParallaxDeck.tsx         # Sticky card stack
│   ├── StickySection.tsx        # Generic sticky container
│   ├── ScrollReveal.tsx         # Scroll-triggered reveal
│   ├── useScrollProgress.ts     # Custom hook
│   └── index.ts
├── marquee/
│   ├── VelocityMarquee.tsx      # Velocity-linked scroll
│   ├── LogoMarquee.tsx          # Simple logo scroll
│   └── index.ts
├── interactive/
│   ├── MagneticButton.tsx       # Cursor attraction CTA
│   ├── TimelineDrawer.tsx       # Expandable timeline
│   ├── HoverCard.tsx            # Hover-reveal card
│   └── index.ts
├── effects/
│   ├── GrainOverlay.tsx         # Film grain
│   ├── MotionConfig.tsx         # Global motion settings
│   └── index.ts
├── theme/
│   ├── ThemeProvider.tsx        # Theme context
│   ├── themes.ts                # Theme definitions
│   └── index.ts
└── index.ts                     # Barrel export
```

---

## 8. Implementation Order

### Phase 1: Core Components
1. [ ] `UnicornHero` + `VideoHero` fallback
2. [ ] `ParallaxDeck` scroll stack
3. [ ] `VelocityMarquee`
4. [ ] `MagneticButton`

### Phase 2: Effects & Polish
5. [ ] `GrainOverlay`
6. [ ] `ScrollReveal` wrapper
7. [ ] Theme system
8. [ ] Motion config (reduced motion)

### Phase 3: Page Integration
9. [ ] James page (`/james`)
10. [ ] Adam page (`/adam`)
11. [ ] Performance optimization
12. [ ] Accessibility audit

---

## 9. References

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Unicorn Studio](https://unicorn.studio/)
- [landonorris.com](https://landonorris.com) - Interaction reference

---

*Spec Author: Claude (Wolf Pack Protocol)*
*Last Updated: 2026-01-17*
