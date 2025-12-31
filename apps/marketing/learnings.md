# YP Conversion Engine — Learnings

## Session: December 2024 (newypxmas)

### 1. Parent-First Funnel Strategy (Hormozi x Apple)

**Key Insight:** Don't ask for trust. Earn it.
- Let users see the plan + start the stack BEFORE email
- Email becomes the "save + personalize + send it to me" unlock
- Parents are the decision-makers and purchasers — optimize for them

**Funnel Flow:**
```
Landing → 5-step onboarding → Bulletproof Ankles (instant value) →
Start Stack → Completion → Save + Meet Wolf (email) → Ask Wolf → Offer ($88)
```

### 2. Pricing Evolution

- Started at $37 tripwire
- Moved to **$88 premium positioning**
- Anchor remains: "Normally included in the $29/mo Academy"
- Higher price signals quality for parents making decisions for their kids

### 3. Interest Pills > Long Quizzes

Instead of multi-step athlete type quizzes, use **outcome-focused pills**:
- Durability & Control: Bulletproof ankles, Better balance, Quieter landings
- Game Speed: Faster first step, Quicker cuts, Better stopping
- Strength & Power: Stronger feet + calves, Jump higher (safe), Core strength

**Rule:** Max 3 selections. Parents describe what they want in plain language.

### 4. AI Wolf Coach Profile Generator

Capture structured inputs during onboarding, then generate a human-readable "coach profile prompt":
- child_nickname, age_band, sport_focus, training_location, goals[], pain_flag
- Let users edit the prompt (Curio-style)
- Store structured fields too — don't depend on raw text edits

### 5. Parent Tonality

**Voice rules:**
- Calm authority, safety-first, "real schedule" friendly
- No shame language
- No medical diagnosis claims
- Short sentences. Clear verbs.
- "Plan / protocol / routine" > "workout"

**Key parent lines:**
- "Most kids don't need harder training — they need a stronger base."
- "You don't need perfect. You need repeatable."

### 6. Technical Stack Decisions

- **Auth:** Clerk with dark theme customization
- **Backend:** Convex (real-time, serverless)
- **Frontend:** React + Vite + Tailwind CSS
- **Analytics:** Custom utility with GA4/PostHog/Mixpanel support
- **Integration:** ConvexProviderWithClerk for unified auth/data

### 7. Navigation UX (Premium Mobile)

- Full-screen mobile overlay with backdrop blur
- Animated hamburger → X transition
- Staggered menu item animations
- Bebas Neue uppercase typography
- Body scroll lock when menu open
- Cyan gradient dividers and glows

### 8. Conversion Optimization Tactics

- Soft gate: Quiz identity visible, fix plan locked until email
- Social proof: "Join 2,400+ athletes training smarter"
- Progress indicators during onboarding
- Value BEFORE the ask — always
- Exit-intent on quiz results if no email captured

### 9. Data Model Essentials

Key Convex tables:
- profiles, subscriptions, programs, weeks, lessons
- lessonProgress, stacks, stackRuns, streaks
- analyticsEvents, leads, quizResponses

### 10. What Didn't Work (Cut from MVP)

- Multi-persona branching (athlete/coach/parent) — too complex for v1
- PDF lead magnets — web page + stack runner wins
- Long athlete type quizzes — interest pills are faster
- Complex personalization — start simple, iterate

---

## Next Sprint Priorities

1. Remove athlete/coach branching → assume parent from CTA
2. Add goals pills into step 3 (sport + goals)
3. Add post-stepper "Plan Ready" summary screen
4. Stack completion → Unlock Fix Plan prompt (email + nickname)
5. Add "Meet Your Wolf" prompt editor + first chat

---

## Session: December 28-29, 2024 (Wolf Protocol Landing)

### 11. Wolf Protocol Landing Page Components

Built conversion-focused landing page with military/high-tech aesthetic:

**Components Created:**
- `ProblemSection.jsx` - 4-slot Bento grid with TrainingGlobe (cobe) + hover reveals
- `WolfComparison.jsx` - "Death of the Private Coach" comparison table
- `MascotReveal.jsx` - "Meet YP: Your Pack Leader" with breathing animations
- `EvidenceFeed.jsx` - "THE PROOF" testimonials with infinite marquee
- `FinalCTA.jsx` - "Pack ID Gate" terminal-style signup with handle input
- `CardNav.jsx` - Premium room cards nav (Performance Center, Courts, Library)

**Page Flow:**
```
Hero → Problem Bento → R3 Method → Wolf Comparison →
Mascot Reveal → Evidence Feed → Final CTA → Newsletter → Footer
```

### 12. Premium Navigation Pattern (Room Cards)

Replaced standard nav with room-based card navigation (from drake2/index5):
- 3 rooms: Performance Center, Courts, Library
- Each card has: thumbnail, icon chip, external link arrow, badge, subtitle
- Badge states: "Start Trial" (amber), "Redeem" (cyan), "Open" (default)
- Footer: pulsing cyan dot + "ELITE TRAINING FOR EVERY KID, EVERYWHERE."

**Assets copied from drake2:**
- thumb-gym.webp, thumb-court.webp, thumb-library.webp
- performanceicon.webp, courticon.webp, libraryicon.webp

### 13. Design Tokens (Wolf Aesthetic)

**Colors:**
- Primary: Cyan #00F6E0 / #00FFFF
- Accent: Amber/Gold #FBBF24
- Success: Emerald #10B981
- Background: Pure black #000000, Secondary #0A0A0A

**Typography:**
- Display: Bebas Neue (uppercase, tracking-wide)
- Body: Inter

**Effects:**
- Glow shadows: `shadow-[0_0_30px_rgba(0,255,255,0.3)]`
- Backdrop blur: `backdrop-blur-xl`
- Corner brackets for terminal aesthetic
- Pulsing status indicators

### 14. Simplified Page Structure

Removed from Home.jsx (kept clean conversion funnel):
- Library section
- Modules section
- Features section
- Old Testimonials section
- Pricing CTA section

Replaced with:
- Wolf Dispatch Newsletter (minimal email capture)

### 15. Key Files Modified

```
src/components/
├── CardNav.jsx (NEW - room cards navigation)
├── Header.jsx (updated to use CardNav)
├── Footer.jsx (YP logo + tagline)
└── wolf-grow/
    ├── ProblemSection.jsx
    ├── WolfComparison.jsx (NEW)
    ├── MascotReveal.jsx (NEW)
    ├── EvidenceFeed.jsx (NEW)
    └── FinalCTA.jsx (NEW)

src/pages/
└── Home.jsx (updated page flow)

public/images/
├── thumb-gym.webp, thumb-court.webp, thumb-library.webp
├── performanceicon.webp, courticon.webp, libraryicon.webp
├── shoefoot.webp, spring.webp
└── authyp.png/webp
```

---

*Last updated: December 29, 2024*
