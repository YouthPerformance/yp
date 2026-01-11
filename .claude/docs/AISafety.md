# AI Safety & Youth Data Protection Compliance

> **YouthPerformance Position:** Category-defining pioneers in AI-powered youth athletic training.
> **Philosophy:** Parents as Architects. Transparency as Trust. Safety by Design.

**Last Updated:** 2026-01-10
**Compliance Deadline:** COPPA Amendments effective June 23, 2025 | Full compliance by April 22, 2026

---

## Executive Summary

YouthPerformance operates at the intersection of three regulatory domains:
1. **Children's Privacy** (COPPA, GDPR-K)
2. **AI Safety** (FTC AI Inquiry, State Laws, UNICEF Guidelines)
3. **Youth Sports Data** (Biometric protections, SafeSport)

This document establishes YouthPerformance as the **gold standard** for AI safety in youth sports—not just compliant, but setting the patterns the industry will follow.

---

## Table of Contents

1. [Regulatory Landscape 2025-2026](#regulatory-landscape-2025-2026)
2. [COPPA Compliance (US)](#coppa-compliance-us)
3. [GDPR-K Compliance (EU/UK)](#gdpr-k-compliance-euuk)
4. [AI-Specific Safety Requirements](#ai-specific-safety-requirements)
5. [Youth Sports Data Protections](#youth-sports-data-protections)
6. [YouthPerformance Safety Architecture](#youthperformance-safety-architecture)
7. [Parent-as-Architect Model](#parent-as-architect-model)
8. [Implementation Checklist](#implementation-checklist)
9. [Sources & References](#sources--references)

---

## Regulatory Landscape 2025-2026

### Timeline of Key Regulations

| Date | Regulation | Impact |
|------|------------|--------|
| Jan 16, 2025 | FTC finalizes COPPA amendments | New consent requirements |
| Apr 22, 2025 | COPPA amendments published in Federal Register | Clock starts |
| Jun 23, 2025 | COPPA amendments take effect | Must comply with new rules |
| Oct 22, 2025 | Safe Harbor transparency requirements | Program disclosures due |
| Jan 1, 2026 | California SB 243 (AI Companion Law) | Suicide prevention, break reminders |
| Apr 22, 2026 | Full COPPA compliance deadline | All systems must comply |
| Late 2026 | American Academy of Pediatrics AI Policy | Industry guidance expected |

### Regulatory Bodies to Monitor

| Region | Authority | Focus Area |
|--------|-----------|------------|
| US Federal | FTC | COPPA, AI Companion Inquiry |
| US States | CA, NY, TX | AI companion laws, biometric data |
| EU | Data Protection Authorities | GDPR-K, age verification |
| Global | UNICEF | AI for Children Guidelines v3.0 |
| Sports | NCAA, SafeSport | Athlete data governance |

---

## COPPA Compliance (US)

### What Is COPPA?

The Children's Online Privacy Protection Act (COPPA) requires websites and online services to obtain **verifiable parental consent** before collecting personal information from children under 13.

### 2025-2026 Amendments: What Changed

#### 1. Expanded Definition of Personal Information

Now includes:
- **Biometric identifiers** (voice prints, facial geometry)
- **Government-issued identifiers**
- **Precise geolocation data**

**YP Impact:** Voice interactions with Wolf must be treated as personal information collection.

#### 2. Third-Party Consent Separation

> "Operators must obtain **separate** verifiable parental consent to disclose children's personal information to third parties."

**YP Compliance:**
- No third-party data sharing for under-13
- If analytics tools process child data, separate consent required
- AI model training on child data requires explicit separate consent

#### 3. Data Retention Limits

> "Operators may not retain children's personal information for longer than necessary to fulfill the specific documented purposes."

**YP Compliance:**
- Voice data: Ephemeral processing only (no storage)
- Training data: Retained only for active enrollment period
- Must have written data retention policy

#### 4. Enhanced Security Requirements

> "Operators must establish, implement, and maintain a written information security program."

**YP Requirements:**
- Documented security policies
- Regular security assessments
- Incident response plan

### Verifiable Parental Consent Methods (FTC-Approved)

| Method | Description | YP Implementation |
|--------|-------------|-------------------|
| Credit Card Transaction | $0.50+ charge (refundable) | Primary method |
| Government ID Check | Verify parent identity | Secondary option |
| Video Conference | Live verification | Enterprise/team accounts |
| Knowledge-Based Auth | Questions only parent knows | Fallback method |
| Signed Consent Form | Physical or electronic | Enterprise/school accounts |

**Critical:** The credit card verification must be clearly marked. If it looks like a hidden subscription, conversion dies and trust is lost.

### COPPA Rights Parents Must Have

| Right | Description | YP Implementation |
|-------|-------------|-------------------|
| **Notice** | What data is collected, how it's used | Privacy dashboard |
| **Consent** | Opt-in before collection | Onboarding gate |
| **Access** | Review child's collected data | "Review Data" screen |
| **Delete** | Request data deletion | "Delete Data" button |
| **Revoke** | Withdraw consent at any time | Settings toggle |
| **Limit** | Consent to collection without third-party sharing | Separate toggles |

### COPPA Penalties

- **Up to $50,120 per violation** (2025 rate)
- FTC enforcement actions increasing
- Class action liability exposure

---

## GDPR-K Compliance (EU/UK)

### Age of Consent by Country

| Age | Countries |
|-----|-----------|
| 13 | UK, Spain, Czech Republic, Denmark, Ireland, Latvia, Poland, Sweden |
| 14 | Austria, Italy, Portugal |
| 15 | France, Greece |
| 16 | Germany, Hungary, Lithuania, Luxembourg, Netherlands, Slovakia |

**YP Global Strategy:** Default to 16 for EU users unless country-specific logic implemented.

### GDPR-K Requirements

| Requirement | Description | YP Implementation |
|-------------|-------------|-------------------|
| Privacy by Default | Children's accounts private by default | No public profiles for minors |
| Age Verification | Reliable, hard-to-bypass verification | Mobile network or payment verification |
| Transparent Data Use | Clear, age-appropriate explanations | Kid-friendly privacy notices |
| Algorithm Scrutiny | No exploitative recommendation systems | No engagement-maximizing loops |
| Parental Access | Full access and control | Parent dashboard |

### 2025 EU Changes

1. **Privacy by Default:** No open profiles, no public friend lists, no automatic location sharing
2. **Stricter Age Verification:** "How old are you?" no longer sufficient
3. **Ethical Treatment:** Children's data treated as "ethically charged"
4. **Algorithm Scrutiny:** Systems designed to reduce excessive screen time

### GDPR Penalties

- **Up to €20 million or 4% of global turnover** (whichever is higher)
- Individual DPA enforcement (CNIL, AEPD prioritizing child protection)

---

## AI-Specific Safety Requirements

### FTC AI Companion Inquiry (2025)

The FTC launched a Section 6(b) inquiry into AI chatbots acting as companions, specifically examining:
- Actions to mitigate harm to minors
- COPPA compliance of AI systems
- Psychological impact on children

**YP Position:** Proactively address all inquiry areas before enforcement.

### California SB 243 - AI Companion Law (Jan 1, 2026)

Applies to "companion chatbots" - AI systems with natural language interface providing adaptive, human-like social interactions.

**Requirements:**

| Requirement | Description | YP Implementation |
|-------------|-------------|-------------------|
| AI Disclosure | Disclose interaction is with AI | Wolf intro: "I'm Wolf, your AI training partner" |
| Break Reminders | Suggest breaks every 3 hours | Session time limits |
| Suicide Prevention | Detect and prevent suicidal ideation | Keyword detection → crisis resources |
| Self-Harm Detection | Systems to detect self-harm risk | Safety triggers → parent alert |
| Crisis Referral | Refer at-risk users to crisis services | National Suicide Prevention Lifeline integration |

### Federal GUARD Act (Proposed)

Senator Hawley's proposed legislation would:
- Prohibit AI companions for minors entirely
- Require strict age verification
- Criminal penalties for violations

**YP Strategy:** Position as "Training Tool" not "Companion" - Wolf is a coach, not a friend.

### UNICEF AI for Children Guidelines v3.0 (December 2025)

The gold standard for child-centered AI. 10 key requirements:

| # | Requirement | YP Implementation |
|---|-------------|-------------------|
| 1 | Ensure regulatory compliance | This document |
| 2 | Prevent AI-enabled crimes against children | Content moderation, CSAM prevention |
| 3 | Address chatbot/companion risks | Parent oversight, session limits |
| 4 | Protect in armed conflict/cyber ops | N/A for YP |
| 5 | Adopt privacy-by-design | Data minimization, ephemeral voice |
| 6 | Child rights-by-design | Age-appropriate UX, parent controls |
| 7 | Integrate well-being metrics | Frustration detection, sentiment tracking |
| 8 | Address environmental impacts | Efficient AI models |
| 9 | Support research on AI + children | Open to academic partnerships |
| 10 | Teacher/parent integration | Parent-as-Architect model |

**Key Insight from UNICEF:**
> "Children's mental models of trust, privacy, safety and truth differ markedly from those of adults, making them more vulnerable to manipulation, misinformation and emotional influence. AI governance must start with one principle: **children are not just small adults.**"

---

## Youth Sports Data Protections

### NCAA Guidelines (Influencing Youth Sports)

NCAA's 2025-2026 guidance on wearables and tracking applies pressure downstream to youth sports:

| Requirement | Description | YP Relevance |
|-------------|-------------|--------------|
| Data Management Plans | Document how athlete data is protected | Required for YP |
| Athlete Consent | Clear consent for data collection | Parent consent for minors |
| Data Minimization | Collect only what's necessary | Core principle |
| Secure Storage | Protected athlete information | Encryption, access controls |

### SafeSport Requirements (MAAPP 2025)

All youth sports organizations must adopt Minor Athlete Abuse Prevention Policies:

| Requirement | YP Implementation |
|-------------|-------------------|
| One-on-one interaction policies | AI interactions logged, parent-visible |
| Electronic communication policies | No private messaging capability |
| Transportation policies | N/A (digital only) |
| Reporting mechanisms | In-app reporting, parent alerts |

### Biometric Data Considerations

If YP ever collects biometric data (heart rate from wearables, movement tracking):

| State | Law | Requirement |
|-------|-----|-------------|
| Illinois | BIPA | Written consent, no sale of data |
| Texas | CUBI | Informed consent required |
| Washington | HB 1493 | Notice and consent |
| California | CCPA | Right to know, delete, opt-out |

**Current YP Position:** No biometric data collection. If added, requires full BIPA compliance.

---

## YouthPerformance Safety Architecture

### Data Classification

| Data Type | Sensitivity | Retention | Parent Access |
|-----------|-------------|-----------|---------------|
| Account info (email, name) | Standard | Account lifetime | Full access |
| Training progress | Standard | Enrollment period | Full access |
| Voice interactions | High | **Ephemeral only** | Session summaries |
| Personality data | High | Account lifetime | Full access, editable |
| AI conversation logs | High | 30 days rolling | Summaries only |
| Payment info | Critical | PCI-compliant vault | Masked display |

### Voice Data Policy: "Ghost Mode"

**This is a major selling point.** Parents trust us because:

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔇 GHOST MODE: Voice Data Policy                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ ✅ We DO:                                                       │
│    • Process voice in real-time for response generation        │
│    • Transcribe speech for context (ephemeral)                 │
│    • Detect keywords for safety triggers                       │
│                                                                 │
│ ❌ We NEVER:                                                    │
│    • Store voice recordings                                    │
│    • Create voice prints or biometric profiles                 │
│    • Train AI models on your child's voice                     │
│    • Share voice data with third parties                       │
│    • Use voice for advertising or profiling                    │
│                                                                 │
│ 📍 Technical Implementation:                                    │
│    Voice → STT (Deepgram) → Text → LLM → Response → Deleted    │
│    ↑                                                     ↑      │
│    └────────── Nothing stored between these points ──────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Safety Trigger System

| Trigger Category | Keywords/Patterns | Action |
|------------------|-------------------|--------|
| Self-harm | "hurt myself", "don't want to be here" | Immediate pause → crisis resources → parent alert |
| Bullying | "they hate me", "no friends", "picked on" | Empathy response → parent notification |
| Abuse indicators | "he hits me", "scared to go home" | Mandatory reporting protocol |
| Frustration (high) | Repeated failures, negative self-talk | Wolf pivots to recovery → parent notification |
| Excessive use | >3 hours continuous | Break reminder → session pause |

### Keyword Detection Implementation

```
Priority Levels:

🔴 CRITICAL (Immediate Action):
   - Self-harm, suicide ideation
   - Abuse disclosure
   - Immediate danger
   → Pause session → Crisis resources → Parent alert → Log for review

🟡 ELEVATED (Parent Notification):
   - Bullying mention
   - Extreme frustration
   - Repeated failure patterns
   → Continue session with pivot → Parent notification → Scouting Report flag

🟢 MONITOR (Internal Tracking):
   - Mild frustration
   - Fatigue indicators
   - Engagement drop
   → Wolf adapts behavior → Include in weekly Scouting Report
```

---

## Parent-as-Architect Model

### The Philosophy

> **"Parents don't fear AI they programmed themselves."**

Traditional Model:
```
Developer creates AI → Parent allows access → Kid uses AI → Parent worries
```

YouthPerformance Model:
```
Parent programs AI → Parent knows exactly how it works → Kid uses AI → Parent trusts
```

### The "Program The Wolf" Interface

Parents don't fill out a settings form. They **architect** their child's AI coach.

#### Personality Sliders

| Axis | Left Pole | Right Pole | System Prompt Variable |
|------|-----------|------------|------------------------|
| Tone | Drill Sergeant (0) | Supportive Big Bro (100) | `tone_intensity` |
| Energy | Calm & Steady (0) | High Hype (100) | `energy_level` |
| Verbosity | Few Words (0) | Chatty (100) | `response_length` |
| Push Style | Gentle Nudges (0) | Direct Call-Outs (100) | `accountability_style` |
| Humor | Serious (0) | Playful (100) | `humor_injection` |

#### Secret Weapon Questions

| Question | Maps To | Wolf Behavior |
|----------|---------|---------------|
| "What makes them quit?" | `frustration_trigger` | Detection → pivot strategy |
| "Who is their hero?" | `hero_metaphors[]` | Uses hero in motivation |
| "Your phrase to motivate them?" | `parent_catchphrase` | Wolf mirrors parent language |
| "What are they secretly proud of?" | `confidence_anchor` | References in encouragement |
| "How do they handle failure?" | `failure_response_style` | Calibrates Wolf reaction |

#### The IKEA Effect

> "Parents value the app more because they 'built' the personality."

Psychology research shows people value things they helped create 63% more than identical pre-made items. By making parents the architects, we:

1. Increase perceived value
2. Build trust through transparency
3. Create emotional investment
4. Reduce churn (they won't abandon what they built)

### Parent Controls & Oversight

#### Scouting Report (Weekly)

Not stats. **Sentiment.**

```
📋 SCOUTING REPORT: [CHILD NAME]
Week of January 6-12, 2026

🔥 STREAK: 5 days (personal best!)

💪 WINS THIS WEEK:
• Completed ankle mobility challenge (Wed)
• Showed great resilience after tough plyo session (Thu)
• Logged 3 perfect-form days in a row

⚡ WOLF OBSERVATIONS:
"[Name] struggled with the new balance drill on Tuesday. I detected
frustration after the third attempt and pivoted to hip mobility
instead. They finished the session strong. Resilience pattern:
improving."

📊 METRICS:
• Sessions completed: 5/5
• Avg session length: 18 min
• Frustration events: 2 (down from 4 last week)
• Resilience score: 78 (+12 from last week)

💡 PARENT ACTION:
"They crushed the ankle work this week. A high-five would go a
long way!"
```

#### Intervention Triggers (Parent-Configurable)

| Trigger | Default | Customizable |
|---------|---------|--------------|
| Frustration threshold | 3x/session | Yes (1-5) |
| Missed days alert | 2 consecutive | Yes (1-7) |
| Session length warning | 45 min | Yes (30-90) |
| Negative self-talk detection | On | Yes (On/Off) |
| Milestone celebrations | On | Yes (On/Off) |

#### Transparency Dashboard

```
┌─────────────────────────────────────────────────────────────────┐
│ 🔒 DATA TRANSPARENCY: [CHILD NAME]                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│ 📊 WHAT WE COLLECT:                                            │
│ ┌─────────────────────────────────────────────────────────────┐│
│ │ • Training completion & progress         [View Data]       ││
│ │ • Performance metrics (reps, time)       [View Data]       ││
│ │ • Interaction patterns                   [View Data]       ││
│ │ • Personality preferences (you set)      [Edit]            ││
│ └─────────────────────────────────────────────────────────────┘│
│                                                                 │
│ 🚫 WHAT WE NEVER DO:                                           │
│ • Store voice recordings                                       │
│ • Train AI on your child's data                               │
│ • Sell or share data with third parties                       │
│ • Use data for advertising                                    │
│ • Create behavioral profiles for external use                 │
│                                                                 │
│ 🎛️ YOUR CONTROLS:                                              │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐      │
│ │ Export Data    │ │ Delete Data    │ │ Revoke Consent │      │
│ └────────────────┘ └────────────────┘ └────────────────┘      │
│                                                                 │
│ Last data review: Never                                        │
│ [Review All Collected Data →]                                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Implementation Checklist

### Phase 1: COPPA Foundation (Required by Jun 23, 2025)

- [ ] Implement verifiable parental consent flow ($0.50 charge method)
- [ ] Create written data retention policy
- [ ] Build parent data access UI (review collected data)
- [ ] Build parent data deletion flow
- [ ] Separate consent toggle for third-party sharing
- [ ] Document security program in writing
- [ ] Age gate on signup (under 13 → parent flow)

### Phase 2: Enhanced Safety (Target: Q3 2025)

- [ ] Implement keyword safety detection system
- [ ] Build crisis resource integration
- [ ] Create parent alert notification system
- [ ] Implement session time limits and break reminders
- [ ] Add AI disclosure to Wolf introduction

### Phase 3: Parent-as-Architect (Target: Q4 2025)

- [ ] Build "Program The Wolf" slider interface
- [ ] Implement personality matrix → system prompt mapping
- [ ] Create weekly Scouting Report generation
- [ ] Build Transparency Dashboard
- [ ] Implement configurable intervention triggers

### Phase 4: Global Compliance (Target: Q1 2026)

- [ ] Implement country-specific age of consent logic
- [ ] Add EU-compliant age verification
- [ ] Create region-specific privacy notices
- [ ] GDPR data portability (export in machine-readable format)

### Phase 5: Continuous Improvement (Ongoing)

- [ ] Quarterly compliance audits
- [ ] Annual penetration testing
- [ ] Regular policy updates based on regulatory changes
- [ ] Parent feedback integration

---

## Sources & References

### COPPA & FTC
- [FTC COPPA Final Rule Amendments](https://www.ftc.gov/news-events/news/press-releases/2025/01/ftc-finalizes-changes-childrens-privacy-rule-limiting-companies-ability-monetize-kids-data)
- [Federal Register: COPPA Rule](https://www.federalregister.gov/documents/2025/04/22/2025-05904/childrens-online-privacy-protection-rule)
- [FTC COPPA FAQ](https://www.ftc.gov/business-guidance/resources/complying-coppa-frequently-asked-questions)
- [COPPA 2025 Practical Guide](https://blog.promise.legal/startup-central/coppa-compliance-in-2025-a-practical-guide-for-tech-edtech-and-kids-apps/)

### GDPR & EU
- [GDPR Article 8 - Child Consent](https://gdpr-info.eu/art-8-gdpr/)
- [EU Children's Data Privacy 2025 Changes](https://www.gdprregister.eu/gdpr/eu-childrens-data-privacy-2025-7-changes/)
- [European Commission - Children's Data Safeguards](https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations/legal-grounds-processing-data/are-there-any-specific-safeguards-data-about-children_en)

### AI Safety
- [OpenAI Teen Safety Blueprint](https://openai.com/index/introducing-the-teen-safety-blueprint/)
- [UNICEF Guidance on AI and Children v3.0](https://www.unicef.org/innocenti/reports/policy-guidance-ai-children)
- [California SB 243 - AI Companion Law](https://techcrunch.com/2025/12/19/openai-adds-new-teen-safety-rules-to-models-as-lawmakers-weigh-ai-standards-for-minors/)
- [State AI Legislation Tracker](https://www.ncsl.org/technology-and-communication/artificial-intelligence-2025-legislation)

### Youth Sports
- [NCAA Wearables Guidelines Impact](https://youthsportsbusinessreport.com/what-ncaas-new-wearables-and-tracking-guidelines-mean-for-youth-sports/)
- [SafeSport MAAPP Requirements](https://maapp.uscenterforsafesport.org/)
- [Athlete Data Sovereignty Research](https://www.frontiersin.org/journals/sports-and-active-living/articles/10.3389/fspor.2025.1742484/full)
- [Protecting Youth Sports Data](https://www.spond.com/en-us/news-and-blog/protecting-youth-sports-data/)

---

## Document Control

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0.0 | 2026-01-10 | MAI (Claude) | Initial comprehensive report |

---

*YouthPerformance: Setting the standard for AI safety in youth sports.*
