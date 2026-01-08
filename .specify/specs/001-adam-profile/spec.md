# Spec 001: The Architect's Vault

> **Codename:** Project Architect
> **Target URL:** `youthperformance.com/adam`
> **Status:** Draft
> **Created:** 2026-01-06

---

## 1. Problem Statement

Adam Harrington is perceived as "just a trainer" rather than "The Institution" he represents. The current brand positioning undersells his credentials (NBA/WNBA coaching, 20+ years experience, elite client roster). Parents need to understand why their kid getting access to this mind for $168/year is a steal.

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
| Founder Edition Sales | Conversion lift | A/B test |

---

## 3. User Personas

### Primary: Skeptical Parent
- **Context:** Evaluating if YP is worth $168/year
- **Question:** "Who is actually teaching my kid?"
- **Need:** Proof this isn't another YouTube coach

### Secondary: Series A Investor
- **Context:** Due diligence on the team
- **Question:** "Does this team have the credentials to scale?"
- **Need:** Institutional-grade resume

---

## 4. Visual Language: "The Blueprint"

### Color Palette
| Color | Hex | Usage |
|-------|-----|-------|
| Architect Black | `#0a0a0a` | Background |
| Paper White | `#f0f0f0` | Typography |
| Blueprint Blue | `#1a4a6e` | Accent (links, highlights) |
| Gold | `#c9a962` | Premium CTAs |

### Typography
| Role | Font | Style |
|------|------|-------|
| Headlines | Editorial New / Ogg | Massive, condensed serif |
| Body | Inter | Clean, readable |
| Data/Technical | JetBrains Mono | Precision, mechanics |
| Signature | Script/cursive | Personal touch |

### Motion Principles
- **Speed:** 0.4s max duration (snappy, not sluggish)
- **Parallax:** Images move at 0.3x scroll speed
- **Text Reveals:** Slide-up from masked line (receipt printing effect)
- **Hover States:** Immediate response (0.15s)

---

## 5. Page Structure (The Scroll Journey)

### Section A: The Hook (Hero)
**Content:**
- Full-screen B&W video loop (Adam walking onto court, holding clipboard)
- High cinematic grain filter
- Headline: "THE ARCHITECT OF THE MODERN GAME."
- Subhead: "From the hardwood to the front office. Building people, not just players."
- CTA: `[ Explore the Resume ]` (magnetic button effect)

**Technical:**
- Video: WebM/MP4, autoplay, muted, loop
- Lazy-loaded with poster image
- Text fade-in with Framer Motion
- Scroll indicator at bottom

### Section B: The Philosophy
**Content:**
- Split-screen layout
- Left: 3D rotating NeoBall (Founders Edition)
- Right: Philosophy text

**Copy:**
> "Basketball isn't just movement. It's math. It's physics. It's **Intentionality**.
>
> I don't replace your local trainer; I give them the blueprint to build you better.
> We are supplementing your grind with NBA-level precision.
>
> *You pay for reps. We provide the vision.*"

**Technical:**
- React Three Fiber for 3D ball
- Parallax scroll effect
- Text stagger animation

### Section C: The Wall of Giants
**Content:**
- Horizontal infinite marquee scroll
- Row 1 (NBA): Kevin Durant, Jimmy Butler, Paolo Banchero, Chet Holmgren, Shai Gilgeous-Alexander
- Row 2 (WNBA): Sabrina Ionescu, Natasha Cloud, Brittney Griner
- Row 3 (Legends): Steve Nash, Jamal Crawford

**Interaction:**
- Hover on name → pause marquee + fade in photo of Adam with that player
- Click → modal with context

**Technical:**
- CSS animation for marquee
- Intersection Observer for performance
- Lazy-loaded images

### Section D: The Deep Work (Testimonials)
**Content:**
- "Deck of cards" stacked design
- Card 1: Kevin Durant
  > "Adam's extensive knowledge has been essential..."
- Card 2: Steve Nash
  > "Influence over different generations..."
- Card 3: Tiago Splitter
  > "One of the most amazing people I've ever worked with."

**Visual:**
- Large quote marks
- Simulated signature for each
- Card flip/stack animation on scroll

**Technical:**
- Scroll-triggered animations
- Card parallax depth effect

### Section E: The Timeline (Interactive Resume)
**Content:**
- Vertical timeline with milestones
- **1998:** USA Junior National Team (Gold Medal)
- **2002:** The NBA Grind (Mavs/Nuggets/China)
- **2014:** The MVP Season (OKC Thunder Shooting Coach)
- **2016-2022:** The Brooklyn Nets Era (Director of Player Dev)
- **2024:** The New Era (Unrivaled / Phantom BC Head Coach)
- **Present:** The Founder (YP / Intentional360)

**Interaction:**
- Click milestone → expand with details + photos
- Timeline line "draws" as user scrolls

**Technical:**
- Scroll-linked SVG path animation
- Accordion-style expansion
- Lazy-loaded milestone images

### Section F: The Man (Family & Values)
**Content:**
- Warm, candid photo of Adam with Kearstin and 4 kids
- Color photo (breaks the B&W pattern = warmth)
- Copy about family, JEHH Memorial Fund, Intentional360

**Copy:**
> "Before I am a coach, I am a husband and a father.
> The JEHH Memorial Fund. Intentional360.
> Everything I build is designed to leave the game—and the world—better than I found it."

**Technical:**
- Image parallax effect
- Soft fade transition

### Section G: The Ask (CTA)
**Content:**
- Headline: "Ready to train with The Architect?"
- Two CTAs:
  1. `[ Join the Founders Club ]` → NeoBall purchase (Limited to 168 Units)
  2. `[ Access the Knowledge Base ]` → YP App signup

**Technical:**
- Magnetic button effect
- Confetti on hover (subtle)
- Click tracking

---

## 6. SEO Strategy (EEAT Play)

### Meta Tags
```html
<title>Adam Harrington | NBA Skills Coach & Architect of Youth Performance</title>
<meta name="description" content="The official profile of Adam Harrington. Former NBA Shooting Coach (OKC, Nets), Head Coach of Phantom BC (Unrivaled), and Founder of Youth Performance." />
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
    {"@type": "Organization", "name": "Phantom BC"}
  ],
  "sameAs": [
    "https://twitter.com/AdamHarrington",
    "https://instagram.com/AdamHarrington"
  ]
}
```

---

## 7. Technical Requirements

### Stack
- **Framework:** Next.js 15 (App Router) - existing web-academy app
- **Route:** `/adam` or `/coaches/adam`
- **Animations:** Framer Motion
- **3D:** React Three Fiber (reuse NeoBall component from yp-vision)
- **Typography:** Variable fonts (Editorial New, Inter)

### Performance Targets
| Metric | Target |
|--------|--------|
| LCP | < 2.5s |
| FID | < 100ms |
| CLS | < 0.1 |
| Video Load | Lazy, poster first |

### File Structure
```
apps/web-academy/src/app/adam/
  page.tsx          # Main page
  components/
    Hero.tsx        # Section A
    Philosophy.tsx  # Section B
    Giants.tsx      # Section C (marquee)
    Testimonials.tsx # Section D
    Timeline.tsx    # Section E
    Family.tsx      # Section F
    CTA.tsx         # Section G
  lib/
    constants.ts    # Client names, testimonials, timeline data
```

---

## 8. Assets Required

### Must Have (Before Build)
- [ ] High-res photo: Adam coaching KD
- [ ] High-res photo: Adam with Nets staff
- [ ] High-res headshot: Unrivaled/Phantom BC
- [ ] Video: 10-15s of Adam on court (can be composited B&W)
- [ ] Family photo: Adam with Kearstin + kids

### Nice to Have
- [ ] Signature scan (for testimonial cards)
- [ ] Editorial New font license
- [ ] Player action shots (with permission)

---

## 9. Copy Guidelines

### DO Use
- "NBA/WNBA Skills Strategist"
- "Elite Performance Consultant"
- "The Architect"
- "Supplementing your grind with precision"

### DON'T Use
- "Ex-trainer" (diminishes)
- "Former player" without context
- Any language that bashes local trainers

### Key Messaging
1. **Experience:** 20+ years, NBA/WNBA/International
2. **Access:** "This mind for $168/year"
3. **Supplementation:** "We enhance what your local trainer builds"
4. **Institution:** "Not a person, a system"

---

## 10. Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Create route `/adam`
- [ ] Build Hero section with placeholder video
- [ ] Implement scroll-snap container

### Phase 2: Content Sections (Day 2)
- [ ] Build Philosophy section with 3D ball
- [ ] Build Giants marquee
- [ ] Build Testimonials cards

### Phase 3: Interactive (Day 3)
- [ ] Build Timeline with scroll animation
- [ ] Add all hover states
- [ ] Implement lazy loading

### Phase 4: Polish (Day 4)
- [ ] Add real assets (photos/video)
- [ ] SEO optimization (meta, schema)
- [ ] Performance audit
- [ ] Mobile testing

---

## 11. Open Questions

1. **Route:** `/adam` or `/coaches/adam` or `/team/adam`?
2. **Video:** Do we have footage or need to shoot?
3. **Testimonials:** Do we have written permission to use quotes?
4. **Font License:** Do we need to purchase Editorial New?

---

## 12. References

- [Linear.app](https://linear.app) - Animation inspiration
- [Nike.com athlete profiles](https://nike.com) - Editorial tone
- [Vanity Fair profiles](https://vanityfair.com) - Long-form prestige

---

*Spec Author: Claude (Wolf Pack Protocol)*
*Last Updated: 2026-01-06*
