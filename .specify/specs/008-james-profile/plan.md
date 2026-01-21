# Plan: James Scott Profile Page

> **Spec:** 008-james-profile
> **Status:** In Progress
> **Created:** 2026-01-17

---

## Implementation Approach

### V1 Simplification
For initial launch, we're skipping Unicorn Studio WebGL and using a simpler video hero with CSS effects. This can be upgraded to WebGL later.

**V1 (Now):**
- Video hero with grayscale filter + grain overlay
- Framer Motion scroll animations
- CSS marquee (velocity-linking in v2)

**V2 (Later):**
- Unicorn Studio liquid distortion
- Velocity-linked marquee
- 3D elements

---

## Tech Stack Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Route Location | `apps/web-academy/src/app/james/` | Lives with Academy for unified auth/nav |
| Animation | Framer Motion | Already installed, stable |
| Hero | Video + CSS | Simpler, no external deps |
| Fonts | Bebas Neue (free) | Similar to Tungsten, no license needed |
| Images | `/images/james/` from marketing | Already have good assets |

---

## Asset Mapping

Using existing images from `apps/marketing/public/images/james/`:

| Use Case | Asset |
|----------|-------|
| Hero placeholder | `hero.jpeg` or `jamesjimmyside.webp` |
| Card 1: Jimmy | `jamesjimmy2.webp` |
| Card 2: Training | `bpa1.webp` |
| Card 3: China | `jameschina.webp` |
| Headshot | `jamesmug.webp` |

---

## File Structure

```
apps/web-academy/src/app/james/
├── page.tsx                    # Main page
├── layout.tsx                  # Dark theme wrapper
├── components/
│   ├── HeroSection.tsx         # Video hero
│   ├── PhilosophySection.tsx   # Split text
│   ├── RosterDeck.tsx          # Parallax cards
│   ├── MethodSteps.tsx         # 4-step process
│   ├── StatsGrid.tsx           # Credentials
│   ├── LogoMarquee.tsx         # Team logos
│   └── CTASection.tsx          # Conversion
├── lib/
│   ├── constants.ts            # Copy, data
│   └── animations.ts           # Motion variants
└── james.css                   # Page styles
```

---

## Implementation Phases

### Phase 1: Foundation ✓
- [x] Create route structure
- [x] Set up dark theme layout
- [x] Copy images to web-academy public

### Phase 2: Hero + Philosophy
- [ ] Video hero with grain overlay
- [ ] Large typography with blend mode
- [ ] Philosophy split section

### Phase 3: Interactive Sections
- [ ] ParallaxDeck roster cards
- [ ] Method steps with scroll reveal
- [ ] Stats counter animation

### Phase 4: Footer + Polish
- [ ] Logo marquee
- [ ] CTA section
- [ ] Mobile responsive
- [ ] Performance audit

---

## Gates (Pre-Implementation Checklist)

- [x] **Simplicity Gate:** No over-engineering (skip WebGL for v1)
- [x] **Asset Gate:** Images available
- [x] **Route Gate:** Clear URL structure (`/james`)
- [ ] **Copy Gate:** Final copy approved (using placeholder)

---

*Plan Author: Claude (Wolf Pack Protocol)*
*Last Updated: 2026-01-17*
