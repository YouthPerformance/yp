# Parent-First Onboarding System

> **Vision:** Parents are the gatekeepers. They buy, they consent, they program the AI buddy, and they monitor everything. Kids get a magical training experience. Parents get peace of mind.

---

## The Core Insight

**Problem:** Parents are terrified of their kids talking to AI. They've seen the headlines. They don't trust it.

**Solution:** Make parents the architects of their child's AI experience. They "program" the wolf buddy by telling us about their kid. They see every conversation. They get red flags. They're in control.

**Result:** Parent becomes an advocate, not a blocker. They're invested because they built it.

---

## User Personas

### Parent (Primary Buyer)
- Age: 35-50
- Buying for: Their 8-16 year old athlete
- Concerns: Safety, screen time, what their kid is being told
- Wants: Transparency, control, proof it's working

### Athlete (Primary User)
- Age: 8-16 (two sub-segments: 8-12, 13-16)
- Using for: Training guidance, motivation, AI coaching
- Wants: Fun, game-like, feels like THEIR buddy (not parent's spy)

---

## COPPA Compliance Strategy

### Age Gates
```
Step 1: "How old is the athlete?"
├── Under 13 → COPPA Flow (verifiable parental consent required)
├── 13-17 → Parent Notification Flow (parent email required)
└── 18+ → Standard Flow (adult self-registration)
```

### Under-13 Requirements (COPPA)
1. **Verifiable Parental Consent** - Parent must:
   - Create account first (they are the account owner)
   - Add payment method (credit card = identity verification)
   - Explicitly consent to data collection for child
   - Receive privacy policy in plain language

2. **Data Minimization**
   - Collect only what's needed for training
   - No behavioral advertising
   - No third-party data sharing
   - Parent can delete child's data anytime

3. **Parent Access Rights**
   - View all collected data
   - Delete data on request
   - Revoke consent anytime

---

## Dual Portal Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    YP PLATFORM                               │
├─────────────────────────┬───────────────────────────────────┤
│   PARENT PORTAL         │      ATHLETE APP                  │
│   (Web Dashboard)       │      (Mobile-First)               │
├─────────────────────────┼───────────────────────────────────┤
│ • Account & Billing     │ • Training Programs               │
│ • Add/Manage Athletes   │ • AI Wolf Buddy Chat              │
│ • Program AI Buddy      │ • Progress & Streaks              │
│ • Conversation Logs     │ • Gamification (XP, Crystals)     │
│ • Red Flag Alerts       │ • Video Workouts                  │
│ • Progress Reports      │ • Ask Wolf Anything               │
│ • Safety Settings       │ • Leaderboards                    │
│ • Data Export/Delete    │ • Avatar & Customization          │
└─────────────────────────┴───────────────────────────────────┘
```

---

## Onboarding Flow

### Phase 1: Parent Registration (Web)

```
Screen 1: Landing
"Train Smarter. Play Harder."
[Get Started] →

Screen 2: Who's This For?
"Who will be training with Wolf Pack?"
○ My child (I'm the parent/guardian)
○ Myself (I'm the athlete)
→ Select "My child"

Screen 3: Parent Account
"First, let's set up your parent account"
- Email
- Password
- Full Name
[Continue with Google] [Continue with Apple]
→ Creates PARENT account

Screen 4: Athlete Age
"How old is your athlete?"
[Age selector: 6-18]
→ Under 13 triggers COPPA consent

Screen 5: COPPA Consent (if under 13)
"Because [name] is under 13, we need your permission"
- Plain language privacy policy
- What data we collect (training activity, chat logs)
- What we DON'T do (no ads, no data selling)
- Your rights (view, delete, revoke anytime)
☑ I am the parent/guardian and I consent
[I Agree & Continue]

Screen 6: Payment
"Add a payment method to continue"
"Your card won't be charged until you choose a plan"
[Add Card] → Stripe
→ Card on file = identity verification for COPPA
```

### Phase 2: Athlete Profile (Parent Creates)

```
Screen 7: Athlete Basics
"Tell us about your athlete"
- First name (what Wolf calls them)
- Age
- Primary sport (Basketball, Soccer, etc.)
- Experience level (Beginner, Intermediate, Advanced)

Screen 8: Goals
"What are [name]'s goals?"
☑ Get faster
☑ Jump higher
☑ Build strength
☑ Prevent injuries
☑ Make the team
☑ Have fun

Screen 9: Training Context
"Help us personalize [name]'s experience"
- How many days/week can they train?
- When do they usually train? (Morning/After school/Evening)
- Any injuries or limitations we should know about?
- What motivates them? (Competition/Personal bests/Fun)

Screen 10: Program the Wolf Buddy
"Make Wolf [name]'s perfect training buddy"

"What should Wolf know about [name]?"
[Large text input]
Example prompts:
- "Alex loves basketball and wants to dunk by summer"
- "She's shy and needs extra encouragement"
- "He gets distracted easily - keep workouts short"
- "She's recovering from an ankle sprain"

"How should Wolf talk to [name]?"
○ Hype Coach - High energy, lots of encouragement
○ Chill Mentor - Calm, supportive, patient
○ Drill Sergeant - Direct, challenging, no-nonsense
○ Best Friend - Fun, casual, game-like

[Preview Wolf] → Shows sample Wolf message in chosen style
```

### Phase 3: Athlete Activation (Kid's Device)

```
Screen 11: Parent Gets Code
"[Name]'s account is ready!"
"Share this code with [name] to connect their device"

┌──────────────────┐
│   WOLF-7X9K-2M   │
└──────────────────┘

[Copy Code] [Send via Text] [QR Code]

"Or have them scan this QR code"
[QR Code Image]

Screen 12: Kid Opens App
"Welcome to Wolf Pack!"
[Wolf mascot animation]
"Got a code from your parent?"
[Enter Code] or [Scan QR]

Screen 13: Kid Enters Code
"Enter your pack code"
[_ _ _ _ - _ _ _ _ - _ _]
→ Links to parent's account, pulls athlete profile

Screen 14: Meet Your Wolf
"Hey [Name]! I'm Wolf."
[Animated Wolf appears]
"Your [parent name] told me you want to [goal]."
"I'm here to help you get there."
"Ready to start training?"
[Let's Go!]

Screen 15: Quick Personalization (Kid)
"One quick thing - pick your avatar"
[Avatar selector - wolf variants]

"What should I call you?"
○ [Name] (default)
○ Nickname: [input]

Screen 16: First Mission
"Your first mission is ready"
[Shows Day 1 workout card]
[Start Training]
```

---

## Parent Dashboard Features

### 1. Athlete Overview
```
┌─────────────────────────────────────────┐
│ 🐺 Alex's Dashboard                     │
├─────────────────────────────────────────┤
│ Streak: 12 days 🔥                      │
│ This Week: 4/5 workouts complete        │
│ XP Earned: 2,450                        │
│ Current Program: Basketball Chassis     │
│                                         │
│ [View Progress] [View Conversations]    │
└─────────────────────────────────────────┘
```

### 2. Conversation Logs (Full Transparency)
```
┌─────────────────────────────────────────┐
│ 💬 Wolf Conversations                   │
│ Last 7 days • 23 messages               │
├─────────────────────────────────────────┤
│ Today, 3:45 PM                          │
│ Alex: "my knee hurts after practice"    │
│ Wolf: "Let's take it easy today..."     │
│                                         │
│ Today, 3:42 PM                          │
│ Alex: "what workout should I do"        │
│ Wolf: "Based on your schedule..."       │
│                                         │
│ [Load More]                             │
└─────────────────────────────────────────┘
```

### 3. Red Flag System
```
Alert Types:
🔴 CRITICAL - Immediate notification
   - Self-harm mentions
   - Bullying/abuse indicators
   - Dangerous activity requests

🟡 WARNING - Daily digest
   - Excessive frustration
   - Mentions of pain/injury
   - Off-topic conversations

🟢 INFO - Weekly summary
   - Motivation dips
   - Missed workouts
   - Goal changes
```

**Red Flag Response:**
```
┌─────────────────────────────────────────┐
│ 🔴 Alert: Potential Concern             │
│ Today at 4:15 PM                        │
├─────────────────────────────────────────┤
│ Alex mentioned: "I don't want to play   │
│ basketball anymore"                     │
│                                         │
│ Context: After a tough practice         │
│                                         │
│ Wolf's Response: "That sounds           │
│ frustrating. Want to talk about it?"    │
│                                         │
│ [View Full Conversation]                │
│ [Mark as Reviewed] [Talk to Alex]       │
└─────────────────────────────────────────┘
```

### 4. Reprogram Wolf (Anytime)
```
"Update Wolf's knowledge about Alex"

Current Programming:
"Alex loves basketball and wants to dunk by summer.
She's shy and needs extra encouragement.
Focus on ankle strength due to past sprain."

[Edit Programming]

Recent Updates You Could Add:
- Alex completed Basketball Chassis program
- Alex mentioned knee pain on Jan 5
- Alex's motivation has been high this week

[Add to Wolf's Knowledge]
```

### 5. Safety Settings
```
☑ Enable conversation monitoring
☑ Send daily activity summary
☑ Alert me for concerning messages
☐ Require my approval for new programs
☑ Block after 8pm (screen time)

Content Filters:
☑ Keep conversations training-focused
☑ Redirect off-topic questions
☑ No personal advice (relationships, etc.)
```

---

## Data Architecture

### Parent Account
```typescript
interface ParentAccount {
  id: string;
  email: string;
  name: string;

  // Billing
  stripeCustomerId: string;
  subscription: SubscriptionTier;

  // Athletes
  athletes: AthleteProfile[];

  // Settings
  notificationPrefs: NotificationPrefs;
  safetySettings: SafetySettings;
}
```

### Athlete Profile
```typescript
interface AthleteProfile {
  id: string;
  parentId: string;

  // Basics
  name: string;
  nickname?: string;
  age: number;
  avatarId: string;

  // Training
  primarySport: Sport;
  goals: Goal[];
  schedule: WeeklySchedule;
  limitations: string[];

  // AI Programming
  wolfPersonality: 'hype' | 'chill' | 'drill' | 'friend';
  parentContext: string; // The "programming" text

  // COPPA
  coppaConsentDate: Date;
  coppaConsentVersion: string;

  // Activity
  conversations: ConversationLog[];
  workouts: WorkoutCompletion[];
  redFlags: RedFlag[];
}
```

### Conversation Log
```typescript
interface ConversationLog {
  id: string;
  athleteId: string;
  timestamp: Date;

  messages: Message[];

  // Safety
  flagged: boolean;
  flagType?: 'critical' | 'warning' | 'info';
  flagReason?: string;
  parentReviewed: boolean;
  parentReviewedAt?: Date;
}
```

---

## Key Differentiators

### vs. Other Youth Apps
| Feature | Others | Wolf Pack |
|---------|--------|-----------|
| Parent visibility | Limited | Full conversation logs |
| AI safety | Hope for the best | Real-time red flags |
| Personalization | Generic | Parent "programs" the AI |
| COPPA | Checkbox | Verified consent + card |
| Parent experience | Afterthought | First-class dashboard |

### The "Programming" Magic
This is the secret sauce. When a parent writes:
> "Alex is shy and needs extra encouragement. He gets frustrated when he can't do something on the first try."

Wolf uses this to:
- Celebrate small wins more enthusiastically
- Break down complex moves into smaller steps
- Acknowledge frustration before redirecting
- Never use harsh coaching language

**Parent feels:** "I made this AI work for MY kid"
**Kid feels:** "Wolf really gets me"

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Parent account model in Convex
- [ ] Athlete profile with parent link
- [ ] Invite code generation system
- [ ] Basic parent dashboard UI

### Phase 2: Onboarding Flow (Week 2-3)
- [ ] Age gate + COPPA consent flow
- [ ] Stripe integration for identity verification
- [ ] Athlete creation wizard
- [ ] "Program Wolf" interface
- [ ] Code/QR linking system

### Phase 3: Transparency (Week 3-4)
- [ ] Conversation logging to Convex
- [ ] Parent dashboard: conversation viewer
- [ ] Red flag detection in Wolf router
- [ ] Push notifications for alerts

### Phase 4: Polish (Week 4-5)
- [ ] Kid onboarding animations
- [ ] Parent mobile-responsive dashboard
- [ ] Safety settings UI
- [ ] Data export/deletion tools

---

## Open Questions

1. **Pricing Model**
   - Per athlete? Per family?
   - What's included in free tier?

2. **Age Transitions**
   - When kid turns 13, do we prompt for new consent?
   - When do they "graduate" to their own account?

3. **Multi-Parent Households**
   - Can both parents have access?
   - How do we handle divorced parents?

4. **School/Team Accounts**
   - Coaches as pseudo-parents?
   - Different consent flow?

---

## Success Metrics

- **Conversion:** Parent signup → Athlete activated (target: 70%)
- **Safety:** Red flags reviewed within 24h (target: 95%)
- **Trust:** Parent NPS (target: 50+)
- **Retention:** Family still active at 90 days (target: 40%)

---

## References

- Runna app screenshots (onboarding flow inspiration)
- COPPA compliance guide: https://www.ftc.gov/coppa
- Bark (parental monitoring): https://bark.us
- Greenlight (parent-controlled kids finance): https://greenlight.com
