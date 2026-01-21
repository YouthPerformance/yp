# Spec: WolfGrow Content Strategy + Hydro-Wolf Calculator

> **Spec ID:** 011-wolfgrow-content-strategy
> **Status:** Draft
> **Created:** 2026-01-17
> **Author:** Mike (via Claude)

---

## Summary

A two-part initiative to dominate youth sports content in 2026. **Part 1** defines the "WolfGrow Standard" - a content engineering protocol optimized for E-E-A-T 2.0 and Answer Engine Optimization (AEO). **Part 2** specifies the "Hydro-Wolf Calculator" - an interactive utility tool that increases dwell time, captures leads, and provides first-party utility for hydration-related keywords.

The calculator serves as the flagship implementation of the content strategy - proving the "Interactive Utility" pillar works before rolling out to other content areas.

---

## Constitution Alignment

- [x] **Athlete First:** Provides scientifically-backed hydration guidance to prevent cramping, dehydration, and performance drops in young athletes.
- [x] **Parents Partners:** The calculator is designed for parents to use for their athletes. Email capture provides ongoing hydration tips. Printable plans give parents actionable gameday tools.
- [x] **Simplicity:** Three inputs (weight, duration, heat level) → one clear output (hydration game plan). No account required.
- [x] **Stack Sacred:** Hydration is foundational to the chassis methodology. Proper fluid intake enables elastic movement.

---

## Part 1: WolfGrow Content Standard (Process Spec)

### What Is WolfGrow?

WolfGrow is YP's content engineering protocol for 2026. It shifts from "content marketing" (quantity, keywords) to "content engineering" (utility, verification, machine-readability).

### The Three Pillars

#### Pillar 1: E-E-A-T 2.0 Protocol (Verification Over Claims)

| Requirement | Implementation |
|-------------|----------------|
| **Proof of Life Embed** | Every drill page requires video/GIF of Adam or James demonstrating. No stock photos. |
| **Author Entity Schema** | Person schema for Adam/James must link to external authority signals (NBA stats, LinkedIn, speaking gigs). |
| **First-Party Data** | Conduct and publish mini-studies (e.g., "We tested with 50 U12 players..."). Stop citing other blogs. |

#### Pillar 2: Answer Engine Optimization (AEO)

| Requirement | Implementation |
|-------------|----------------|
| **Answer First Format** | Top 10% of every page explicitly answers the core question in <50 words. |
| **Machine-Readable Tables** | Drill sets, reps, rest times formatted as HTML tables, not prose. |
| **Structured Data** | FAQ, HowTo, and SoftwareApplication schema on all relevant pages. |

**Example - Bad vs Good:**
- Bad: "Hydration is important because..."
- Good: "Youth athletes should drink 0.5-1 oz of water per pound of body weight daily, plus 5-10 oz every 15 minutes of intense activity."

#### Pillar 3: Interactive Utility (The Sticky Factor)

| Requirement | Implementation |
|-------------|----------------|
| **Micro-Tool Embeds** | Embed interactive calculators/tools at the top of relevant articles. |
| **Dwell Time Target** | Tools should increase average time on page by 30%+ vs static content. |
| **Lead Capture (Optional)** | Tools can offer email capture for "printable" or "expanded" versions. |

### WolfGrow Compliance Checklist

Every new content page must pass:

- [ ] Has video/GIF of Adam or James (if drill/movement content)
- [ ] Author schema links to external authority sources
- [ ] First paragraph answers the user's core question in <50 words
- [ ] All data presented in tables where applicable
- [ ] Embedded micro-tool if the topic warrants one
- [ ] SoftwareApplication schema if tool is present

---

## Part 2: Hydro-Wolf Calculator (Product Spec)

### Summary

An interactive youth athlete hydration calculator embedded in relevant content pages. Takes three inputs, outputs a personalized "Hydration Game Plan" with pre-game, during-game, and post-game recommendations.

**Target Keywords:**
- "youth sports hydration"
- "how much water should my child drink"
- "hydration for youth athletes"
- "sports hydration calculator for kids"

---

## User Stories

### US-1: Parent Calculates Hydration Needs
**As a** parent of a youth athlete,
**I want** to calculate exactly how much water my child needs during practice/games,
**So that** I can prevent dehydration, cramping, and performance drops.

#### Acceptance Criteria
- [ ] AC-1.1: User can enter child's weight in pounds (min: 40, max: 250)
- [ ] AC-1.2: User can enter activity duration in minutes (min: 15, max: 240)
- [ ] AC-1.3: User can toggle between "Standard" and "High Heat/Tournament" intensity
- [ ] AC-1.4: Results display within 100ms of input change (no submit button - reactive)
- [ ] AC-1.5: Results include total daily target, pre-game, during-game, and post-game recommendations

---

### US-2: Parent Gets Electrolyte Alert
**As a** parent of a youth athlete playing 60+ minutes,
**I want** to be alerted that water alone isn't enough,
**So that** I know to add electrolytes and prevent cramping.

#### Acceptance Criteria
- [ ] AC-2.1: If duration > 60 mins, display "Wolf Alert" with electrolyte recommendation
- [ ] AC-2.2: Alert is visually distinct (warning color, icon)
- [ ] AC-2.3: Alert includes specific guidance (sports drink, electrolyte tablets, etc.)

---

### US-3: Parent Saves Hydration Plan
**As a** parent of a youth athlete,
**I want** to get a printable version of my child's hydration plan,
**So that** I can reference it on gameday without opening the website.

#### Acceptance Criteria
- [ ] AC-3.1: "Get Printable Plan" CTA is visible after calculation
- [ ] AC-3.2: Email capture modal appears on CTA click (optional flow)
- [ ] AC-3.3: Plan can be downloaded as PDF or printed directly
- [ ] AC-3.4: Plan includes the calculated values plus "Adam's Electrolyte Recipes" bonus content

---

### US-4: Google Recognizes Calculator as Tool
**As a** content strategist,
**I want** Google to recognize this as an interactive calculator,
**So that** it can appear in rich results and be cited by AI answer engines.

#### Acceptance Criteria
- [ ] AC-4.1: Page includes valid SoftwareApplication schema
- [ ] AC-4.2: Schema includes name, description, applicationCategory, operatingSystem
- [ ] AC-4.3: Page passes Google Rich Results Test

---

## Functional Requirements

### Must Have (P0)

1. **Weight Input** - Number field, 40-250 lbs range, validation
2. **Duration Input** - Number field, 15-240 mins range, validation
3. **Heat Toggle** - Binary switch: Standard | High Heat
4. **Reactive Calculation** - Results update on any input change
5. **Result Card** - Displays total daily target, pre/during/post breakdown
6. **Electrolyte Alert** - Triggered when duration > 60 mins
7. **Mobile Responsive** - Full functionality at 375px viewport
8. **SoftwareApplication Schema** - Valid JSON-LD in page head

### Should Have (P1)

1. **Email Capture** - Modal for printable plan, integrates with existing email system
2. **Print/PDF Export** - Generates clean printable version
3. **Shopify CTA** - "Shop YP Water Bottle" link to shop.youthperformance.com
4. **Unit Toggle** - lbs/kg, oz/mL conversion (US default)

### Nice to Have (P2)

1. **Sport-Specific Presets** - Pre-fill typical durations for basketball, soccer, etc.
2. **Save to Profile** - If logged in, save athlete profile with weight for quick recalc
3. **Parent Dashboard Integration** - Show hydration data alongside training data
4. **Push Notification** - "Gameday reminder: [Athlete] needs X oz today"

---

## The Wolf Algorithm (Calculation Logic)

### Scientific Basis
- **Galpin Equation** - Standard for high-performance athletes
- **NATA Youth Guidelines** - Safety adjustments for children

### Formulas

```
Baseline Daily Intake = Weight (lbs) × 0.75 oz

Activity Adder (Standard) = (Duration / 15) × 5 oz
Activity Adder (High Heat) = (Duration / 15) × 8 oz

Total Daily Target = Baseline + Activity Adder

Electrolyte Flag = Duration > 60 mins
```

### Example Calculation

**Input:** 100 lbs, 90 mins, High Heat

```
Baseline: 100 × 0.75 = 75 oz
Activity Adder: (90 / 15) × 8 = 48 oz
Total: 75 + 48 = 123 oz (~7-8 bottles)

Electrolyte Flag: TRUE (90 > 60)
```

### Output Breakdown

| Phase | Formula | Example (100 lbs, 90 min, High Heat) |
|-------|---------|--------------------------------------|
| Pre-Game (2 hrs before) | 16 oz flat | 16 oz (1 bottle) |
| During Game | Activity Adder / (Duration / 15) per 15-min interval | 8 oz per quarter/timeout |
| Post-Game | 20 oz + protein recommendation | 20 oz + chocolate milk |
| Daily Total | Baseline + Activity Adder | 123 oz |

---

## Non-Functional Requirements

| Aspect | Requirement |
|--------|-------------|
| Performance | Calculator interaction < 100ms, no perceptible lag |
| Accessibility | WCAG 2.1 AA - keyboard navigable, screen reader labels |
| Mobile | Full functionality at 375px, touch-friendly inputs |
| SEO | Valid SoftwareApplication schema, passes Rich Results Test |
| Analytics | Track calculator interactions (inputs, completions, CTA clicks) |

---

## Edge Cases

| Scenario | Expected Behavior |
|----------|-------------------|
| Weight below 40 lbs | Show validation error: "Please enter weight between 40-250 lbs" |
| Weight above 250 lbs | Show validation error: "Please enter weight between 40-250 lbs" |
| Duration below 15 mins | Show validation error: "Minimum activity duration is 15 minutes" |
| Duration above 240 mins | Show validation error: "For activities over 4 hours, consult a sports nutritionist" |
| Empty inputs | Show placeholder results with "Enter details to calculate" message |
| Non-numeric input | Prevent input / show validation error |
| JavaScript disabled | Show static fallback with general guidelines table |

---

## Result Card Design (Wireframe)

```
┌────────────────────────────────────────────────────┐
│  🏀 YOUR HYDRATION GAME PLAN                       │
├────────────────────────────────────────────────────┤
│                                                    │
│  Total Daily Target: 123 oz (~7 bottles)           │
│                                                    │
│  📅 PRE-GAME (2 hrs before)                        │
│     16 oz (1 bottle)                               │
│                                                    │
│  ⏱️ DURING GAME                                    │
│     8 oz every timeout/quarter                     │
│                                                    │
│  🔋 POST-GAME                                      │
│     20 oz + Protein (Chocolate milk recommended)   │
│                                                    │
├────────────────────────────────────────────────────┤
│  ⚠️ WOLF ALERT                                     │
│  You're playing 90+ mins. Water isn't enough.      │
│  Add electrolytes to prevent cramping.             │
├────────────────────────────────────────────────────┤
│                                                    │
│  [📄 Get Printable Plan]  [🛒 Shop YP Bottle]      │
│                                                    │
└────────────────────────────────────────────────────┘
```

---

## Out of Scope

- **Real-time weather integration** - Would require location services, adds complexity
- **Individual sweat rate testing** - Too advanced for v1, requires hardware
- **Medical advice** - Calculator provides general guidelines only, not medical advice
- **Multi-athlete batch calculations** - v1 is single-athlete focused
- **Hydration tracking/logging** - Future feature, requires auth

---

## Dependencies

| Dependency | Type | Status |
|------------|------|--------|
| Playbook app (Astro) | Host | Ready |
| Email capture system | P1 Feature | Existing (ConvertKit?) |
| Shopify shop | P1 CTA Link | Ready |
| Analytics (PostHog/GA) | Tracking | Ready |

---

## Open Questions

- [x] Q1: Which email system are we using? **Resend (customized)**
- [x] Q2: Should the calculator live in Playbook (Astro) or Academy (Next.js)? **Marketing app (youthperformance.com/hydration-calculator)**
- [x] Q3: Do we have existing "electrolyte recipes" content from Adam/James to include? **Source from verified youth sports nutrition guidelines**
- [x] Q4: What's the Shopify product URL for the YP water bottle? **TBD - link to shop.youthperformance.com**

---

## References

- [Galpin Equation - Dr. Andy Galpin](https://www.andygalpin.com/)
- [NATA Youth Hydration Guidelines](https://www.nata.org/)
- [Google SoftwareApplication Schema](https://schema.org/SoftwareApplication)
- [Related Spec: 005-adam-v2-wolfgrow](../005-adam-v2-wolfgrow/spec.md)

---

## Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Calculator Completions | 500/month | Analytics event: `hydration_calc_complete` |
| Avg Time on Page | +30% vs static | Google Analytics |
| Email Captures | 10% of completions | CTA click → email submit |
| Rich Result Appearance | Within 30 days | Google Search Console |
| Keyword Rankings | Page 1 for "youth hydration calculator" | SEMrush/Ahrefs |

---

*Note: This spec is technology-agnostic. Technical decisions (React vs Astro, Tailwind config, etc.) belong in the plan.md*
