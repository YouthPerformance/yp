# Spec 008: The Movement Lab

> **Codename:** Project Blackout
> **Target URL:** `youthperformance.com/james`
> **Status:** Draft
> **Created:** 2026-01-17
> **Reference:** landonorris.com (Liquid interactions, dark mode, heavy typography)

---

## Summary

James Scott's profile page positions him as "The Movement Scientist"—the man who fixes foundations. While Adam is "The Architect" (strategic, cerebral), James is "The Lab" (industrial, physical, gritty). This page will be a WebGL-powered cinematic experience featuring liquid distortion effects, parallax card stacks, and velocity-based interactions.

---

## Constitution Alignment

- [x] **Athlete First:** Showcases James's credentials so athletes trust the training methodology
- [x] **Parents Partners:** Proof that James trains pro athletes (NFL, NBA) builds parent confidence
- [x] **Simplicity:** One scroll journey, no navigation complexity
- [x] **Stack Sacred:** Reinforces "Weak Feet Don't Eat" philosophy visually

---

## 1. Problem Statement

James Scott has trained Jimmy Butler, Josh Oliver (NFL), J Balvin, and dozens of pro athletes across sports. But his digital presence undersells this institutional credibility. Parents researching YP's Barefoot Reset need to see WHY this methodology works—and WHO developed it.

### The Pivot
- **FROM:** "James is a barefoot training guy"
- **TO:** "James is The Movement Scientist—the man pro athletes trust with their foundations"

---

## 2. Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time on Page | > 2.5 minutes | Analytics |
| Scroll Depth | > 85% | Heatmaps |
| Video Watch Time | > 50% of hero video | Video analytics |
| CTA Clicks | > 12% | Funnel tracking |
| Barefoot Reset Conversions | +15% lift | A/B test |
| EEAT Score | Rank page 1 for "James Scott barefoot training" | SEO |

---

## 3. User Personas

### Primary: Skeptical Parent (Sports Injury Context)
- **Context:** Kid has recurring ankle sprains, Sever's disease, or foot problems
- **Question:** "Is barefoot training legitimate or a fad?"
- **Need:** Scientific credibility + pro athlete social proof

### Secondary: Youth Athlete (Aspiring)
- **Context:** Wants to improve speed, agility, explosiveness
- **Question:** "Will this actually help my game?"
- **Need:** Inspiring visuals of athletes they recognize

### Tertiary: Adult Athlete / Trainer
- **Context:** Evaluating James for collaboration or training
- **Question:** "What's his methodology and track record?"
- **Need:** Full roster + philosophy deep-dive

---

## 4. Visual Language: "The Lab"

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Blackout | `#050505` | Primary background |
| Carbon Grey | `#1a1a1a` | Card backgrounds |
| Concrete | `#2a2a2a` | Borders, dividers |
| Paper White | `#f5f5f5` | Primary text |
| Safety Orange | `#FF4500` | Accent, CTAs, highlights |
| Warning Yellow | `#FACC15` | Secondary accent (sparingly) |

### Typography
| Role | Font | Style |
|------|------|-------|
| Hero Headlines | Tungsten / Druk Wide | Massive, condensed, industrial |
| Section Headlines | Inter Bold | Clean, readable |
| Body | Inter | 16-18px, comfortable |
| Data/Stats | JetBrains Mono | Technical precision |

### Texture & Grain
- **Film Grain Overlay:** `opacity: 0.03-0.05` across all sections
- **Vignette:** Subtle dark edges on hero
- **B&W Treatment:** All video/photos in hero, color reveals in roster

### Motion Principles
| Property | Value | Reasoning |
|----------|-------|-----------|
| Duration | 0.3-0.5s | Snappy, industrial feel |
| Easing | `ease-out` | Quick start, soft landing |
| Parallax Speed | 0.2-0.4x | Subtle depth |
| Hover Response | 0.1s | Immediate feedback |

---

## 5. Page Structure (The Scroll Journey)

### Section A: "The Liquid Lab" (Hero)

**The "Lando" Effect:** A pitch-black screen where the cursor acts as a "torch," melting the darkness to reveal a gritty B&W video of James training Jimmy Butler.

**Content:**
- Full-screen liquid distortion canvas
- Beneath: B&W video loop of James training Jimmy Butler
- Text overlay: "THE MOVEMENT SCIENTIST" (blend mode: `difference`)
- Subhead: "Weak feet don't eat."
- Scroll indicator at bottom

**Interaction:**
- Desktop: Mouse position controls liquid distortion reveal
- Mobile: Auto-play video with 40% black overlay (no liquid effect)

**Technical Requirements:**
- WebGL effect via Unicorn Studio
- Layer stack: Video → Fluid Shader → Text
- Video: WebM/MP4, autoplay, muted, loop, B&W filter
- Performance: Effect renders at 0.8x scale for optimization

**Copy:**
```
THE MOVEMENT SCIENTIST
Weak feet don't eat.

[↓ Discover the Method]
```

---

### Section B: "The Philosophy" (Split Screen)

**Content:**
- Left: Animated visualization (feet anatomy or force diagram)
- Right: Philosophy text block

**Copy:**
```
"Your feet have 26 bones, 33 joints, and over 100 muscles.
They've been locked in coffins called shoes for years.

I don't fix symptoms. I rebuild foundations.
Every injury starts somewhere—usually, it's the feet.

Fix the feet, fix everything upstream."

— James Scott
```

**Technical:**
- Parallax scroll effect
- Text stagger animation (line-by-line reveal)
- Optional: SVG foot anatomy that highlights on scroll

---

### Section C: "The Sticky Stack" (Roster Cards)

**The Effect:** As you scroll, massive photo cards of his roster slide *over* each other while staying pinned. Each card reveals with a scale/rotation transform.

**Content (Card Order):**
1. **Jimmy Butler** - NBA All-Star, Heat
2. **Josh Oliver** - NFL Tight End, Vikings
3. **J Balvin** - Global Artist, Movement Client
4. **[Additional Pro]** - TBD
5. **Youth Athletes** - Montage card

**Card Structure:**
```
┌─────────────────────────────────┐
│  [Large Photo - 80% of card]    │
│                                 │
│  NAME                           │
│  Sport / Team                   │
│  "Quote about James" (optional) │
└─────────────────────────────────┘
```

**Interaction:**
- Scroll-linked transforms
- Card 1: `scale(1) rotate(0)` → `scale(0.85) rotate(-3deg)` as Card 2 enters
- Each card has subtle grain overlay

**Technical:**
- Container: `height: 300vh` (scroll distance)
- Cards: `position: sticky; top: 0`
- `useScroll` + `useTransform` from Framer Motion

---

### Section D: "The Method" (Process Steps)

**Content:**
- Numbered methodology breakdown
- Shows James's systematic approach

**Steps:**
1. **ASSESS** - "I can tell an athlete's potential by looking at their feet."
2. **REBUILD** - "Break it down to build it up. Starting with the foundation."
3. **INTEGRATE** - "Train the feet until they're unconscious. Then your mind is free."
4. **TRANSFER** - "Every drill ties back to game performance."

**Visual:**
- Large step numbers (01, 02, 03, 04)
- Each step reveals on scroll
- Minimal animation, clean typography

---

### Section E: "The Credentials" (Stats/Proof)

**Content:**
- Grid of impressive statistics

**Stats:**
```
20+          1000+         5+
YEARS        ATHLETES      SPORTS
Training     Assessed      NFL, NBA, MLS, Music, Youth
```

**Visual:**
- Large mono numbers
- Subtle count-up animation on scroll-into-view
- Orange accent on key numbers

---

### Section F: "The Infinite Roster" (Velocity Marquee)

**The Effect:** A high-speed, infinite marquee of team/organization logos.

**Logos:**
- Miami Heat
- Minnesota Vikings
- IMG Academy
- Roc Nation
- And more...

**Interaction:**
- Base speed: Smooth continuous scroll
- Velocity-linked: If user scrolls down fast, marquee speeds up
- Pause on hover (desktop)

**Technical:**
- Flex container with duplicated logos
- CSS animation: `translateX(-100%)`
- `useVelocity` hook for scroll-speed detection

---

### Section G: "The CTA" (Conversion)

**Content:**
```
READY TO FIX YOUR FOUNDATION?

The same methodology used by Jimmy Butler, Josh Oliver,
and hundreds of pro athletes—now available to you.

[ Start the Barefoot Reset ] → Primary CTA
[ Explore the Playbook ]     → Secondary CTA
```

**Visual:**
- Full-width section
- Safety Orange CTA button
- Subtle magnetic button effect on hover

---

## 6. SEO Strategy (EEAT Play)

### Meta Tags
```html
<title>James Scott | Movement Specialist & Foot Performance Coach | Youth Performance</title>
<meta name="description" content="James Scott is a movement specialist who has trained Jimmy Butler, NFL players, and elite athletes. Creator of the Barefoot Reset methodology. Fix the feet, fix everything." />
```

### Schema Markup (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "James Scott",
  "jobTitle": ["Movement Specialist", "Foot Performance Coach", "Founder of Barefoot Reset"],
  "knowsAbout": ["Barefoot Training", "Movement Biomechanics", "Injury Prevention", "Speed & Agility"],
  "worksFor": {
    "@type": "Organization",
    "name": "Youth Performance"
  },
  "sameAs": [
    "https://instagram.com/weakfeetdonteat"
  ]
}
```

### Target Keywords
- "James Scott barefoot training"
- "Weak feet don't eat"
- "Jimmy Butler trainer"
- "Barefoot Reset program"
- "Youth foot training"

---

## 7. Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | LCP < 2.5s, FID < 100ms, CLS < 0.1 |
| Mobile | Full experience on 375px+, graceful WebGL degradation |
| Accessibility | WCAG 2.1 AA, focus states, reduced motion support |
| Video | Lazy-loaded, poster image first, < 5MB |
| WebGL | Fallback to static hero if not supported |

---

## 8. Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| WebGL not supported | Show static hero with video, no liquid effect |
| Mobile device | Disable liquid effect, show video with overlay |
| Slow connection | Poster image loads first, video streams progressively |
| `prefers-reduced-motion` | Disable all scroll animations, show static layout |
| JavaScript disabled | Server-rendered content visible, no interactions |

---

## 9. Assets Required

### Must Have (Before Build)
- [ ] Video: James training Jimmy Butler (10-15s, can convert to B&W)
- [ ] Photo: Jimmy Butler card image
- [ ] Photo: Josh Oliver card image
- [ ] Photo: J Balvin card image
- [ ] Photo: James headshot (high-res)
- [ ] Logos: Heat, Vikings, IMG, Roc Nation (SVG)

### Nice to Have
- [ ] Additional pro athlete photos (with permission)
- [ ] Slow-motion foot training footage
- [ ] James signature scan

### Asset Specs
| Asset | Format | Size | Notes |
|-------|--------|------|-------|
| Hero Video | WebM + MP4 | < 5MB | 1920x1080, B&W, 10-15s loop |
| Card Photos | WebP | < 200KB | 1200x1600, can be color |
| Logos | SVG | < 20KB | Mono versions preferred |
| Headshot | WebP | < 100KB | 800x800 |

---

## 10. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Unicorn Studio account | External | Needs setup |
| Framer Motion | NPM Package | Already installed |
| next/font (Tungsten/Druk) | Font License | Needs purchase/verification |
| Video footage (Jimmy/James) | Content | Needs sourcing |
| web-academy app | Infrastructure | Ready |

---

## 11. Out of Scope

- **NOT building:** Separate marketing site (this lives in web-academy)
- **NOT building:** CMS for page content (hardcoded for v1)
- **NOT building:** Multiple language support
- **NOT building:** Blog/article section on this page
- **NOT building:** Booking/scheduling functionality

---

## 12. Open Questions

- [ ] Q1: Do we have video footage of James + Jimmy, or do we need to source/shoot?
- [ ] Q2: Font licensing—Tungsten or Druk Wide? Or use a free alternative (Bebas Neue)?
- [ ] Q3: Route structure: `/james` or `/coaches/james` or `/team/james`?
- [ ] Q4: Do we have permission to use Jimmy Butler's name/likeness?
- [ ] Q5: Unicorn Studio—is the React wrapper stable, or should we use vanilla script injection?

---

## 13. Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Create route `/james` in web-academy
- [ ] Set up Unicorn Studio project with fluid distortion
- [ ] Build Hero component with WebGL integration
- [ ] Implement mobile fallback

### Phase 2: Content Sections (Day 2)
- [ ] Build Philosophy section with parallax
- [ ] Build Roster card stack (ParallaxDeck component)
- [ ] Build Method steps section
- [ ] Build Credentials stats grid

### Phase 3: Interactive Layer (Day 3)
- [ ] Build Velocity Marquee with scroll-linked speed
- [ ] Add all hover states and micro-interactions
- [ ] Implement lazy loading for images/video
- [ ] Add scroll-triggered animations

### Phase 4: Polish & Launch (Day 4)
- [ ] Replace placeholder assets with real content
- [ ] SEO optimization (meta, schema, OG images)
- [ ] Performance audit (Lighthouse)
- [ ] Cross-browser/device testing
- [ ] Accessibility audit

---

## 14. Component Architecture

```
apps/web-academy/src/app/james/
├── page.tsx                    # Main page (metadata + layout)
├── components/
│   ├── HeroLiquidReveal.tsx   # Section A - WebGL hero
│   ├── Philosophy.tsx          # Section B - Split screen
│   ├── ParallaxDeck.tsx        # Section C - Roster cards
│   ├── MethodSteps.tsx         # Section D - Process
│   ├── CredentialsGrid.tsx     # Section E - Stats
│   ├── VelocityMarquee.tsx     # Section F - Logo scroll
│   └── CTASection.tsx          # Section G - Conversion
├── lib/
│   ├── constants.ts            # Roster data, stats, copy
│   └── animations.ts           # Shared Framer Motion variants
└── styles/
    └── james.css               # Page-specific styles (grain overlay, etc.)
```

---

## 15. References

- [landonorris.com](https://landonorris.com) - Liquid interaction inspiration
- [Unicorn Studio Docs](https://unicorn.studio/docs) - WebGL effect implementation
- [Framer Motion Scroll](https://www.framer.com/motion/scroll-animations/) - Scroll-linked animations
- [.claude/derived/james-voice-guide.md](/.claude/derived/james-voice-guide.md) - James's voice for copy

---

*Spec Author: Claude (Wolf Pack Protocol)*
*Last Updated: 2026-01-17*
