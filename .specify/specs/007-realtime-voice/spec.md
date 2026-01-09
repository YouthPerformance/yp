# Feature Specification: OpenAI Realtime Voice Onboarding

**Version:** 1.0.0
**Created:** 2026-01-09
**Status:** Draft
**Spec ID:** 007-realtime-voice
**Depends On:** 002-wolf-pack-onboarding

---

## Overview

Replace the current modular voice pipeline (Deepgram STT + Groq Classification + ElevenLabs TTS) with OpenAI's GPT-4o Realtime API for the Wolf Pack voice sorting onboarding. The Realtime API processes audio directly (Audio In → Model → Audio Out) instead of converting through text intermediaries.

**Why this matters:**
1. **3x faster latency:** ~300ms vs ~950ms end-to-end
2. **Emotional intelligence:** Detects tone, laughter, hesitation in voice (text pipelines lose this)
3. **Simpler architecture:** 1 API integration vs 3 separate services
4. **Natural conversation:** Server-side VAD handles turn-taking and interruptions

**Feature-flagged:** Both implementations will run in parallel for A/B testing before full migration.

---

## Constitution Alignment

- [x] **Athlete First:** Faster, more natural voice interaction improves onboarding experience
- [x] **Parents Partners:** Voice enables hands-free sorting for kids, parent can observe
- [x] **Simplicity:** Single API replaces 3-service pipeline
- [x] **Stack Sacred:** No change to sorting logic, only voice infrastructure

---

## User Stories

### Primary Users

- **Athletes (ages 8-14):** New users completing voice-based onboarding
- **System (Internal):** A/B testing framework to compare voice implementations

---

### US-1: Complete Voice Sorting via Realtime API

**As a** new athlete in the Realtime API cohort
**I want** to complete the Wolf Pack sorting via natural voice conversation
**So that** I get my Wolf Identity faster and with a more natural interaction

**Acceptance Criteria:**
- [ ] AC-1.1: Voice conversation completes the same 3-question sorting flow (Pain → Volume → Ambition)
- [ ] AC-1.2: Total conversation time is <45 seconds (matching current spec)
- [ ] AC-1.3: End-to-end latency (user stops speaking → AI starts responding) is <500ms
- [ ] AC-1.4: AI voice maintains Wolf persona throughout (direct, confident, no fluff)
- [ ] AC-1.5: Classification results match expected training path/identity assignments
- [ ] AC-1.6: Conversation handles natural speech patterns (hesitation, filler words, partial answers)

---

### US-2: Graceful Fallback to Buttons

**As an** athlete
**I want** button fallbacks available if voice doesn't work
**So that** I can still complete onboarding without a microphone

**Acceptance Criteria:**
- [ ] AC-2.1: If microphone permission denied, buttons appear immediately
- [ ] AC-2.2: If Realtime API connection fails, system falls back to current implementation
- [ ] AC-2.3: If voice input unclear after 2 attempts, buttons appear as alternative
- [ ] AC-2.4: User can tap a "Type instead" option at any point

---

### US-3: A/B Test Between Voice Implementations

**As a** product owner
**I want** to compare Realtime API vs current modular pipeline
**So that** I can make a data-driven decision on full migration

**Acceptance Criteria:**
- [ ] AC-3.1: Feature flag determines which voice implementation a user receives
- [ ] AC-3.2: Assignment is sticky (same user always gets same implementation)
- [ ] AC-3.3: Both cohorts use identical sorting logic and UI (only voice infra differs)
- [ ] AC-3.4: Metrics are tracked separately per cohort
- [ ] AC-3.5: Flag can be overridden for testing (query param or admin setting)

---

### US-4: Maintain Wolf Brand Voice

**As an** athlete
**I want** the AI voice to sound like an elite coach, not a generic assistant
**So that** the experience feels authentic to YouthPerformance brand

**Acceptance Criteria:**
- [ ] AC-4.1: AI uses YP terminology (drill not exercise, stack not workout, etc.)
- [ ] AC-4.2: AI speaks in short, direct sentences (<15 words per turn)
- [ ] AC-4.3: AI never uses soft/wellness language (sorry, maybe, take your time)
- [ ] AC-4.4: Voice selection fits Wolf persona (confident, male, coach energy)
- [ ] AC-4.5: Brand voice quality is subjectively equivalent to current ElevenLabs output

---

## Functional Requirements

### Core Requirements

| ID | Requirement | Priority | Verification |
|----|-------------|----------|--------------|
| FR-1 | Realtime API WebRTC connection from browser | Must Have | Connection established, audio streams |
| FR-2 | Server-side ephemeral token generation | Must Have | Browser never sees main API key |
| FR-3 | Wolf persona system instructions | Must Have | AI follows brand voice rules |
| FR-4 | Classification extraction via function calling | Must Have | Structured data returned |
| FR-5 | Feature flag integration | Must Have | Users assigned to cohorts |
| FR-6 | Metrics tracking per cohort | Must Have | Latency, completion, success rates |
| FR-7 | Microphone permission handling | Must Have | Graceful denial flow |
| FR-8 | Connection error recovery | Should Have | Retry or fallback on failure |
| FR-9 | Voice activity detection (VAD) | Should Have | Server-side turn-taking |

### Business Rules

| ID | Rule | Example |
|----|------|---------|
| BR-1 | Classification logic unchanged | Pain detection, volume detection, identity assignment identical to current |
| BR-2 | Sorting result schema unchanged | Same `wolfIdentity`, `trainingPath`, `coachComment` fields |
| BR-3 | Feature flag default is current implementation | New users get modular pipeline unless opted into Realtime |
| BR-4 | Cost tracking per conversation | Monitor actual spend vs projected |

---

## Non-Functional Requirements

| ID | Category | Requirement | Measurement |
|----|----------|-------------|-------------|
| NFR-1 | Performance | Response latency <500ms | Time from user speech end to AI speech start |
| NFR-2 | Performance | Connection setup <2 seconds | Time from initiation to first audio |
| NFR-3 | Reliability | 99% successful connections | Connection success rate |
| NFR-4 | Reliability | Graceful degradation on failure | Fallback to buttons within 3 seconds |
| NFR-5 | Cost | <$0.10 per onboarding session | Average cost per completion |
| NFR-6 | Compatibility | Works on Chrome, Safari, Firefox (mobile + desktop) | Browser test matrix |

---

## Data Requirements

### Entities

| Entity | Description | Key Attributes |
|--------|-------------|----------------|
| **Voice Session** | A single onboarding conversation | session_id, implementation (realtime/modular), start_time, end_time |
| **Voice Metrics** | Performance data per session | latency_avg_ms, turn_count, errors, cost_cents |
| **Feature Flag Assignment** | User cohort membership | user_id, cohort (realtime/modular), assigned_at |

### Data Rules

- Session metrics stored for A/B analysis (30-day retention minimum)
- Cost data aggregated daily for monitoring
- Feature flag assignments are persistent (no re-randomization)

---

## User Interface Requirements

### Key Interactions

1. **Permission Request:** System requests microphone access with explanation ("Wolf needs to hear you")
2. **Listening State:** Visual indicator when user should speak (pulsing mic icon)
3. **Speaking State:** Visual indicator when Wolf is talking (animated Wolf avatar)
4. **Fallback Trigger:** After 2 failed voice attempts, buttons slide in from bottom

### States

| State | Description | User Can... |
|-------|-------------|-------------|
| Connecting | WebRTC handshake in progress | Wait, see loading indicator |
| Listening | Wolf finished speaking, awaiting user | Speak into mic, tap button |
| Processing | User finished, AI generating response | Wait briefly |
| Speaking | Wolf audio playing | Listen, interrupt (optional) |
| Error | Connection or API failure | Retry or use buttons |

---

## Edge Cases & Error Handling

| Scenario | Expected Behavior |
|----------|-------------------|
| Microphone permission denied | Skip voice entirely, show button-only flow |
| WebRTC connection timeout | Retry once, then fall back to modular pipeline |
| Realtime API rate limit | Fall back to modular pipeline for this session |
| User speaks during AI response (barge-in) | AI stops speaking, processes new input |
| Background noise triggers false input | VAD threshold filters, no response to ambient noise |
| User silent for >10 seconds | Prompt "You still there?" or show buttons |
| User gives ambiguous answer | AI asks clarifying follow-up before routing |
| Session exceeds 2 minutes | Gracefully end with button fallback |
| Network disconnection mid-session | Attempt reconnect, preserve state, resume or fallback |

---

## Out of Scope

- **Voice persona customization:** Only one Wolf voice in v1 (no athlete-selectable voices)
- **Custom voice cloning:** Using OpenAI built-in voices only (no ElevenLabs voice porting)
- **Multi-language support:** English only in v1
- **Voice commands outside onboarding:** This spec covers sorting flow only
- **Offline voice:** Requires active internet connection
- **Voice authentication:** No voiceprint/identity verification

---

## Dependencies

### External Dependencies

| Dependency | Purpose | Risk |
|------------|---------|------|
| OpenAI Realtime API | Core voice processing | API availability, pricing changes |
| WebRTC browser support | Audio streaming | Browser compatibility |
| Microphone hardware | Audio input | User device limitations |

### Internal Dependencies

| Dependency | Purpose |
|------------|---------|
| 002-wolf-pack-onboarding | Sorting logic, classification rules |
| Feature flag system | A/B cohort assignment |
| Convex database | Metrics storage |

### Assumptions

- OpenAI Realtime API remains in GA with stable pricing
- User has working microphone and grants permission
- Network latency to OpenAI servers <100ms (typical US/EU)
- Sorting flow requirements from 002 spec remain unchanged

---

## Success Metrics

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| **Latency (P50)** | <400ms | Measure time from user speech end to AI speech start |
| **Latency (P95)** | <800ms | Same, 95th percentile |
| **Completion Rate** | ≥ current (baseline TBD) | % users who finish all 3 questions |
| **Classification Accuracy** | 100% match | Compare results to expected (same logic) |
| **User Satisfaction** | ≥ current (qualitative) | Post-onboarding survey |
| **Cost per Session** | <$0.10 | OpenAI usage + any fallback costs |
| **Error Rate** | <5% | Sessions with errors / total sessions |

### A/B Test Success Criteria

Migration to Realtime API proceeds if:
1. Completion rate ≥ current implementation
2. P50 latency ≤ 500ms
3. Cost per session ≤ $0.12 (acceptable premium for better UX)
4. Qualitative feedback is positive or neutral

---

## Clarifications Needed

> All clarifications resolved based on earlier discussion.

- ~~[NEEDS CLARIFICATION: Should the AI use voice or text for sorting?]~~ → **Voice with button fallback**
- ~~[NEEDS CLARIFICATION: Which OpenAI voice fits Wolf persona?]~~ → **"ash" or "ballad" - both confident male voices**
- ~~[NEEDS CLARIFICATION: Cost acceptable?]~~ → **Up to $0.12/session acceptable**

---

## Cost Analysis

### Current Pipeline (Modular)
| Service | Cost | Per Session |
|---------|------|-------------|
| Deepgram (STT) | $0.0043/min | ~$0.003 |
| Groq (LLM) | Free tier / $0.05/1M tokens | ~$0.001 |
| ElevenLabs (TTS) | $0.30/1K chars | ~$0.015 |
| **Total** | | **~$0.02/session** |

### Realtime API
| Component | Cost | Per Session |
|-----------|------|-------------|
| Audio Input | $0.06/min | ~$0.03 |
| Audio Output | $0.24/min | ~$0.06 |
| **Total** | | **~$0.09/session** |

**Delta:** +$0.07/session (+350%)
**Tradeoff:** 3x cost for 3x faster latency + emotional intelligence

---

## Implementation Notes

These notes capture technical constraints discovered during research. They inform but do not dictate the implementation plan.

### Voice Options (Built-in)
Best fits for Wolf persona: `ash` (confident male), `ballad` (expressive male), `coral` (warm, could work)

### Connection Method
WebRTC recommended for browser (vs WebSocket) - better latency, automatic reconnection

### Prompt Structure (OpenAI Cookbook)
```
1. Role & Objective
2. Personality & Tone
3. Banned Words / Brand Language
4. Conversation Flow (state machine)
5. Classification Rules
6. Response Style
```

### Function Calling for Classification
Define `classify_athlete` function to extract structured `{training_path, wolf_identity}` from conversation.

---

## Changelog

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-09 | Claude (MAI) | Initial specification |
