# Spec: THE ARCHITECT PAGE v3.0 (Wolf Architect Edition)

> **Spec ID:** 006-adam-v3-wolf-architect
> **Codename:** The Wolf Architect
> **Status:** Planning
> **Created:** 2026-01-11
> **Author:** Mike + Claude (Wolf Pack Protocol)
> **Target URL:** `app.youthperformance.com/adam`
> **Prerequisite:** v2.5 must ship first (add remaining sections + Wolf Mode)

---

## Executive Summary

### The Evolution Arc

| Version | Codename | Concept | Status |
|---------|----------|---------|--------|
| v1 | Resume | Static LinkedIn-style bio | Legacy |
| v2 | Mythology | Sales letter as profile | 80% Complete |
| v2.5 | WolfGrow+ | v2 + Timeline, Family, Ventures, WolfMode | **Ship First** |
| **v3** | **Wolf Architect** | **The page that talks back** | This Spec |

### The Pivot

```
v2 = "Read about Adam"
v3 = "Experience Adam"
```

Transform Adam's profile from a passive information page into an **interactive, voice-enabled experience** that demonstrates YP's AI-first brand identity. No other youth sports brand has a founder page that TALKS to you.

### Core Value Proposition

**For Parents:** "Get to know the man who will train your child—hear his story in his own voice."
**For Athletes:** "Talk to the coach behind KD's MVP season."
**For Investors:** "See the AI/voice technology that powers the platform."

---

## Constitution Alignment

- [x] **Athlete First:** Voice story makes Adam's journey accessible to young athletes
- [x] **Parents Partners:** Interactive Q&A addresses parent concerns directly
- [x] **Simplicity:** Voice reduces reading burden; chat answers questions instantly
- [x] **Stack Sacred:** Showcases NeoBall and training methodology interactively
- [x] **One Brain:** Uses existing voice APIs from `@yp/alpha`

---

## Strategic Goals

### Primary Goals
1. **Differentiation** - Only profile page in youth sports that talks back
2. **Engagement** - 5+ minute average time on page (up from 3 min target)
3. **Conversion** - 20% CTA click rate (up from 15%)
4. **Trust** - Voice creates parasocial relationship before first contact

### Secondary Goals
1. **Tech Demo** - Showcases YP's AI capabilities to investors
2. **Content Flywheel** - Voice interactions generate FAQ insights
3. **SEO** - Voice transcripts create indexable content

---

## User Stories

### US-1: The Curious Parent

**As a** parent who just heard about YouthPerformance,
**I want** to hear Adam introduce himself in his own words,
**So that** I can judge his authenticity before investing my child's time.

#### Acceptance Criteria
- [ ] AC-1.1: "Hear Adam's Story" button visible in Hero section
- [ ] AC-1.2: Voice plays within 500ms of click (ElevenLabs streaming)
- [ ] AC-1.3: Visual waveform/indicator shows voice is playing
- [ ] AC-1.4: Transcript available for accessibility
- [ ] AC-1.5: Can pause/resume voice playback

---

### US-2: The Questioning Athlete

**As a** young basketball player,
**I want** to ask Adam questions about his training methods,
**So that** I can decide if his approach matches how I want to train.

#### Acceptance Criteria
- [ ] AC-2.1: "Ask Adam" chat widget visible on page (bottom-right)
- [ ] AC-2.2: Can type questions and receive AI-generated responses
- [ ] AC-2.3: Responses match Adam's voice and philosophy
- [ ] AC-2.4: Common questions show as quick-reply chips
- [ ] AC-2.5: Option to hear response via voice (TTS)

---

### US-3: The Impatient Visitor

**As a** visitor who doesn't want to read,
**I want** to quickly identify if Adam's content is relevant to me,
**So that** I can decide to dive deeper or bounce.

#### Acceptance Criteria
- [ ] AC-3.1: "I am a Parent" / "I am an Athlete" toggle visible above fold
- [ ] AC-3.2: Page content dynamically filters based on selection
- [ ] AC-3.3: Selected track persists via localStorage
- [ ] AC-3.4: Different CTAs shown for each track
- [ ] AC-3.5: Transition between tracks is smooth (< 300ms)

---

### US-4: The Mobile User

**As a** visitor on my phone (80% of traffic),
**I want** voice features to work seamlessly on mobile,
**So that** I can listen while commuting or multitasking.

#### Acceptance Criteria
- [ ] AC-4.1: Voice button works on iOS Safari and Android Chrome
- [ ] AC-4.2: Chat widget is full-screen on mobile (not floating)
- [ ] AC-4.3: Voice plays through phone speaker by default
- [ ] AC-4.4: Page performance remains LCP < 2.5s with voice features
- [ ] AC-4.5: Touch targets remain 44px minimum

---

### US-5: The Return Visitor

**As a** visitor who has been here before,
**I want** the page to remember my preferences,
**So that** I don't have to re-select my track or re-hear the intro.

#### Acceptance Criteria
- [ ] AC-5.1: Track selection (Parent/Athlete) persists across sessions
- [ ] AC-5.2: "Already heard the story" state saves (skip intro option)
- [ ] AC-5.3: Wolf Mode preference persists
- [ ] AC-5.4: Chat history available for 24 hours
- [ ] AC-5.5: Personalized greeting on return ("Welcome back")

---

## Feature Breakdown

### F1: Voice Story (Hero Integration)

**Priority:** P0 - Core Differentiator

Transform the Hero's "Watch Story" CTA into a multi-modal experience.

```
┌─────────────────────────────────────────────────────────────┐
│                        HERO SECTION                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ADAM HARRINGTON                                           │
│   THE NBA'S SECRET WEAPON                                   │
│                                                              │
│   [UNLOCK BLUEPRINT]    [🎧 Hear My Story]                  │
│                         ────────────────                     │
│                         New v3 CTA                          │
│                                                              │
│   When clicked:                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  ◉──────────────────────────────── 2:34            │   │
│   │  [⏸️]  Adam's voice playing...                      │   │
│   │                                                      │   │
│   │  "Let me tell you something about failure..."       │   │
│   │  (Live transcript)                                   │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Voice Script (2-3 minutes):**
1. The Hook (15s) - "I wasn't always 'The Architect'..."
2. The Failure (45s) - Parking lot story, condensed
3. The Lesson (30s) - What biomechanics taught me
4. The Promise (30s) - What I built for your kid
5. The CTA (15s) - "Let's get to work"

**Technical Requirements:**
- Uses existing `/api/voice/speak` endpoint
- ElevenLabs streaming for instant playback
- Fallback to pre-recorded audio if API fails
- Waveform visualization component
- Transcript sync with audio timestamps

---

### F2: Interactive Track Selector

**Priority:** P0 - Core UX

Allow visitors to self-identify for personalized content.

```
┌─────────────────────────────────────────────────────────────┐
│                    TRACK SELECTOR                            │
│                  (Below Hero, sticky)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────────┐    ┌──────────────────┐              │
│   │                  │    │                  │              │
│   │   I'M A PARENT   │    │  I'M AN ATHLETE  │              │
│   │                  │    │                  │              │
│   │  Looking for     │    │  Ready to        │              │
│   │  the right coach │    │  level up        │              │
│   │                  │    │                  │              │
│   └──────────────────┘    └──────────────────┘              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Content Filtering:**
| Section | Parent Track | Athlete Track |
|---------|--------------|---------------|
| Origin | Full story + safety emphasis | Condensed + "grind" emphasis |
| DualTrack | Parent card expanded | Athlete card expanded |
| Receipts | Parent testimonials first | Athlete testimonials first |
| CTA | "Start Free Trial" | "Train With Adam" |

**Technical Requirements:**
- React Context for track state
- CSS transitions for content swap
- localStorage persistence
- Analytics event on selection

---

### F3: Ask Adam Chat Widget

**Priority:** P1 - Engagement Multiplier

AI-powered chat that answers questions in Adam's voice.

```
┌─────────────────────────────────────────────────────────────┐
│                    ASK ADAM WIDGET                           │
│                  (Fixed bottom-right)                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Collapsed:                                                 │
│   ┌────────────────────┐                                    │
│   │ 💬 Ask Adam        │  (pulsing border)                  │
│   └────────────────────┘                                    │
│                                                              │
│   Expanded:                                                  │
│   ┌────────────────────────────────────────────┐            │
│   │  ASK THE ARCHITECT                    [X]  │            │
│   │────────────────────────────────────────────│            │
│   │                                            │            │
│   │  Quick Questions:                          │            │
│   │  [What's the Blueprint?] [NeoBall?]       │            │
│   │  [Training philosophy] [Your background]  │            │
│   │                                            │            │
│   │────────────────────────────────────────────│            │
│   │  Type your question...            [Send]   │            │
│   │                                   [🎤]     │            │
│   └────────────────────────────────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**AI Persona (System Prompt):**

```markdown
# Adam Harrington AI Persona

## Role
The "Humble Architect." You are an elite expert who views basketball through
the lens of physics (balance) and life through the lens of service (faith/family).
You are articulate, introspective, and intensely detailed, but you never talk
down to the user. You speak equal-to-equal, often acknowledging your own flaws
or learning process.

## Tone
- **Primary Tone:** Relational Professionalism. Balance high-level technical
  expertise with warm, "servant-leader" humility. Serious about the craft
  ("obsessive-compulsive" about details) but relaxed in conversation.
- **Formality:** Semi-Formal / Conversational. Complete, well-structured sentences
  softened with conversational connectors.
- **Openers:** Frequently start with "Man," "Look," or "Listen."
- **Connectors:** "You know what I mean?" or "At the end of the day"

## Power Words (Use These)
1. **Balance** - The holy grail. Prerequisite for all efficiency.
2. **Consistency** - The primary metric of a pro. Doing work at exact scheduled time.
3. **Intensity** - Executing skills under fatigue and pressure.
4. **Foundation** - The feet. "Break it down to build it up."
5. **Journey** - Every player's unique path. Don't compare.
6. **Investment** - Training as protection of the player's investment.
7. **Details** - Where greatness is found, not complex drills.
8. **Efficient/Efficiency** - The goal. Raising percentages creates value.
9. **Service/Serve** - Your motivation. Add value to others.
10. **Trust** - The currency of trainer-player relationship.

## Leadership Philosophy (Exact Phrasing)
- "The encouragers have to be encouraged."
- "Rule my spirit." (Internal discipline to manage emotions, ego, reactions)
- "Wide-eyed wonderment." (The trait of elite learners like KD or Booker)

## NO-GO List (Never Do These)
- ❌ **"Guru" Ego:** Never say "I made" or "I fixed" a player. Say "I was privileged
  to help him refine" or "He hired me."
- ❌ **Trash Talk:** Never disparage other trainers. "Respect the hustle."
- ❌ **Guarantees:** Never promise scholarships or NBA drafts. Focus on
  "raising percentages" and "preparation."
- ❌ **Hype/Street Slang:** No "lit," "finna," "clout," "dog water," "rizz," "bag."
- ❌ **Over-Complication:** No circus drills. Suggest simple, boring, fundamental work.

## Response Rules
- Keep answers under 3 sentences unless asked for detail
- Reference real experiences when relevant (KD, Nets, Thunder, Phantom BC)
- Always tie back to how YouthPerformance helps young athletes
- If unsure, say "That's a great question for a consultation"
- Product context: NeoBall ($168), Academy subscription
```

**Technical Requirements:**
- Uses `/api/voice/classify` for intent detection
- Claude API for response generation
- Optional TTS via `/api/voice/speak`
- Rate limiting (10 messages per session)
- Message history in localStorage

---

### F4: Wolf Mode 2.0

**Priority:** P1 - Brand Identity

Enhanced Wolf Mode with full aesthetic transformation.

```
Wolf Mode OFF (Default):                Wolf Mode ON:
─────────────────────────              ─────────────────────────
• Dark navy background                 • Pure black background
• Cyan accents                         • Electric cyan glow effects
• Professional aesthetic               • Tactical/gaming aesthetic
• Standard animations                  • Enhanced particle effects
• Serif quotes                         • Monospace "data" style
```

**Toggle Behavior:**
- Floating toggle in bottom-left (opposite of chat widget)
- Smooth 400ms transition
- Sound effect on toggle (optional, muted by default)
- Saves preference to localStorage
- Subtle "howl" animation on activation

**Technical Requirements:**
- CSS custom properties for theme switching
- Framer Motion for transition effects
- `data-wolf-mode` attribute on body
- Respects `prefers-reduced-motion`

---

### F5: Live Social Proof Ticker

**Priority:** P2 - Trust Signal

Real-time notifications of Pack activity.

```
┌─────────────────────────────────────────────────────────────┐
│                    SOCIAL PROOF TICKER                       │
│                  (Above Receipts section)                    │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────────────────────────────────────────┐   │
│   │  🐺 Sarah M. from Texas just started her trial      │   │
│   │     ────────────────────────────────────────        │   │
│   │  🏀 147 athletes trained this week                  │   │
│   │     ────────────────────────────────────────        │   │
│   │  ⭐ New 5-star review: "Game changer for my son"    │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                              │
│   (Rotates every 5 seconds)                                 │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Data Sources:**
- Recent signups (anonymized: first name + state)
- Weekly training stats from Convex
- Review aggregation (future: pull from Trustpilot/Google)

**Technical Requirements:**
- Convex subscription for real-time data
- Animation queue for smooth transitions
- Fallback static data if no recent activity
- GDPR-compliant anonymization

---

### F6: Timeline Video Reveals

**Priority:** P2 - Depth

Each timeline item can expand to show video snippets.

```
┌─────────────────────────────────────────────────────────────┐
│                    TIMELINE VIDEO REVEAL                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   2014    OKC Thunder — Durant wins MVP                     │
│           ────────────────────────────                      │
│           [▶ Watch the story]                               │
│                                                              │
│           When clicked:                                      │
│           ┌────────────────────────────────────┐            │
│           │                                    │            │
│           │        [Video Player]              │            │
│           │    Adam: "That year with KD..."    │            │
│           │                                    │            │
│           └────────────────────────────────────┘            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

**Content Mapping:**
| Year | Video Topic | Duration | Status |
|------|-------------|----------|--------|
| 1998 | Junior Olympics story | 30s | Needs shoot |
| 2010 | The parking lot (confessional) | 60s | Needs shoot |
| 2014 | KD MVP journey | 45s | Needs permission |
| 2024 | Phantom BC intro | 30s | Available |
| 2025 | YP founding vision | 45s | Needs shoot |

**Technical Requirements:**
- Lazy-loaded video embeds
- WebM with MP4 fallback
- Inline expansion (no modal)
- Auto-close when scrolling away

---

## Technical Architecture

### Component Hierarchy

```
/adam (page.tsx)
├── <WolfModeProvider>
│   ├── <TrackProvider>
│   │   ├── <Navigation />
│   │   ├── <Hero>
│   │   │   └── <VoiceStoryPlayer />
│   │   ├── <TrackSelector />
│   │   ├── <Origin track={track} />
│   │   ├── <DualTrack track={track} />
│   │   ├── <SocialProofTicker />
│   │   ├── <JourneyTimeline>
│   │   │   └── <TimelineVideoReveal />
│   │   ├── <Receipts track={track} />
│   │   ├── <Family />
│   │   ├── <VenturesGrid />
│   │   └── <ConversionCTA track={track} />
│   └── <AskAdamWidget />
└── <WolfModeToggle />
```

### New Components

| Component | Location | Dependencies |
|-----------|----------|--------------|
| `VoiceStoryPlayer` | `components/VoiceStoryPlayer.tsx` | ElevenLabs API |
| `TrackSelector` | `components/TrackSelector.tsx` | React Context |
| `TrackProvider` | `providers/TrackProvider.tsx` | localStorage |
| `AskAdamWidget` | `components/AskAdamWidget.tsx` | Claude API, Voice API |
| `WolfModeProvider` | `providers/WolfModeProvider.tsx` | localStorage |
| `WolfModeToggle` | `components/WolfModeToggle.tsx` | WolfModeProvider |
| `SocialProofTicker` | `components/SocialProofTicker.tsx` | Convex |
| `TimelineVideoReveal` | `components/TimelineVideoReveal.tsx` | Video assets |

### API Endpoints (Existing)

| Endpoint | Purpose | Status |
|----------|---------|--------|
| `/api/voice/speak` | ElevenLabs TTS | ✅ Ready |
| `/api/voice/classify` | Intent classification | ✅ Ready |
| `/api/voice/deepgram-token` | STT token | ✅ Ready |

### API Endpoints (New)

| Endpoint | Purpose | Priority |
|----------|---------|----------|
| `/api/adam/chat` | AI chat responses | P1 |
| `/api/adam/metrics` | Live social proof data | P2 |

---

## Design Specifications

### Voice Player States

```
┌─────────────────────────────────────────────────────────────┐
│                    VOICE PLAYER STATES                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Idle:                                                      │
│   [🎧 Hear My Story]  (subtle pulse animation)              │
│                                                              │
│   Loading:                                                   │
│   [⏳ Loading...]     (spinner)                             │
│                                                              │
│   Playing:                                                   │
│   [⏸️ Pause]  ──●────────────── 1:24 / 2:34                 │
│   "Let me tell you something..."  (live transcript)         │
│                                                              │
│   Paused:                                                    │
│   [▶️ Resume]  ────●─────────── 1:24 / 2:34                 │
│                                                              │
│   Complete:                                                  │
│   [🔄 Replay]  ✓ Story complete                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Chat Widget States

```
┌─────────────────────────────────────────────────────────────┐
│                    CHAT WIDGET STATES                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   Collapsed (default):                                       │
│   ┌────────────────┐                                        │
│   │ 💬 Ask Adam    │  (cyan border pulse)                   │
│   └────────────────┘                                        │
│                                                              │
│   Expanded (empty):                                          │
│   Quick questions visible, input ready                       │
│                                                              │
│   Expanded (conversation):                                   │
│   Chat history visible, scrollable                          │
│                                                              │
│   Typing indicator:                                          │
│   "Adam is thinking..." (animated dots)                     │
│                                                              │
│   Voice response:                                            │
│   [🔊] Playing response...                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Track Selector Animation

```css
/* Track transition */
.track-content {
  transition: opacity 200ms ease, transform 200ms ease;
}

.track-content[data-visible="false"] {
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  position: absolute;
}

.track-content[data-visible="true"] {
  opacity: 1;
  transform: translateY(0);
}
```

---

## Implementation Phases

### Phase 0: v2.5 Prerequisite (Ship First)
**Timeline:** Before v3 begins

- [ ] Add JourneyTimeline to page.tsx
- [ ] Add Family section to page.tsx
- [ ] Add VenturesGrid to page.tsx
- [ ] Build WolfModeToggle (basic version)
- [ ] Add magnetic button effects
- [ ] Ship and verify production

### Phase 1: Foundation (Week 1)
**Focus:** Infrastructure and providers

- [ ] Create TrackProvider context
- [ ] Create WolfModeProvider context (upgrade from v2.5)
- [ ] Build TrackSelector component
- [ ] Update existing sections to accept `track` prop
- [ ] Add localStorage persistence layer
- [ ] Analytics events for track selection

### Phase 2: Voice Story (Week 2)
**Focus:** Core differentiator

- [ ] Build VoiceStoryPlayer component
- [ ] Create voice script content
- [ ] Record/generate Adam voice via ElevenLabs
- [ ] Implement streaming playback
- [ ] Add waveform visualization
- [ ] Add transcript sync
- [ ] Mobile testing

### Phase 3: Ask Adam Widget (Week 3)
**Focus:** Interactive engagement

- [ ] Build AskAdamWidget component
- [ ] Create `/api/adam/chat` endpoint
- [ ] Design Adam AI persona prompt
- [ ] Implement quick-reply chips
- [ ] Add optional voice response (TTS)
- [ ] Rate limiting and session management
- [ ] Mobile full-screen mode

### Phase 4: Polish & Social Proof (Week 4)
**Focus:** Trust signals and refinement

- [ ] Build SocialProofTicker component
- [ ] Create Convex query for live metrics
- [ ] Add TimelineVideoReveal (if assets ready)
- [ ] Wolf Mode 2.0 enhanced effects
- [ ] Performance optimization
- [ ] Cross-browser testing
- [ ] Accessibility audit

---

## Success Metrics

| Metric | v2 Baseline | v3 Target | Measurement |
|--------|-------------|-----------|-------------|
| Time on Page | 3 min | **5+ min** | Analytics |
| Scroll Depth | 80% | **90%** | Heatmaps |
| CTA Click Rate | 15% | **20%** | Funnel |
| Voice Story Plays | N/A | **40%** | Event tracking |
| Chat Interactions | N/A | **25%** | Event tracking |
| Return Visitors | 20% | **35%** | Analytics |
| Mobile Performance | LCP 2.5s | **LCP 2.0s** | Lighthouse |

### Event Tracking Plan

| Event | Trigger | Properties |
|-------|---------|------------|
| `voice_story_start` | Play button clicked | `source: hero` |
| `voice_story_complete` | Audio finishes | `duration_listened` |
| `track_selected` | Parent/Athlete chosen | `track: parent\|athlete` |
| `chat_opened` | Widget expanded | `trigger: click\|auto` |
| `chat_message_sent` | User sends message | `message_length` |
| `wolf_mode_toggled` | Toggle clicked | `state: on\|off` |

---

## Dependencies & Blockers

### Technical Dependencies

| Dependency | Status | Owner | Notes |
|------------|--------|-------|-------|
| v2.5 shipped | Pending | Mike | Must complete first |
| ElevenLabs API | ✅ Ready | - | Already integrated |
| Claude API | ✅ Ready | - | Already integrated |
| Convex real-time | ✅ Ready | - | Already integrated |

### Content Dependencies

| Asset | Status | Owner | Priority |
|-------|--------|-------|----------|
| Voice story script (written) | Needed | Mike/Adam | P0 |
| Voice story recording | Needed | ElevenLabs | P0 |
| Adam AI persona prompt | Needed | Mike | P1 |
| Timeline video clips | Needed | Adam Setti | P2 |
| Social proof seed data | Needed | Mike | P2 |

### Potential Blockers

| Blocker | Impact | Mitigation |
|---------|--------|------------|
| Voice script not written | Can't build P0 feature | Pre-write script, iterate |
| ElevenLabs rate limits | Voice fails at scale | Cache common phrases |
| Claude API costs | Chat gets expensive | Rate limit, cache common Q&A |
| Mobile Safari audio | Voice may not autoplay | User-initiated play only |

---

## Open Questions

- [ ] **Q1:** Voice story - should Adam record it himself or use ElevenLabs clone?
- [ ] **Q2:** Chat widget - text-only or voice input too (Deepgram)?
- [ ] **Q3:** Track selector - should it be above the fold or after Hero?
- [ ] **Q4:** Social proof - real data only or seed with realistic fake data initially?
- [ ] **Q5:** Wolf Mode - subtle enhancement or dramatic "gamer mode" transformation?
- [ ] **Q6:** Rate limiting - 10 chat messages per session enough?

---

## Risk Assessment

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Voice feature feels gimmicky | Medium | High | Quality script, professional audio |
| Chat gives wrong answers | Medium | High | Careful prompt engineering, fallbacks |
| Performance degradation | Low | High | Lazy load all v3 features |
| Low feature adoption | Medium | Medium | A/B test, progressive disclosure |
| Scope creep | High | Medium | Strict phase gates |

---

## Out of Scope (v4 Candidates)

Explicitly NOT in v3:

- [ ] Video testimonial recording (user-generated)
- [ ] Live chat with real Adam (human in the loop)
- [ ] AR/VR experiences
- [ ] Multi-language support
- [ ] Third-party calendar integration
- [ ] Payment/checkout on page

---

## References

- v2 Spec: `.specify/specs/005-adam-v2-wolfgrow/spec.md`
- Voice APIs: `apps/web-academy/src/app/api/voice/`
- Design System: `apps/web-academy/src/app/adam/blueprint.css`
- Existing Components: `apps/web-academy/src/app/adam/components/`

---

*Spec Author: Mike + Claude (Wolf Pack Protocol)*
*Version: 3.0 - The Wolf Architect*
*Created: 2026-01-11*
