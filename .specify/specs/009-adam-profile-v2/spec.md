# Spec 009: The Architect's War Room

> **Codename:** Project Blueprint
> **Target URL:** `youthperformance.com/adam`
> **Status:** Draft
> **Created:** 2026-01-17
> **Reference:** Same component system as James, different visual treatment

---

## Summary

Adam Harrington's profile page positions him as "The Architect"—the strategic mind who builds the builders. Where James is industrial/gritty ("The Lab"), Adam is clean/strategic ("The War Room"). This page shares the same component architecture as James but swaps the visual treatment: "Glass Distortion" instead of "Liquid Reveal," Navy palette instead of Black, cerebral copy instead of physical.

---

## Constitution Alignment

- [x] **Athlete First:** Establishes Adam's NBA/WNBA credentials so athletes trust the methodology
- [x] **Parents Partners:** Proves their kid gets access to "KD's coach" for $168/year
- [x] **Simplicity:** Same scroll journey pattern as James (consistent UX)
- [x] **Stack Sacred:** Reinforces "precision over power" philosophy

---

## 1. Problem Statement

Adam Harrington is perceived as "just a trainer" rather than "The Institution" he represents. His resume (OKC Thunder, Brooklyn Nets, Unrivaled Head Coach) plus client roster (KD, Steve Nash, Paolo Banchero) needs to be front-and-center. Parents evaluating YP need to understand WHY this mind for $168/year is a steal.

### The Pivot
- **FROM:** "Adam is a trainer who works with NBA players"
- **TO:** "Adam is The Architect—the man who builds the builders"

---

## 2. Success Criteria

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time on Page | > 3 minutes | Analytics |
| Scroll Depth | > 80% | Heatmaps |
| CTA Clicks | > 15% | Funnel tracking |
| EEAT Score | Rank page 1 for "Adam Harrington basketball" | SEO |
| Founder Edition Sales | Conversion lift from page | A/B test |

---

## 3. User Personas

### Primary: Skeptical Parent
- **Context:** Evaluating if YP is worth $168/year for basketball training
- **Question:** "Who is actually teaching my kid?"
- **Need:** Proof this isn't another YouTube coach

### Secondary: Series A Investor
- **Context:** Due diligence on the founding team
- **Question:** "Does this team have the credentials to scale?"
- **Need:** Institutional-grade resume

### Tertiary: Youth Athlete (Aspiring Hooper)
- **Context:** Wants to improve shooting, ball-handling
- **Question:** "Is this the same training KD uses?"
- **Need:** NBA connection made tangible

---

## 4. Visual Language: "The War Room"

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Deep Navy | `#0B1021` | Primary background |
| Midnight | `#161B2E` | Card backgrounds |
| Steel | `#2A3245` | Borders, dividers |
| Bone White | `#F5F5F0` | Primary text |
| Blueprint Blue | `#1a4a6e` | Accent, links |
| Signal Red | `#FF3B30` | CTA highlights (sparingly) |
| Gold | `#C9A962` | Premium CTAs |

### Typography
| Role | Font | Style |
|------|------|-------|
| Hero Headlines | Editorial New / Ogg | Massive, elegant serif |
| Section Headlines | Inter Bold | Clean, readable |
| Body | Inter | 16-18px, comfortable |
| Data/Technical | JetBrains Mono | Precision, mechanics |
| Signature | Script/Cursive | Personal touch on quotes |

### Texture & Grain
- **Subtle Grain Overlay:** `opacity: 0.02` (lighter than James)
- **Clean Lines:** Blueprint-style grid patterns in backgrounds
- **Whitespace:** More breathing room than James's industrial density

### Motion Principles
| Property | Value | Reasoning |
|----------|-------|-----------|
| Duration | 0.4-0.6s | Measured, deliberate (like Adam's speech) |
| Easing | `ease-in-out` | Smooth, professional |
| Parallax Speed | 0.3x | Subtle depth |
| Hover Response | 0.15s | Immediate but not jarring |

---

## 5. Page Structure (The Scroll Journey)

### Section A: "Clear Vision" (Hero)

**The "Frosted Glass" Effect:** The screen looks like frosted glass. The cursor acts as a "wiper," clearing the frost to reveal sharp video of Adam at a whiteboard or analyzing game film.

**Content:**
- Full-screen glass distortion canvas
- Beneath: Clean video of Adam coaching/analyzing (Navy/White aesthetic, NOT B&W)
- Text overlay: "THE ARCHITECT" (blend mode: `difference`)
- Subhead: "Building people, not just players."
- Scroll indicator at bottom

**Interaction:**
- Desktop: Mouse position clears frosted glass to reveal video
- Mobile: Auto-play video with subtle blur overlay that fades on scroll

**Technical Requirements:**
- WebGL effect via Unicorn Studio (Glass/Frost Distortion preset)
- Layer stack: Video → Frost Shader → Text
- Video: WebM/MP4, autoplay, muted, loop
- Performance: Effect renders at 0.8x scale

**Copy:**
```
THE ARCHITECT
Building people, not just players.

[↓ Explore the Resume]
```

---

### Section B: "The Philosophy" (Split Screen)

**Content:**
- Left: 3D rotating NeoBall (Founders Edition) or animated blueprint graphic
- Right: Philosophy text block

**Copy:**
```
"Basketball isn't just movement. It's math. It's physics. It's Intentionality.

I don't replace your local trainer; I give them the blueprint to build you better.

We are supplementing your grind with NBA-level precision.

You pay for reps. We provide the vision."

— Adam Harrington
```

**Technical:**
- React Three Fiber for 3D ball (reuse from yp-vision if available)
- Parallax scroll effect
- Text stagger animation (line-by-line reveal)

---

### Section C: "The Wall of Giants" (Roster Marquee)

**The Effect:** Horizontal infinite marquee of player names. Hover pauses + reveals photo.

**Content (Two Rows):**
- **Row 1 (NBA):** Kevin Durant, Paolo Banchero, Chet Holmgren, Shai Gilgeous-Alexander, Jimmy Butler
- **Row 2 (WNBA/Legends):** Sabrina Ionescu, Brittney Griner, Steve Nash, Jamal Crawford

**Interaction:**
- Smooth continuous scroll
- Hover on name → Pause marquee + fade in photo of Adam with that player
- Click → Modal with context/testimonial

**Technical:**
- CSS animation for marquee
- Intersection Observer for performance
- Lazy-loaded images

---

### Section D: "The Sticky Stack" (Testimonial Cards)

**The Effect:** Same component as James, different content. Cards stack over each other on scroll.

**Content (Card Order):**
1. **Kevin Durant**
   > "Adam's extensive knowledge has been essential to my development."
2. **Steve Nash**
   > "Influence over different generations of players is remarkable."
3. **Tiago Splitter**
   > "One of the most amazing people I've ever worked with."

**Card Structure:**
```
┌─────────────────────────────────┐
│  [Photo - Adam with Player]     │
│                                 │
│  "Quote text here..."           │
│                                 │
│  — Player Name                  │
│    [Simulated signature]        │
└─────────────────────────────────┘
```

**Technical:**
- Same `ParallaxDeck` component as James
- Card backgrounds: Midnight (`#161B2E`)
- Subtle gold accent on quote marks

---

### Section E: "The Timeline" (Interactive Resume)

**The Effect:** Vertical timeline with milestones. Line "draws" as user scrolls.

**Content:**
| Year | Milestone | Details |
|------|-----------|---------|
| 1998 | The Beginning | USA Junior National Team (Gold Medal) |
| 2002 | The NBA Grind | Mavs, Nuggets, China—6 years in the league |
| 2014 | The MVP Season | OKC Thunder Shooting Coach (KD wins MVP) |
| 2016 | The Brooklyn Era | Director of Player Development, Nets |
| 2022 | The WNBA | Skills consultant, elite women's players |
| 2024 | The New Era | Unrivaled Head Coach (Phantom BC) |
| NOW | The Founder | Youth Performance + Intentional360 |

**Interaction:**
- Timeline line draws on scroll (SVG path animation)
- Click milestone → Expand with details + photos
- Accordion-style expansion

**Technical:**
- Scroll-linked SVG animation
- Lazy-loaded milestone images
- Uses same scroll hooks as James page

---

### Section F: "The Man" (Family & Values)

**Content:**
- Warm, candid photo of Adam with Kearstin and 4 kids
- **COLOR photo** (breaks the dark pattern = warmth)
- Copy about family, JEHH Memorial Fund, Intentional360

**Copy:**
```
Before I am a coach, I am a husband and a father.

The JEHH Memorial Fund. Intentional360.

Everything I build is designed to leave the game—
and the world—better than I found it.
```

**Visual:**
- Image parallax effect
- Soft gradient transition from dark to warmer tones
- Subtle gold accent on "husband and father"

---

### Section G: "The Ask" (CTA)

**Content:**
```
READY TO TRAIN WITH THE ARCHITECT?

The same methodology used by Kevin Durant, Steve Nash,
and NBA champions—now accessible to your young athlete.

[ Join the Founders Club ]  → Primary CTA (Gold)
[ Access the Knowledge Base ] → Secondary CTA
```

**Visual:**
- Full-width section
- Gold primary CTA button
- Magnetic button effect on hover
- Subtle confetti on click

---

## 6. SEO Strategy (EEAT Play)

### Meta Tags
```html
<title>Adam Harrington | NBA Skills Coach & Architect of Youth Performance</title>
<meta name="description" content="Adam Harrington: Former NBA Shooting Coach (OKC, Nets), Kevin Durant's skills trainer, Head Coach of Phantom BC (Unrivaled), and Founder of Youth Performance." />
```

### Schema Markup (JSON-LD)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Adam Harrington",
  "jobTitle": ["Head Coach, Phantom BC", "NBA Skills Strategist", "Founder, Youth Performance"],
  "knowsAbout": ["Shooting Mechanics", "Player Development", "Basketball Biomechanics"],
  "alumniOf": [
    {"@type": "CollegeOrUniversity", "name": "NC State"},
    {"@type": "CollegeOrUniversity", "name": "Auburn University"}
  ],
  "worksFor": [
    {"@type": "Organization", "name": "Youth Performance"},
    {"@type": "Organization", "name": "Phantom BC (Unrivaled)"}
  ],
  "sameAs": [
    "https://twitter.com/AdamHarrington",
    "https://instagram.com/CoachAHarrington"
  ]
}
```

### Target Keywords
- "Adam Harrington basketball"
- "Kevin Durant shooting coach"
- "NBA skills trainer"
- "Youth basketball development"
- "Phantom BC coach"

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
| WebGL not supported | Show static hero with video, no glass effect |
| Mobile device | Disable glass effect, show video with blur overlay |
| Slow connection | Poster image loads first, video streams progressively |
| `prefers-reduced-motion` | Disable scroll animations, show static layout |
| JavaScript disabled | Server-rendered content visible, no interactions |

---

## 9. Assets Required

### Must Have (Before Build)
- [ ] Video: Adam coaching/whiteboard (10-15s, clean lighting)
- [ ] Photo: Adam with Kevin Durant
- [ ] Photo: Adam with Nets staff
- [ ] Photo: Adam with Steve Nash
- [ ] Photo: Unrivaled/Phantom BC headshot
- [ ] Photo: Adam with Kearstin + kids (family)
- [ ] NeoBall 3D model (if reusing yp-vision asset)

### Nice to Have
- [ ] Player signatures (for testimonial cards)
- [ ] Editorial New font license
- [ ] Action shots of coached players

### Asset Specs
| Asset | Format | Size | Notes |
|-------|--------|------|-------|
| Hero Video | WebM + MP4 | < 5MB | 1920x1080, clean lighting, 10-15s |
| Portrait Photos | WebP | < 200KB | 1200x1600 |
| Family Photo | WebP | < 300KB | Warm, candid |
| Logos/Icons | SVG | < 20KB | Team logos for timeline |

---

## 10. Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Unicorn Studio account | External | Needs setup |
| Framer Motion | NPM Package | Already installed |
| Editorial New / Ogg font | Font License | Needs purchase |
| React Three Fiber | NPM Package | Already installed |
| Video footage (Adam) | Content | Needs sourcing |
| web-academy app | Infrastructure | Ready |

---

## 11. Out of Scope

- **NOT building:** Separate marketing site (lives in web-academy)
- **NOT building:** CMS for page content (hardcoded for v1)
- **NOT building:** Booking/scheduling with Adam
- **NOT building:** Video course integration on this page
- **NOT building:** Real-time chat widget

---

## 12. Open Questions

- [ ] Q1: Do we have video footage of Adam, or do we need to shoot?
- [ ] Q2: Font licensing—Editorial New or open-source alternative?
- [ ] Q3: Route structure: `/adam` or `/coaches/adam`?
- [ ] Q4: Do we have permission to use KD/Nash testimonials publicly?
- [ ] Q5: Is the NeoBall 3D model in yp-vision reusable, or do we need new?
- [ ] Q6: Family photo—do we have one that Kearstin has approved?

---

## 13. Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Create route `/adam` in web-academy
- [ ] Set up Unicorn Studio project with glass distortion
- [ ] Build Hero component (reuse structure from James, swap effect)
- [ ] Implement mobile fallback

### Phase 2: Content Sections (Day 2)
- [ ] Build Philosophy section with 3D ball
- [ ] Build Wall of Giants marquee
- [ ] Build Testimonial card stack (reuse ParallaxDeck)
- [ ] Build Timeline with scroll animation

### Phase 3: Interactive Layer (Day 3)
- [ ] Build Family section with warm color transition
- [ ] Add all hover states
- [ ] Implement lazy loading
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
apps/web-academy/src/app/adam/
├── page.tsx                    # Main page (metadata + layout)
├── components/
│   ├── HeroGlassReveal.tsx    # Section A - WebGL glass hero
│   ├── Philosophy.tsx          # Section B - 3D ball + text
│   ├── GiantsMarquee.tsx       # Section C - Player names
│   ├── ParallaxDeck.tsx        # Section D - Testimonials (shared)
│   ├── Timeline.tsx            # Section E - Career history
│   ├── Family.tsx              # Section F - Personal
│   └── CTASection.tsx          # Section G - Conversion
├── lib/
│   ├── constants.ts            # Roster data, timeline, testimonials
│   └── animations.ts           # Shared Framer Motion variants
└── styles/
    └── adam.css                # Page-specific styles
```

### Shared Components (with James)
```
apps/web-academy/src/components/marketing/
├── ParallaxDeck.tsx            # Reusable card stack
├── VelocityMarquee.tsx         # Reusable logo scroll
├── UnicornHero.tsx             # WebGL hero wrapper
├── MagneticButton.tsx          # CTA button effect
└── GrainOverlay.tsx            # Film grain effect
```

---

## 15. Differentiation from James Page

| Element | James (Blackout) | Adam (Blueprint) |
|---------|------------------|------------------|
| Hero Effect | Liquid Distortion | Glass/Frost Distortion |
| Palette | Black + Orange | Navy + Gold |
| Video Tone | B&W, gritty | Clean, well-lit |
| Typography | Tungsten (industrial) | Editorial New (elegant) |
| Texture | Heavy grain | Light grain, blueprint lines |
| Vibe | The Lab | The War Room |
| Copy Tone | Physical, direct | Strategic, cerebral |
| Primary CTA | "Start the Barefoot Reset" | "Join the Founders Club" |

---

## 16. References

- [landonorris.com](https://landonorris.com) - Glass/liquid interaction inspiration
- [.specify/specs/001-adam-profile/spec.md](/.specify/specs/001-adam-profile/spec.md) - Original Adam spec (content reference)
- [.claude/derived/adam-voice-guide.md](/.claude/derived/adam-voice-guide.md) - Adam's voice for copy
- [Unicorn Studio Docs](https://unicorn.studio/docs) - WebGL effect implementation

---

*Spec Author: Claude (Wolf Pack Protocol)*
*Last Updated: 2026-01-17*
