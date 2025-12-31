# Linear Tickets — Parent-Focused Funnel v2.0

## Epic: E10 — Parent-First Funnel Overhaul (P0)

---

### E10-1: Update Landing Page for Parent-First CTA
**Priority:** P0 ✓ DONE
**Estimate:** 2 points
**Description:**
Update landing hero to target parents explicitly.

**Tasks:**
- [x] Change primary CTA to "Get Bulletproof Ankles (Free)"
- [x] Add helper text: "8 minutes. Age-adjusted. Safe progressions."
- [x] Update subhead to parent-focused copy
- [x] Preselect "Parent" in role selection

**Acceptance Criteria:**
- [x] Landing hero uses parent-first messaging
- [x] CTA leads directly to parent onboarding flow

---

### E10-2: Implement 5-Step Parent Onboarding Stepper
**Priority:** P0 ✓ DONE
**Estimate:** 5 points
**Description:**
Rebuild onboarding as a 5-step stepper with parent-first UX.

**Tasks:**
- [x] Step 1: Role selection (Parent preselected)
- [x] Step 2: Child age band (Under 8, 8-12, 13+)
- [x] Step 3: Sport + Goals (with Interest Pills)
- [x] Step 4: Training location
- [x] Step 5: Safety/Pain flag

**Acceptance Criteria:**
- [x] Progress indicator shows "Step X of 5"
- [x] Back button works on all steps
- [x] Data persists through onboarding context

---

### E10-3: Implement Interest Pills (Goals Multi-Select)
**Priority:** P0 ✓ DONE
**Estimate:** 3 points
**Description:**
Replace long quiz with outcome-focused interest pills in Step 3.

**Tasks:**
- [x] Create pill component with multi-select (max 3)
- [x] Implement pill categories:
  - Durability & Control (4 pills)
  - Game Speed (3 pills)
  - Strength & Power (1 pill)
  - Comfort & Constraints (4 pills)
  - Basketball Skills (4 pills, conditional)
- [x] Show "Recommended" pills based on sport selection
- [x] Store selected goals in onboarding context

**Acceptance Criteria:**
- [x] Max 3 pills can be selected
- [x] Basketball pills only show when basketball selected
- [x] Visual feedback on selection state

---

### E10-4: Add "Plan Ready" Interstitial Screen
**Priority:** P0 ✓ DONE
**Estimate:** 2 points
**Description:**
Add summary screen after Step 5, before Bulletproof Ankles page.

**Tasks:**
- [x] Create PlanReady.jsx component
- [x] Display personalized summary:
  - Age band
  - Sport focus
  - Training space
  - Selected goals
- [x] Primary CTA: "View the Bulletproof Ankles Protocol"
- [x] Secondary CTA: "Start the 8-minute stack now"

**Acceptance Criteria:**
- [x] Shows personalized data from onboarding
- [x] Routes correctly to next step

---

### E10-5: Update Stack Completion Flow
**Priority:** P0 ✓ DONE
**Estimate:** 3 points
**Description:**
Redesign stack completion to drive email capture naturally.

**Tasks:**
- [x] Update completion screen copy:
  - Title: "Session complete."
  - Body: "That was a real rep..."
- [x] Primary CTA: "Save Streak + Unlock the 7-Day Plan"
- [x] Secondary CTA: "Ask Wolf a question (preview)"
- [x] Add tiny line: "Saving takes 20 seconds. No spam."

**Acceptance Criteria:**
- [x] Completion screen uses parent-friendly copy
- [x] CTAs route to appropriate flows

---

### E10-6: Implement Save/Profile Creation (Email + Nickname)
**Priority:** P0 ✓ DONE
**Estimate:** 3 points
**Description:**
Create parent-friendly profile creation with email and child nickname.

**Tasks:**
- [x] Create SaveProfile.jsx component
- [x] Fields:
  - Parent email (required)
  - Child nickname (optional)
  - Guardian checkbox
- [x] Store in Convex profiles table
- [x] Show success feedback

**Acceptance Criteria:**
- [x] Email validation works
- [x] Profile saved to Convex
- [x] Success feedback shown

---

### E10-7: Build "Meet Your Wolf" Prompt Editor (Curio-style)
**Priority:** P1 ✓ DONE
**Estimate:** 5 points
**Description:**
Create editable AI coach profile based on user inputs.

**Tasks:**
- [x] Create MeetWolf.jsx component
- [x] Generate prompt from structured data:
  - child_nickname, age_band, sport_focus
  - training_location, goals[], pain_flag
- [x] Editable text box with generated prompt
- [x] Primary CTA: "Start Chat with Wolf"
- [x] Secondary CTA: "Edit later in Settings"
- [x] Store prompt in Convex

**Acceptance Criteria:**
- [x] Prompt auto-generates from onboarding data
- [x] User can edit prompt
- [x] Prompt persists to database

---

### E10-8: Implement First Wolf Chat Experience
**Priority:** P1 ✓ DONE
**Estimate:** 5 points
**Description:**
Create first chat experience with pre-loaded questions.

**Tasks:**
- [x] Create WolfChat.jsx component
- [x] Preload suggested questions:
  - "Is barefoot training safe for my child's age?"
  - "How often should we do this each week?"
  - "What's a safe Week 1 plan?"
  - "What if my child feels pain during an exercise?"
  - "How will I know if this is working?"
- [x] Auto-send first message with context
- [x] Display Wolf responses with block components

**Acceptance Criteria:**
- [x] Suggested questions appear as chips
- [x] Chat uses Wolf prompt for responses
- [x] Responses feel personalized

---

### E10-9: Update Offer Page to $88
**Priority:** P0 ✓ DONE
**Estimate:** 1 point
**Description:**
Update Barefoot Reset offer pricing and copy.

**Tasks:**
- [x] Change price from $37 to $88
- [x] Update offer copy:
  - Title: "Barefoot Reset (Lifetime Protocol)"
  - Sub: "The full progression after Bulletproof Ankles..."
  - Anchor: "Normally included in the $29/mo Academy."

**Acceptance Criteria:**
- [x] $88 price displayed correctly
- [x] Copy matches parent-friendly tone

---

### E10-10: Implement i18n JSON Structure
**Priority:** P2 ✓ DONE
**Estimate:** 3 points
**Description:**
Extract all copy to i18n JSON for localization.

**Tasks:**
- [x] Create /src/i18n/en.json with all copy
- [x] Implement useTranslation hook or context
- [ ] Replace hardcoded strings with i18n keys (optional - can be done incrementally)
- [x] Document i18n usage

**Acceptance Criteria:**
- [x] All user-facing copy in JSON
- [x] Components can use translation hooks
- [x] Easy to add new languages

**Files Created:**
- `src/i18n/en.json` - Complete English translations
- `src/i18n/index.js` - I18nProvider + useTranslation hook

**Usage:**
```jsx
import { useTranslation } from '../i18n'

function MyComponent() {
  const { t } = useTranslation()
  return <h1>{t('home.hero.title')}</h1>
}
```

---

### E10-11: Update Parent Settings Page
**Priority:** P2 ✓ DONE
**Estimate:** 3 points
**Description:**
Create settings page for parents to manage profile and Wolf.

**Tasks:**
- [x] Child profile section:
  - Edit nickname, age band, goals, pain flag
- [x] Wolf coach section:
  - Edit/reset prompt
- [x] Progress section:
  - Streak history, completed sessions

**Acceptance Criteria:**
- [x] All editable fields work
- [x] Changes persist to Convex
- [x] Reset prompt returns to default

**File Updated:**
- `src/pages/Settings.jsx` - Complete parent-focused settings page

---

### E10-12: Apply Parent Tonality Across All Copy
**Priority:** P1 ✓ DONE
**Estimate:** 2 points
**Description:**
Audit and update all copy to match parent voice rules.

**Voice Rules:**
- Calm authority, safety-first
- No shame language
- No medical diagnosis claims
- Short sentences. Clear verbs.
- "Plan / protocol / routine" > "workout"

**Tasks:**
- [x] Audit all components for copy
- [x] Update to parent-friendly tone
- [x] Add safety notes where appropriate

**Acceptance Criteria:**
- [x] All copy follows voice rules
- [x] Safety messaging consistent

**Files Updated:**
- Home.jsx - Problem strip now solution-focused, R3 copy clearer
- QuizResults.jsx - "Fix" → "Plan", softer upsell copy
- Quiz.jsx - "Movement Check" header, parent-friendly description
- StartHereModal.jsx - Safety note includes disclaimer

---

## Summary

| Ticket | Title | Priority | Points | Status |
|--------|-------|----------|--------|--------|
| E10-1 | Landing Page Parent-First CTA | P0 | 2 | ✓ DONE |
| E10-2 | 5-Step Parent Onboarding | P0 | 5 | ✓ DONE |
| E10-3 | Interest Pills (Goals) | P0 | 3 | ✓ DONE |
| E10-4 | Plan Ready Interstitial | P0 | 2 | ✓ DONE |
| E10-5 | Stack Completion Flow | P0 | 3 | ✓ DONE |
| E10-6 | Save/Profile Creation | P0 | 3 | ✓ DONE |
| E10-7 | Meet Your Wolf Editor | P1 | 5 | ✓ DONE |
| E10-8 | First Wolf Chat | P1 | 5 | ✓ DONE |
| E10-9 | Offer Page $88 | P0 | 1 | ✓ DONE |
| E10-10 | i18n JSON Structure | P2 | 3 | ✓ DONE |
| E10-11 | Parent Settings Page | P2 | 3 | ✓ DONE |
| E10-12 | Parent Tonality Audit | P1 | 2 | ✓ DONE |

**Total P0:** 19 points (7 tickets) — **ALL DONE**
**Total P1:** 12 points (3 tickets) — **ALL DONE**
**Total P2:** 6 points (2 tickets) — **ALL DONE**
**Grand Total:** 37 points (12 tickets) — **ALL DONE ✓**

---

## Epic: E11 — Lane-Based Stack System (P1)

### E11-1: Implement 6 Lane-Specific Stacks
**Priority:** P1 ✓ DONE
**Estimate:** 8 points
**Status:** Implemented in `src/config/laneStacks.js`
**Description:**
Create 6 different 8-minute stack templates based on lane routing.

**Stacks:**
1. **STACK_BASE_8** (Base Stability - "Seal the Base")
2. **STACK_QUIET_8** (Quiet Landing - "Soft + Controlled")
3. **STACK_SPEED_8** (Speed - "Quick Off the Floor")
4. **STACK_JUMP_8** (Jump & Land - "Bounce Safely")
5. **STACK_SILENT_8** (Apartment/Quiet - "Silent Stack")
6. **STACK_RETURN_8** (Return Carefully - "Restore + Rebuild")

**Acceptance Criteria:**
- [x] All 6 stacks defined in laneStacks.js
- [x] Lane selection drives which stack loads
- [x] Each stack has appropriate exercises
- [x] StackRunner updated to use lane stacks

---

### E11-2: Create New Drill Cards for New Exercises
**Priority:** P1 ✓ DONE
**Estimate:** 3 points
**Status:** Implemented in `src/config/drills.js`
**Description:**
Add drill content for new exercises referenced in lane stacks.

**New Drills:**
- [x] Toe-to-Heel Rockers
- [x] Fast Feet in Place
- [x] Stick the Stop
- [x] Snap Down
- [x] Supported Single Leg Balance
- [x] Silent Step-downs
- [x] Pain Check

**Tasks:**
- [x] Write instruction copy for each drill
- [x] Add cue text
- [x] Add safety notes
- [ ] Create placeholder images/videos (TODO)

---

### E11-3: Implement 7-Day Plan Generator
**Priority:** P1 ✓ DONE
**Estimate:** 5 points
**Status:** Implemented in `src/config/weekPlans.js`
**Description:**
Generate 7-day plans based on selected lane.

**Tasks:**
- [x] Create WeekGrid component (`src/components/wolf/WeekGrid.jsx`)
- [x] Generate plan based on lane (`generate7DayPlan()`)
- [x] Display in Wolf chat
- [x] Store plan in Convex (via profile wolfPrompt)

---

### E11-4: Implement Lane-Specific Upsell Framing
**Priority:** P1 ✓ DONE
**Estimate:** 2 points
**Status:** Implemented in `src/config/weekPlans.js`
**Description:**
Different lanes frame the Barefoot Reset offer differently.

**Upsell Copy by Lane:**
- [x] Base Stability copy
- [x] Quiet Landing copy
- [x] Return Carefully copy
- [x] All lane-specific upsell copy defined

---

## Epic: E12 — Interest Pills v2 (Full Spec)

### E12-1: Complete Pill Taxonomy (12 + 4)
**Priority:** P0 ✓ DONE
**Status:** Implemented in `src/config/interestPills.js`

---

### E12-2: Implement Lane Routing Priority Logic
**Priority:** P0 ✓ DONE
**Status:** Implemented in `src/config/interestPills.js`

---

### E12-3: Implement Recommended Pills Preselection
**Priority:** P1 ✓ DONE
**Estimate:** 2 points
**Status:** Implemented in `src/config/interestPills.js` + `InterestPillsGrid.jsx`
**Description:**
Auto-preselect 2 recommended pills based on context.

**Tasks:**
- [x] Create `getPreselectedPills()` function
- [x] Add `enablePreselection` prop to InterestPillsGrid
- [x] Enable in StartHereModal

---

## Epic: E13 — Wolf AI Coach (P1)

### E13-1: Wolf First Message Template
**Priority:** P1 ✓ DONE
**Estimate:** 3 points
**Status:** Implemented in `src/config/interestPills.js`
**Description:**
Generate Wolf's opening message based on context.

**Tasks:**
- [x] Create `generateWolfFirstMessage()` function
- [x] Include personalized context (name, age, space, goals)
- [x] Display in WolfChat

---

### E13-2: Wolf Response Blocks (SessionStack, WeekGrid)
**Priority:** P1 ✓ DONE
**Estimate:** 5 points
**Status:** Implemented in `src/components/wolf/`
**Description:**
Create block components Wolf can use in responses.

**Components:**
- [x] SessionStack - displays a runnable stack
- [x] WeekGrid - displays 7-day plan
- [x] DrillCard - displays single drill
- [x] SafetyNote - displays safety callout

---

## Summary (All Epics)

| Epic | Title | Tickets | Points | Status |
|------|-------|---------|--------|--------|
| E10 | Parent-First Funnel | 12 | 37 | 12/12 DONE ✓ |
| E11 | Lane-Based Stacks | 4 | 18 | 4/4 DONE ✓ |
| E12 | Interest Pills v2 | 3 | 2 | 3/3 DONE ✓ |
| E13 | Wolf AI Coach | 2 | 8 | 2/2 DONE ✓ |
| E14 | Wolf Grow Premier Landing | 10 | 46 | 0/10 Pending |

**Completed Epics:** 21/21 tickets (100%) ✓
**New Epic E14:** 10 tickets, 46 points (Pending)
**Grand Total:** 31 tickets, 111 points

---

## Files Created/Modified

### New Files:
- `src/config/drills.js` - Drill definitions with instructions, cues, safety notes
- `src/config/laneStacks.js` - 6 lane-specific 8-minute stacks
- `src/config/weekPlans.js` - 7-day plan generator, upsell copy
- `src/components/wolf/SessionStack.jsx` - Stack display component
- `src/components/wolf/WeekGrid.jsx` - Week plan grid component
- `src/components/wolf/DrillCard.jsx` - Single drill display
- `src/components/wolf/SafetyNote.jsx` - Safety callout component
- `src/components/wolf/index.js` - Wolf components barrel export
- `src/pages/MeetWolf.jsx` - Wolf prompt editor page
- `src/pages/WolfChat.jsx` - Wolf chat experience

### Modified Files:
- `src/config/interestPills.js` - Added preselection, Wolf first message
- `src/components/InterestPillsGrid.jsx` - Added enablePreselection prop
- `src/components/StartHereModal.jsx` - Enabled pill preselection
- `src/pages/app/StackRunner.jsx` - Uses lane stacks
- `src/App.jsx` - Added MeetWolf and WolfChat routes

---

## Epic: E14 — Wolf Grow Premier Landing Page (P0)

### 🐺 WOLF GROW: PREMIER LANDING PAGE PROTOCOL

**The Concept:** A cinematic landing page blending:
- **Apple Product Page** (scrollytelling, high-fidelity device renders)
- **Nike Brand Manifesto** (emotional, gritty, aspirational)
- **Hormozi/Suby Persuasion Architecture** (problem agitation, solution, undeniable offer)

**Target:** Club-Track Optimizer Parent (ICP)
**Pain:** 3+ hours/day on sports, $1500+/year on trainers, ACL tear anxiety
**Promise:** Pro-level development. At home. Safe. Measurable.

---

### 🎨 Design System: "VOID & VOLT"

| Token | Value | Usage |
|-------|-------|-------|
| Void Black | `#050505` | Background, deep infinite depth |
| Wolf Cyan | `#00FFFF` | Buttons, key stats, rim-lighting (sparingly) |
| Headlines | **Bebas Neue** | Massive, tight kerning (-0.02em), white |
| Body | **Inter** | Clean, gray-300, readable |
| Texture | 3% film grain | Remove digital coldness |

---

### E14-1: Foundation Setup (Lenis + Motion System)
**Priority:** P0
**Estimate:** 3 points
**Description:**
Set up the premium scroll and animation foundation.

**Tasks:**
- [ ] Install and configure Lenis scroll (`@studio-freight/react-lenis`)
- [ ] Configure `lerp: 0.1` for luxury weight/smoothness
- [ ] Set up Framer Motion with custom easing curves:
  - Premium Reveal: `[0.25, 1, 0.5, 1]`
  - Impact: `[0.22, 1, 0.36, 1]`
- [ ] Add global film grain overlay (3% opacity, pointer-events: none)
- [ ] Configure `-webkit-font-smoothing: antialiased` globally
- [ ] Install Bebas Neue font

**Lenis Config:**
```tsx
<ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
```

**Acceptance Criteria:**
- [ ] Scroll feels "buttery smooth" not jerky
- [ ] Animations have weight, not bounce
- [ ] Film grain visible on gradients

---

### E14-2: Hero Section ("The Initiation")
**Priority:** P0
**Estimate:** 5 points
**Description:**
Create the cinematic hero with clip-path text reveal and premium CTA.

**Visual Spec:**
- Cinematic slow-mo loop of youth athlete (12yo), calm breathing, eyes locked
- Dark void background with Cyan rim-light outlining profile
- Text: "THE PRO ACADEMY IN YOUR POCKET."

**Animation Sequence (On Mount):**
1. Background video fades in (opacity 0→1, 1.2s)
2. Headline: Clip-path reveal (y: 100%→0%, delay 0.2s)
3. Subhead: Fade up (y: 20px→0, delay 0.6s)
4. CTA Button: Scale up (scale 0.9→1, delay 0.8s)

**Copy:**
```
HEADLINE: THE PRO ACADEMY IN YOUR POCKET.
SUBHEAD: The world's first AI-native training system. Master the 15-minute
daily habits used by pros to build speed, durability, and elite movement.
VELVET ROPE: Entry to the Academy requires completion of the 7-Day Reset.
CTA: [ START THE 7-DAY RESET ]
```

**Micro-Interactions:**
- [ ] Button hover: "Sheen" effect (white diagonal line sweep)
- [ ] Button has "breath" glow animation

**Midjourney Prompt:**
```
cinematic close-up of a 12 year old basketball player, determined focus,
heavy sweat texture, dark void background, rim lighting in electric cyan,
8k resolution, shot on Arri Alexa, anamorphic lens, high contrast,
nike commercial style --ar 16:9 --v 6.0
```

**Acceptance Criteria:**
- [ ] Text reveals feel "heavy" and premium
- [ ] Button sheen effect on hover
- [ ] No layout shift on load

---

### E14-3: Agitation Section ("The Sports Parent Tax")
**Priority:** P0
**Estimate:** 5 points
**Description:**
Scrollytelling section with pinned text swaps and impact animations.

**Visual Spec:**
- No photos. Stark, massive text on black.
- Text flies in like heavy impacts as user scrolls

**UX Technique:** Sticky Scroll (Pinning)
- Section pins while user scrolls
- Text swaps in place with blur/scale transitions

**Text Swap Animation:**
- Exit: Blur out + scale down (`blur(10px)`, `scale: 0.9`, opacity 0)
- Enter: Sharpen in + scale up (`blur(0px)`, `scale: 1`, opacity 1)

**Impact Words:**
1. "THE COMMUTE." (Impact)
2. "THE COST." (Impact)
3. "THE INJURY RISK." (Glitch effect)

**Copy:**
```
HEADLINE: THE SYSTEM IS BROKEN. WE FIXED IT.

BODY:
Let's be honest. You love watching them play, but the "Youth Sports
Industrial Complex" is exhausting.

You are spending 3+ hours a day in the car. You're dropping $1,500+ a year
on fees, gear, and private trainers who just count reps.

The worst part? You see kids getting hurt. ACL tears at 13. Burnout at 15.

You want them to reach their potential. But you shouldn't have to sacrifice
your family's sanity—or their long-term health—to get there.

Stop paying for "more reps." Start building a better athlete.
```

**Acceptance Criteria:**
- [ ] Section pins correctly during scroll
- [ ] Text transitions feel impactful
- [ ] Works on mobile (touch scroll)

---

### E14-4: Solution Section ("The Exploded Phone")
**Priority:** P0
**Estimate:** 8 points
**Description:**
Apple-style exploded view showing app layers expanding on scroll.

**Visual Spec:**
- High-fidelity 3D iPhone render running YP app
- Phone floats center screen
- 3 glass layers behind: Video Layer, Data Layer, Community Layer

**Animation Technique:** Scroll-Linked Interpolation
- Phone stays centered
- Layers expand outward on Z-axis as user scrolls
- `useTransform(scrollYProgress, [0, 1], [0, 200])`

**Copy:**
```
HEADLINE: 15 MINUTES. ZERO COMMUTE. PRO RESULTS.

BODY:
We replaced the drive to the gym with consistency.

YP isn't just "drills." It is a complete athletic operating system.
Our AI-native platform delivers the exact warm-ups, plyometrics, and
barefoot durability work used by NBA and Premier League athletes.

• Scientific Structure: No random workouts. A progressive curriculum.
• Gamified Growth: Earn badges. Climb the leaderboard. Stay locked in.
• Visual Proof: Track their progress in real-time.

FLOATING TEXT: "It's like having a Pro Trainer in their pocket 24/7."
```

**Midjourney Prompt:**
```
UI design of a futuristic sports training app, dark mode, cyan accents,
data visualization of jump height, sleek, minimal, apple design award
winner style --ar 9:16
```

**Acceptance Criteria:**
- [ ] Layers expand smoothly on scroll
- [ ] Phone render is high-fidelity
- [ ] Effect communicates "depth and complexity"

---

### E14-5: Authority Section ("The Living Portraits")
**Priority:** P1
**Estimate:** 5 points
**Description:**
Trainer showcase with B&W to color video transitions on hover.

**Visual Spec:**
- B&W high-contrast portraits of trainers
- Horizontal slider: "Meet the Architects"

**State A (Idle):**
- Black & White photo, high contrast
- Name visible

**State B (Hover):**
- Instant cut to Color Video Loop of trainer coaching
- Wolf Cyan gradient overlay at 20% opacity
- Custom "Play" cursor icon

**Copy:**
```
HEADLINE: TRAIN WITH THE MASTERS.

BODY:
Your child won't be trained by influencers. They will be trained by
the experts who build professionals.

Our team trains athletes in the NBA, NFL, and Olympics. Now, they are
training your child. We've distilled their elite protocols into
micro-doses that fit into a student-athlete's busy life.
```

**Acceptance Criteria:**
- [ ] B&W to color transition is instant/sharp
- [ ] Video loops smoothly on hover
- [ ] Custom cursor on trainer cards

---

### E14-6: Results Section ("The Comparison Slider")
**Priority:** P1
**Estimate:** 5 points
**Description:**
Before/after drag slider with "heavy" physics.

**Visual Spec:**
- Split screen video comparison
- Left: "Day 1" - Force Leaker (wobbly landing)
- Right: "Day 30" - Iron Ankles (stuck, perfect landing)

**Interaction:**
- Vertical handle bar in center
- User drags left/right
- Drag has resistance (feels heavy)
- Labels fade based on handle proximity

**Copy:**
```
HEADLINE: DON'T GUESS. MEASURE.

SUBHEAD:
Most training is invisible. Ours is undeniable.

See the difference in their balance. Feel the difference in their
first step. Watch the "wobbly ankles" turn into "iron foundation."

TESTIMONIAL:
"I used to hold my breath every time she jumped. Now, she lands like
a cat. YP gave us our confidence back." — Sarah J., Basketball Mom
```

**Acceptance Criteria:**
- [ ] Slider drag feels "heavy" with resistance
- [ ] Labels dynamically update opacity
- [ ] Works on touch devices

---

### E14-7: Community Section ("The Pack")
**Priority:** P1
**Estimate:** 3 points
**Description:**
UGC collage with global connection visualization.

**Visual Spec:**
- Grid/collage of user-generated content
- Kids training in driveways, garages, living rooms
- Subtle Wolf Cyan world map connecting dots globally

**Midjourney Prompt:**
```
collage of gritty black and white photos of diverse youth athletes
training in garages and driveways, authentic, sweaty, determined,
candid photography style --ar 16:9
```

**Copy:**
```
HEADLINE: JOIN THE PACK.

BODY:
Talent is common. Consistency is rare.

YP is more than an app. It is a global tribe of young athletes who
have decided to stop waiting for a miracle and start doing the work.

We don't sell shortcuts. We sell the unfair advantage of discipline.
```

**Acceptance Criteria:**
- [ ] UGC grid displays authentically
- [ ] Map dots have subtle animation
- [ ] Mobile-responsive layout

---

### E14-8: Footer CTA ("The Grand Slam Offer")
**Priority:** P0
**Estimate:** 2 points
**Description:**
Clean conversion section with glowing offer box.

**Visual Spec:**
- Simple, clean layout
- Offer box with glowing Cyan border

**Copy:**
```
HEADLINE: READY TO LOCK IN?

OFFER STACK:
✅ Bulletproof Ankles Protocol (Value: $97)
✅ Athlete Identity Quiz (Value: Priceless)
✅ 7-Day Barefoot Reset

PRICE: FREE TO START.
CTA: [ GET THE 7-DAY RESET ]
SUBTEXT: No credit card required for the Lead Magnet.
```

**Acceptance Criteria:**
- [ ] Offer box has animated glow border
- [ ] CTA has sheen hover effect
- [ ] Clear value stack presentation

---

### E14-9: Premium UX Polish
**Priority:** P2
**Estimate:** 5 points
**Description:**
Implement the "invisible" details that make it feel Apple-level.

**Tasks:**
- [ ] **Cursor Glow Follower:** 600px blurred Cyan orb follows cursor with 1s lag
- [ ] **NavBar Behavior:**
  - Scroll down: Navbar hides
  - Scroll up: Navbar slides in
  - Background: `backdrop-filter: blur(12px)` frosted glass
- [ ] **Typography Polish:**
  - Headlines: `letter-spacing: -0.02em`
  - All text: antialiased rendering
- [ ] **Color Banding Fix:** Film grain prevents gradient banding

**Acceptance Criteria:**
- [ ] Cursor glow creates dynamic lighting effect
- [ ] Navbar behavior is smooth and predictable
- [ ] No visible color banding on gradients

---

### E14-10: Mobile Optimization
**Priority:** P1
**Estimate:** 5 points
**Description:**
Ensure all sections work beautifully on mobile.

**Tasks:**
- [ ] Hero: Scale typography for mobile (60px headlines)
- [ ] Agitation: Touch-friendly scrollytelling
- [ ] Phone Explode: Simplify to 2D parallax on mobile
- [ ] Slider: Touch drag with momentum
- [ ] Navbar: Hamburger menu with smooth open/close

**Acceptance Criteria:**
- [ ] All animations performant at 60fps on mobile
- [ ] Touch interactions feel native
- [ ] No horizontal scroll issues

---

## E14 Summary

| Ticket | Title | Priority | Points | Status |
|--------|-------|----------|--------|--------|
| E14-1 | Foundation Setup (Lenis + Motion) | P0 | 3 | ✓ DONE |
| E14-2 | Hero Section | P0 | 5 | ✓ DONE |
| E14-3 | Agitation Section (Scrollytelling) | P0 | 5 | ✓ DONE |
| E14-4 | Solution Section (Exploded Phone) | P0 | 8 | ✓ DONE |
| E14-5 | Authority Section (Living Portraits) | P1 | 5 | ✓ DONE |
| E14-6 | Results Section (Comparison Slider) | P1 | 5 | ✓ DONE |
| E14-7 | Community Section (The Pack) | P1 | 3 | ✓ DONE |
| E14-8 | Footer CTA (Grand Slam Offer) | P0 | 2 | ✓ DONE |
| E14-9 | Premium UX Polish | P2 | 5 | ✓ DONE |
| E14-10 | Mobile Optimization | P1 | 5 | In Progress |

**Completed:** 9/10 tickets (41 points)
**Remaining:** Mobile optimization polish
**Grand Total:** 46 points (10 tickets)

---

## Technical Implementation Notes

### Required Dependencies
```bash
npm install @studio-freight/react-lenis framer-motion
```

### File Structure
```
src/
├── pages/
│   └── WolfGrow.jsx          # Main landing page
├── components/
│   └── wolf-grow/
│       ├── Hero.jsx          # E14-2
│       ├── Agitation.jsx     # E14-3
│       ├── Solution.jsx      # E14-4
│       ├── Authority.jsx     # E14-5
│       ├── Results.jsx       # E14-6
│       ├── Community.jsx     # E14-7
│       ├── FooterCTA.jsx     # E14-8
│       ├── CursorGlow.jsx    # E14-9
│       └── index.js          # Barrel export
├── hooks/
│   └── useScrollProgress.js  # Scroll-linked animations
└── styles/
    └── wolf-grow.css         # Film grain, custom animations
```

### Hero Component Reference
```tsx
'use client'
import { motion } from 'framer-motion'

export const Hero = () => {
  const ease = [0.25, 1, 0.5, 1];

  return (
    <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-[#050505]">

      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/20 blur-[120px] rounded-full" />

      <div className="z-10 text-center flex flex-col items-center">

        {/* Masked Text Reveal */}
        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: ease, delay: 0.2 }}
            className="text-[120px] font-bebas leading-[0.9] text-white"
          >
            THE PRO ACADEMY
          </motion.h1>
        </div>

        <div className="overflow-hidden">
          <motion.h1
            initial={{ y: "100%" }}
            animate={{ y: "0%" }}
            transition={{ duration: 1, ease: ease, delay: 0.3 }}
            className="text-[120px] font-bebas leading-[0.9] text-white"
          >
            IN YOUR POCKET<span className="text-cyan-400">.</span>
          </motion.h1>
        </div>

        {/* Fade Up Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: ease, delay: 0.6 }}
          className="mt-6 text-xl text-gray-300 max-w-lg font-light"
        >
          Elite training, democratized. Master the 15-minute daily habits used by pros.
        </motion.p>

        {/* The Button with Sheen */}
        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-10 px-8 py-4 bg-cyan-400 text-black font-bold rounded-full relative overflow-hidden group"
        >
          <span className="relative z-10">START THE 7-DAY RESET</span>
          <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500 skew-x-12" />
        </motion.button>

      </div>
    </section>
  )
}
```
