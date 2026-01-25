# Spec: THE ARCHITECT PAGE v2.0 (WolfGrow Edition)

> **Spec ID:** 005-adam-v2-wolfgrow
> **Codename:** Project Architect 2.0
> **Status:** Ready for Dev
> **Created:** 2026-01-08
> **Author:** WolfGrow (CMO) / Claude (Wolf Pack Protocol)
> **Target URL:** `app.youthperformance.com/adam`

---

## Summary

Transform Adam Harrington's profile from a static "Resume" (v1) into a high-conversion **"Mythology Page"** (v2). This isn't a bio—it's a sales letter disguised as a profile.

**The Pivot:**
- **FROM:** "Adam is a trainer who works with NBA players"
- **TO:** "Adam is The Architect—the man who builds the builders"

**Primary Goal:** Establish massive authority to justify premium pricing and build trust.
**Secondary Goal:** Humanize the hero through the "Real World Reset" story to create deep emotional connection with parents who fear failure for their kids.

---

## Constitution Alignment

- [x] **Athlete First:** Positions Adam as the system that builds elite athletes—gives kids access to "NBA-level precision"
- [x] **Parents Partners:** Dual-track design explicitly addresses parent concerns (safety, ROI, biomechanics)
- [x] **Simplicity:** Single-page scroll journey, no navigation complexity
- [x] **Stack Sacred:** Reinforces "Intentionality" philosophy and NeoBall as the physical embodiment

---

## User Stories

### US-1: The Skeptical Parent (Primary Buyer)

**As a** parent evaluating YouthPerformance,
**I want** proof that Adam has real credentials and understands my concerns,
**So that** I can trust my child is learning from a legitimate expert—not another YouTube coach.

#### Acceptance Criteria
- [ ] AC-1.1: Page clearly displays NBA/WNBA organizational logos (Nets, Thunder, etc.)
- [ ] AC-1.2: "Real World Reset" section shows Adam as relatable (the parking lot story)
- [ ] AC-1.3: Explicit "FOR THE PARENT" card addresses safety and biomechanics
- [ ] AC-1.4: Testimonials from recognizable names with verifiable context
- [ ] AC-1.5: Time on page > 3 minutes average

---

### US-2: The Aspiring Athlete (Primary User)

**As a** young basketball player,
**I want** to see that Adam trained real NBA stars,
**So that** I believe following his system will help me "level up."

#### Acceptance Criteria
- [ ] AC-2.1: KD, Jimmy Butler, Sabrina Ionescu prominently featured
- [ ] AC-2.2: Visual language feels "elite" and "cool" (dark mode, cyan accents)
- [ ] AC-2.3: "Cheat Code" positioning makes training feel like an unfair advantage
- [ ] AC-2.4: CTA leads to immediate trial or training start

---

### US-3: The Series A Investor (Secondary)

**As an** investor conducting due diligence,
**I want** institutional-grade resume presentation,
**So that** I can verify the founding team has the credentials to scale.

#### Acceptance Criteria
- [ ] AC-3.1: Timeline shows 20+ year career progression
- [ ] AC-3.2: Multiple NBA organizations represented
- [ ] AC-3.3: Current ventures (Phantom BC, Portland, The Clubhouse) visible
- [ ] AC-3.4: Professional schema markup for SEO/EEAT

---

## The Dual-Track User Journey

```
┌─────────────────────────────────────────────────────────────┐
│                    DUAL-TRACK DESIGN                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PARENT TRACK                    ATHLETE TRACK              │
│  ────────────                    ──────────────             │
│                                                             │
│  Need: Safety, Certainty, ROI    Need: Identity, Status     │
│                                                             │
│  Fear: "Is this a scam?"         Fear: "Is this lame?"      │
│                                                             │
│  Solution:                       Solution:                  │
│  • "Real World Reset" story      • KD/Nash "Receipts"       │
│  • Biomechanical Safety          • "Cheat Code" framing     │
│  • Father of 4 positioning       • Elite aesthetic          │
│                                                             │
│  CTA: "Start Free Trial"         CTA: "Train With Adam"     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Functional Requirements

### Must Have (P0)

1. **Hero Section** - Full-screen cinematic with headline, tagline, and primary CTA
2. **Origin Story** - "Real World Reset" section with vulnerability narrative
3. **Dual-Track Value Props** - Two cards: "For the Parent" / "For the Athlete"
4. **Social Proof Wall** - Logos + scrolling testimonials
5. **Conversion CTA** - "The Blueprint is Waiting" with trial link
6. **Mobile-First Design** - 80% of traffic is mobile (TikTok/IG)
7. **Video Autoplay** - Muted, compressed WebM, zero lag

### Should Have (P1)

1. **"Wolf Mode" Toggle** - Dark/cyan aesthetic switch
2. **Animated Timeline** - Scroll-triggered career progression
3. **Deep Link Integration** - CTA links to Adam Blueprint funnel
4. **Magnetic Button Effects** - Premium micro-interactions

### Nice to Have (P2)

1. **3D NeoBall** - React Three Fiber component (reuse from yp-vision)
2. **AR Bracket Overlay** - Blueprint theme visual effect
3. **Play Diagram Animations** - X's and O's basketball schematics
4. **Video Testimonial Modal** - Dashboard confessional style

---

## Section Breakdown

### SECTION A: THE HERO (Above the Fold)

| Element | Specification |
|---------|---------------|
| **Visual** | Full-screen B&W video loop (Adam analyzing shot), dark overlay |
| **H1** | `ADAM HARRINGTON` |
| **H2** | `THE ARCHITECT BEHIND THE MVPS.` |
| **Tagline** | "Talent gets you in the room. Systems keep you there. I built the system I wish I had." |
| **CTA** | `[TRAIN WITH ADAM]` - Wolf Cyan fill, Black text |
| **Video** | WebM/MP4, autoplay, muted, loop, lazy-loaded with poster |

### SECTION B: THE ORIGIN (Real World Reset)

| Element | Specification |
|---------|---------------|
| **Layout** | Split screen: Text (left), Video placeholder (right) |
| **Headline** | `THE REAL WORLD RESET` |
| **Video** | Dashboard confessional style (Adam speaking to camera about 2010) |
| **Copy** | See Content Spec below |
| **Emotional Arc** | Vulnerability → Lesson → Redemption |

**Copy:**
> "In 2010, I wasn't on an NBA sideline. I was in a parking lot, selling medical devices out of my trunk. I had played on 10 teams in 7 countries, but I felt the dream was over.
>
> That 'failure' was my greatest lesson. I realized that while I had talent, I lacked a **scientific system**. I went back to the lab—studying the biomechanics I learned from Dirk Nowitzki's mentor, Holger Geschwindner. I returned to the NBA not as a player, but as an architect. I built **The Blueprint** to give your child the certainty I never had."

### SECTION C: DUAL-TRACK VALUE (The Fork)

| Card | Icon | Headline | Copy |
|------|------|----------|------|
| **Parent** | Shield/Heart | `MORE THAN A COACH` | "I am a father of four first. At YP, we don't just build shooters; we build resilient young adults. No burnout. No gimmicks. Just the biomechanics I used to keep NBA All-Stars healthy and mentally tough." |
| **Athlete** | Lightning/Target | `THE CHEAT CODE` | "Stop guessing. I am handing you the exact footwork, balance, and release codes I drilled with KD, Jimmy Butler, and Kyrie. Don't wait until the pros to learn how to train like one." |

### SECTION D: THE RECEIPTS (Social Proof)

| Element | Specification |
|---------|---------------|
| **Layout** | "Wall of Greatness" - Logo grid + scrolling quotes |
| **Logos** | Nets, Thunder, NBA, Phantom BC, Portland |
| **Background** | Fast-cut video montage (3 clips from shot list) |
| **Featured Quotes** | Dinwiddie, Phil Handy (see below) |

**Quotes:**
- *"He made me feel like family."* — **Spencer Dinwiddie**
- *"One of the best basketball minds in the game."* — **Phil Handy (Lakers)**

### SECTION E: THE OFFER (Conversion)

| Element | Specification |
|---------|---------------|
| **Headline** | `THE BLUEPRINT IS WAITING.` |
| **Sub-Headline** | "Join the Pack. Lock In. Level Up." |
| **Primary CTA** | `[START FREE TRIAL]` - Wolf Cyan |
| **Secondary CTA** | `[WATCH THE MASTERCLASS]` - Outline button |
| **Deep Link** | Routes to Adam Harrington Blueprint funnel in app |

---

## Design Specifications (The Wolf Code)

### Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Architect Black | `#0A0A0A` | Primary background |
| Navy Deep | `#0a1628` | Secondary background |
| Wolf Cyan | `#00F0FF` | Primary accent, CTAs, active states |
| Wolf Cyan (YP) | `#00F6E0` | Alternative accent (existing brand) |
| Paper White | `#FFFFFF` | Headlines |
| Light Grey | `#A0A0A0` | Body text |
| Gold | `#C9A962` | Premium highlights |

### Typography

| Role | Font | Style |
|------|------|-------|
| Headlines | **Bebas Neue** | All caps, bold, tight kerning |
| Body | Inter | Premium sans-serif, high readability |
| Technical | JetBrains Mono | Data readouts, timestamps |

### Imagery Style

| Context | Treatment |
|---------|-----------|
| Hero | High-contrast B&W, cinematic grain |
| Past (Medical Sales) | Grainy, textured overlays, desaturated |
| Present (The Clubhouse) | Sharp 4K, full color, premium |
| Family | Warm color, breaks B&W pattern |

### Motion Principles

| Interaction | Duration | Easing |
|-------------|----------|--------|
| Page transitions | 400ms max | ease-out |
| Hover states | 150ms | immediate |
| Scroll animations | 600ms | ease-in-out |
| Button hover | 200ms | ease |
| Parallax | 0.3x scroll speed | linear |

---

## Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| **Performance** | LCP < 2.5s, FID < 100ms, CLS < 0.1 |
| **Mobile** | Primary viewport 375px, touch targets 44px min |
| **Video** | WebM with MP4 fallback, poster image first |
| **Accessibility** | WCAG 2.1 AA, focus states, alt text |
| **SEO** | JSON-LD Person schema, meta tags, OG tags |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Video fails to load | Poster image displays, graceful fallback |
| No JavaScript | Static content visible, CTAs functional |
| Slow connection | Lazy-loaded images, skeleton states |
| Wolf Mode toggle | Persists via localStorage |
| Mobile landscape | Adapts layout, no horizontal scroll |

---

## Out of Scope

Explicitly NOT included in this spec:

- [ ] Full team page (other coaches) - Future spec
- [ ] Booking/scheduling integration - Separate feature
- [ ] Chat/AI interaction on page - Different user flow
- [ ] E-commerce checkout - Routes to shop.youthperformance.com
- [ ] Video CMS integration - Static assets for v1

---

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Hero video footage | Blocker | **Needs shoot** |
| "Real World Reset" video | Blocker | **Needs shoot** |
| High-res logos (Nets, Thunder) | Blocker | **Needs sourcing** |
| Phil Handy quote permission | Nice-to-have | Pending |
| Dinwiddie quote permission | Nice-to-have | Pending |
| 3D NeoBall component | Nice-to-have | Ready (yp-vision) |

---

## Assets Required

### Must Have (Before Build)

| Asset | Status | Owner |
|-------|--------|-------|
| Hero video (10-15s Adam on court) | Needed | Adam Setti |
| "Dashboard Confessional" video | Needed | Adam Setti |
| High-res headshot (Architect pose with NeoBall) | Needed | Adam Setti |
| NBA org logos (Nets, Thunder, etc.) | Needed | Adam Setti |
| Family photo (Adam + Kearstin + 4 kids) | Needed | Adam Setti |

### Nice to Have

| Asset | Status |
|-------|--------|
| KD training footage | Pending |
| Jimmy Butler training footage | Pending |
| The Clubhouse B-roll | Pending |
| Player signatures (digital) | Pending |

---

## SEO Strategy (EEAT Play)

### Meta Tags

```html
<title>Adam Harrington | NBA Skills Coach & Architect of Youth Performance</title>
<meta name="description" content="The man who trained Kevin Durant to MVP. Former NBA Shooting Coach (OKC, Nets), Head Coach of Phantom BC (Unrivaled), and Founder of Youth Performance. Now building the next generation." />
```

### Schema Markup (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Adam Harrington",
  "jobTitle": ["Head Coach, Phantom BC", "NBA Skills Strategist", "Founder, Youth Performance"],
  "knowsAbout": ["Shooting Mechanics", "Player Development", "Basketball Biomechanics", "Elite Athletic Training"],
  "alumniOf": [
    {"@type": "CollegeOrUniversity", "name": "NC State University"},
    {"@type": "CollegeOrUniversity", "name": "Auburn University"}
  ],
  "worksFor": [
    {"@type": "Organization", "name": "Youth Performance"},
    {"@type": "Organization", "name": "Phantom BC"},
    {"@type": "Organization", "name": "Portland Trail Blazers"}
  ],
  "award": ["USA Junior National Team Gold Medal", "NBA Championship Coach (Staff)"],
  "sameAs": [
    "https://twitter.com/adampharrington",
    "https://instagram.com/adampharrington"
  ]
}
```

---

## Copy Guidelines

### DO Use
- "NBA/WNBA Skills Strategist"
- "Elite Performance Consultant"
- "The Architect"
- "The Blueprint"
- "Supplementing your grind with precision"
- "Steal reps"

### DON'T Use
- "Ex-trainer" (diminishes)
- "Former player" without context
- Any language that bashes local trainers
- Hype without receipts

### Key Messaging Hierarchy

1. **Experience:** 20+ years, NBA/WNBA/International
2. **Access:** "This mind for $168/year" (or free trial)
3. **Supplementation:** "We enhance what your local trainer builds"
4. **Institution:** "Not a person, a system"

---

## Open Questions

- [ ] Q1: **Video Production** - Do we have footage or need to schedule a shoot?
- [ ] Q2: **Quote Permissions** - Do we have written permission for Dinwiddie/Handy quotes?
- [ ] Q3: **Wolf Mode** - Priority P1 or defer to v2.1?
- [ ] Q4: **Deep Link Target** - Exact funnel URL for "Adam Blueprint"?
- [ ] Q5: **Analytics Events** - What specific events should we track?

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Time on Page | > 3 minutes | Analytics |
| Scroll Depth | > 80% | Heatmaps |
| Primary CTA Clicks | > 15% | Funnel tracking |
| Trial Starts (from page) | > 5% | Conversion |
| EEAT Score | Page 1 for "Adam Harrington basketball" | SEO |
| Bounce Rate | < 40% | Analytics |

---

## Implementation Phases

### Phase 1: Foundation (Day 1)
- [ ] Create/update `/adam` route structure
- [ ] Build Hero section with placeholder video
- [ ] Implement dark theme CSS variables
- [ ] Mobile-first responsive grid

### Phase 2: Content Sections (Day 2)
- [ ] Build "Real World Reset" origin section
- [ ] Build Dual-Track value cards
- [ ] Build Receipts social proof wall
- [ ] Build Conversion CTA section

### Phase 3: Polish (Day 3)
- [ ] Add Framer Motion animations
- [ ] Implement video autoplay/lazy-load
- [ ] Add Wolf Mode toggle (if P1)
- [ ] SEO optimization (schema, meta)

### Phase 4: Assets & QA (Day 4)
- [ ] Integrate real video assets
- [ ] Integrate high-res photos
- [ ] Mobile testing (375px, 390px)
- [ ] Performance audit (Lighthouse)
- [ ] Cross-browser testing

---

## Technical File Structure

```
apps/web-academy/src/app/adam/
├── page.tsx                 # Main page (updated)
├── layout.tsx               # Layout with metadata
├── globals.css              # Wolf Code theme (updated)
├── constants.ts             # All content data (updated)
├── components/
│   ├── index.ts             # Exports
│   ├── Hero.tsx             # Section A (updated)
│   ├── Origin.tsx           # Section B (NEW)
│   ├── DualTrack.tsx        # Section C (NEW)
│   ├── Receipts.tsx         # Section D (NEW)
│   ├── ConversionCTA.tsx    # Section E (NEW)
│   ├── WolfModeToggle.tsx   # P1 Feature (NEW)
│   └── ...                  # Existing components
└── assets/
    └── videos/
        └── hero-poster.jpg  # Video fallback
```

---

## References

- [Linear.app](https://linear.app) - Animation inspiration
- [Nike.com athlete profiles](https://nike.com) - Editorial tone
- [Apple.com](https://apple.com) - Clean aesthetic
- [Cyberpunk 2077 UI](https://cyberpunk.net) - Future/tech feel
- Existing v1: `apps/web-academy/src/app/adam/`
- Blueprint CSS: `apps/web-academy/src/app/adam/blueprint.css`

---

## WolfGrow Action Items

1. **Pass this spec to Design/Dev Team** immediately
2. **Task Adam Setti** with sourcing video assets for Section A & B
3. **Confirm "Real World Reset" video** is prioritized in next shoot
4. **Get written quote permissions** from Dinwiddie/Handy camps
5. **Define exact deep link URL** for Adam Blueprint funnel

---

*Spec Author: WolfGrow (CMO) + Claude (Wolf Pack Protocol)*
*Last Updated: 2026-01-08*
*Version: 2.0 - WolfGrow Edition*
