# Adam v3 Asset Requirements

> **Status:** Collecting
> **Owner:** Adam Setti / Mike
> **Due:** Before v3 production launch

---

## Logos (SVG preferred, PNG fallback)

### NBA Organization Logos
Used in: `Receipts.tsx` credentials bar

| Logo | File Name | Status |
|------|-----------|--------|
| Brooklyn Nets | `nets-logo.svg` | [ ] Needed |
| OKC Thunder | `thunder-logo.svg` | [ ] Needed |
| NBA | `nba-logo.svg` | [ ] Needed |
| Portland Trail Blazers | `blazers-logo.svg` | [ ] Needed |

### Venture Logos
Used in: `VenturesGrid.tsx` cards (optional enhancement)

| Logo | File Name | Status |
|------|-----------|--------|
| Phantom BC | `phantom-bc-logo.svg` | [ ] Needed |
| The Clubhouse | `clubhouse-logo.svg` | [ ] Needed |
| YouthPerformance | `yp-logo.svg` | [x] Have |
| JEHH Memorial Fund | `jehh-logo.svg` | [ ] Needed |

**Destination:** `apps/web-academy/public/images/adam/logos/`

---

## Photos

### Hero Section
| Photo | Dimensions | File Name | Status |
|-------|------------|-----------|--------|
| Adam cinematic hero shot | 1200x1600 (3:4) | `hero.jpg` | [ ] Needed |
| Adam with NeoBall | 1200x1600 (3:4) | `hero-neoball.jpg` | [ ] Needed |

### Family Section
| Photo | Dimensions | File Name | Status |
|-------|------------|-----------|--------|
| Adam + Kearstin + 4 kids | 1200x800 (3:2) | `family.jpg` | [ ] Needed |

### Meta/OG Images
| Photo | Dimensions | File Name | Status |
|-------|------------|-----------|--------|
| Adam professional headshot | 1200x630 | `adam-og.jpg` | [ ] Needed |
| Twitter card image | 1200x600 | `adam-twitter.jpg` | [ ] Needed |

### Testimonial Avatars (Optional)
| Person | Dimensions | File Name | Status |
|--------|------------|-----------|--------|
| Spencer Dinwiddie | 200x200 | `dinwiddie.jpg` | [ ] Optional |
| Phil Handy | 200x200 | `handy.jpg` | [ ] Optional |
| Kevin Durant | 200x200 | `durant.jpg` | [ ] Optional |
| Jamal Crawford | 200x200 | `crawford.jpg` | [ ] Optional |
| Scott Brooks | 200x200 | `brooks.jpg` | [ ] Optional |

**Destination:** `apps/web-academy/public/images/adam/`

---

## Video Clips

### Hero Background
| Video | Duration | File Name | Status |
|-------|----------|-----------|--------|
| Adam on court / analyzing shot | 10-15s loop | `hero-loop.mp4` | [x] Have (`ghost-handle.mp4`) |

### Timeline Video Reveals (v3 P2)
For Gemini to scrub:

| Year | Topic | Duration | Search Terms | File Name | Status |
|------|-------|----------|--------------|-----------|--------|
| 1998 | Junior Olympics | 30s | "Adam Harrington junior olympics 1998" "USA basketball youth" | `1998-olympics.mp4` | [ ] Needed |
| 2010 | The Reset | 60s | "Adam Harrington interview 2010" "medical sales to NBA" | `2010-reset.mp4` | [ ] Needed |
| 2014 | KD MVP | 45s | "Adam Harrington Kevin Durant" "KD MVP trainer" "OKC Thunder" | `2014-kd-mvp.mp4` | [ ] Needed |
| 2024 | Phantom BC | 30s | "Phantom BC Adam Harrington" "Unrivaled league coach" | `2024-phantom.mp4` | [ ] Needed |
| 2025 | YP Founding | 45s | "YouthPerformance Adam Harrington" "NeoBall launch" | `2025-yp.mp4` | [ ] Needed |

### Voice Story (v3 P0)
| Audio | Duration | File Name | Status |
|-------|----------|-----------|--------|
| Adam narration (2-3 min) | 2:30 | `voice-story.mp3` | [ ] Adam to record |

**Video Destination:** `apps/web-academy/public/videos/adam/`
**Audio Destination:** `apps/web-academy/public/audio/adam/`

---

## Voice Story Script

Adam to record naturally (2-3 minutes):

```
[0:00-0:15] THE HOOK
"Let me tell you something about failure..."

[0:15-1:00] THE PARKING LOT
"In 2010, I wasn't on an NBA sideline. I was in a parking lot,
selling medical devices out of my trunk. I had played on 10 teams
in 7 countries, but I felt the dream was over..."

[1:00-1:30] THE LESSON
"That 'failure' was my greatest lesson. I realized that while I had
talent, I lacked a scientific system. I went back to the lab—studying
biomechanics, balance, the details that separate good from great..."

[1:30-2:00] THE RETURN
"I returned to the NBA not as a player, but as an architect.
I've been privileged to work with Kevin Durant, Jimmy Butler,
Sabrina Ionescu—helping them refine what they already had..."

[2:00-2:30] THE PROMISE
"I built The Blueprint to give your child the certainty I never had.
The same foundation, the same details, the same obsessive attention
to balance and efficiency. At YouthPerformance, we don't just build
shooters—we build resilient young adults. Let's get to work."
```

---

## File Structure

```
apps/web-academy/public/
├── images/
│   └── adam/
│       ├── hero.jpg
│       ├── hero-neoball.jpg
│       ├── family.jpg
│       ├── adam-og.jpg
│       ├── adam-twitter.jpg
│       └── logos/
│           ├── nets-logo.svg
│           ├── thunder-logo.svg
│           ├── nba-logo.svg
│           ├── blazers-logo.svg
│           ├── phantom-bc-logo.svg
│           └── clubhouse-logo.svg
├── videos/
│   └── adam/
│       ├── ghost-handle.mp4 (existing)
│       ├── 1998-olympics.mp4
│       ├── 2010-reset.mp4
│       ├── 2014-kd-mvp.mp4
│       ├── 2024-phantom.mp4
│       └── 2025-yp.mp4
└── audio/
    └── adam/
        └── voice-story.mp3
```

---

## Priority Order

### P0 - Before Demo
- [ ] Hero photo (any high-quality Adam shot)
- [ ] Voice story script approval

### P1 - Before v3 Launch
- [ ] NBA org logos (4)
- [ ] Family photo
- [ ] OG/Twitter meta images
- [ ] Voice story recording

### P2 - Enhancement
- [ ] Timeline video clips (5)
- [ ] Venture logos (4)
- [ ] Player headshots (5)

---

*Last Updated: 2026-01-11*
