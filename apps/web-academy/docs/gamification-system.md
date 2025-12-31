# Barefoot Reset - Gamification System Design

## Research Summary

Based on analysis of [Duolingo's gamification strategies](https://www.orizon.co/blog/duolingos-gamification-secrets) and [fitness app gamification trends](https://yukaichou.com/gamification-analysis/top-10-gamification-in-fitness/):

### Key Learnings
- **Streaks are #1**: Duolingo credits streaks as their biggest growth driver (9M users with 365+ day streaks)
- **7-day milestone**: Users who hit 7-day streaks are 3.6x more likely to stay engaged long-term
- **Streak freezes reduced churn by 21%** for at-risk users
- **Leagues increased completion by 25%**
- **Daily quests increased DAU by 25%**
- **Unpredictable rewards** activate dopamine-driven motivation

### Anti-Gaming Lessons (from Duolingo's cheating problem)
- Players were farming 1,300+ XP/day vs normal 20-50 XP
- Easy/repetitive tasks exploited for XP without real learning
- Need: Activity-based caps, diminishing returns, quality gates

---

## Barefoot Reset XP Economy

### Core Philosophy
> "Reward real effort, not repetition. Every XP should represent actual training value."

### XP Rewards by Action

| Action | XP | Rationale |
|--------|-----|-----------|
| **Complete Daily Workout** | 100 XP | Core action, high reward |
| **Perfect Form (all exercises)** | +25 XP bonus | Quality incentive |
| **Complete Quiz (70%+)** | 20 XP | Knowledge retention |
| **Perfect Quiz (100%)** | 35 XP | Excellence bonus |
| **First workout of the day** | +10 XP bonus | Habit formation |
| **Complete StrikeWOD** | 50 XP | Challenge mode |
| **New StrikeWOD PR** | +30 XP bonus | Improvement reward |
| **Watch education video** | 15 XP | Learning engagement |
| **7-day streak milestone** | 100 XP bonus | Retention hook |
| **14-day streak milestone** | 200 XP bonus | Commitment reward |
| **30-day streak milestone** | 500 XP bonus | Major achievement |
| **Invite friend (they complete Day 1)** | 50 XP | Viral growth |

### Daily XP Caps (Anti-Gaming)

```typescript
const XP_CAPS = {
  // Core workout XP: No cap (you can only do 1 workout per day anyway)
  dailyWorkout: 125,  // 100 base + 25 perfect form

  // Quiz XP: Capped to prevent replay farming
  quizXpDaily: 50,    // Max ~2 quizzes worth

  // Education content: Capped to prevent video farming
  educationXpDaily: 45,  // Max 3 videos

  // Total daily cap
  totalDailyMax: 250,  // Prevents any exploit from going crazy
};
```

### XP Diminishing Returns
```typescript
// After 3rd quiz of the day, XP reduces
function getQuizXp(quizzesTakenToday: number, score: number): number {
  const baseXp = score === 100 ? 35 : score >= 70 ? 20 : 10;

  if (quizzesTakenToday <= 2) return baseXp;
  if (quizzesTakenToday <= 5) return Math.floor(baseXp * 0.5);
  return Math.floor(baseXp * 0.1); // Basically nothing after 5
}
```

---

## Level System

### XP Thresholds (Inspired by RPG curves)

| Level | Total XP Required | Days to Reach (avg) |
|-------|-------------------|---------------------|
| 1 | 0 | Day 1 |
| 2 | 200 | Day 2 |
| 3 | 500 | Day 4 |
| 4 | 900 | Day 7 |
| 5 | 1,500 | Day 11 |
| 6 | 2,300 | Day 16 |
| 7 | 3,300 | Day 22 |
| 8 | 4,500 | Day 29 |
| 9 | 6,000 | Day 37 |
| 10 | 8,000 | Day 42+ |

```typescript
const LEVEL_THRESHOLDS = [0, 200, 500, 900, 1500, 2300, 3300, 4500, 6000, 8000];

function getLevel(totalXp: number): number {
  return LEVEL_THRESHOLDS.findIndex((threshold, i) =>
    totalXp < (LEVEL_THRESHOLDS[i + 1] || Infinity)
  ) + 1;
}

function getXpToNextLevel(totalXp: number): { current: number; required: number } {
  const level = getLevel(totalXp);
  const currentThreshold = LEVEL_THRESHOLDS[level - 1];
  const nextThreshold = LEVEL_THRESHOLDS[level] || currentThreshold + 2000;

  return {
    current: totalXp - currentThreshold,
    required: nextThreshold - currentThreshold,
  };
}
```

---

## Crystal Shard Economy

### Philosophy
> "Crystals are earned through excellence, spent on convenience. Never pay-to-win."

### Earning Crystals

| Action | Crystals | Frequency Cap |
|--------|----------|---------------|
| Complete daily workout | 5 | 1/day |
| Perfect form workout | +3 | 1/day |
| 7-day streak | 25 | 1/week |
| 14-day streak | 50 | 1/2 weeks |
| 30-day streak | 150 | 1/month |
| Level up | 20 | Per level |
| Rank up | 100 | Per rank |
| StrikeWOD PR | 10 | Per PR |
| Perfect Quiz | 5 | 3/day max |
| Complete all daily quests | 15 | 1/day |

### Spending Crystals

| Item | Cost | Effect | Limit |
|------|------|--------|-------|
| Streak Freeze | 50 | Protect streak for 1 day | 2 in inventory |
| XP Boost (2x for next workout) | 75 | Double XP | 1/day |
| Card Pack (3 random cards) | 150 | Collectibles | No limit |
| Theme Pack (new wolf color) | 200 | Cosmetic | Once per color |
| Streak Repair (missed 1 day) | 100 | Restore streak | 24hr window |
| Streak Repair (missed 2 days) | 200 | Restore streak | 48hr window |

### Crystal Anti-Gaming
```typescript
const CRYSTAL_LIMITS = {
  dailyEarnCap: 50,      // Can't earn more than 50/day
  streakFreezesHeld: 2,  // Max 2 in inventory
  streakRepairWindow: 48, // Hours to repair
};
```

---

## Streak System

### Core Logic
```typescript
interface StreakData {
  current: number;        // Current streak days
  best: number;           // All-time best
  lastCompletedAt: Date;  // Last workout completion
  freezesAvailable: number;
  freezeUsedToday: boolean;
}

function updateStreak(data: StreakData, now: Date): StreakData {
  const lastDate = new Date(data.lastCompletedAt);
  const daysSinceLastWorkout = getDaysDifference(lastDate, now);

  if (daysSinceLastWorkout === 0) {
    // Already worked out today
    return data;
  }

  if (daysSinceLastWorkout === 1) {
    // Perfect - worked out yesterday, continue streak
    return {
      ...data,
      current: data.current + 1,
      best: Math.max(data.best, data.current + 1),
      lastCompletedAt: now,
      freezeUsedToday: false,
    };
  }

  if (daysSinceLastWorkout === 2 && data.freezesAvailable > 0 && !data.freezeUsedToday) {
    // Missed 1 day, use freeze automatically
    return {
      ...data,
      freezesAvailable: data.freezesAvailable - 1,
      freezeUsedToday: true,
      // Streak preserved, but need to work out today
    };
  }

  // Streak broken
  return {
    ...data,
    current: 1, // Starting fresh today
    lastCompletedAt: now,
    freezeUsedToday: false,
  };
}
```

### Streak Milestones & Rewards

| Streak | Reward | Badge |
|--------|--------|-------|
| 3 days | 25 crystals | "Getting Started" |
| 7 days | 50 crystals + 100 XP | "Week Warrior" |
| 14 days | 100 crystals + 200 XP | "Two Week Champion" |
| 21 days | 150 crystals | "Habit Formed" |
| 30 days | 300 crystals + 500 XP | "Monthly Master" |
| 42 days | 500 crystals + Special Card | "Foundation Complete" |

### Streak Recovery (Paid)
- **Within 24 hours**: 100 crystals to restore
- **Within 48 hours**: 200 crystals to restore
- **After 48 hours**: Streak is gone forever (harsh but fair)

---

## Rank System (Wolf Pack Hierarchy)

### Ranks
```typescript
type Rank = 'pup' | 'hunter' | 'alpha' | 'apex';

const RANK_REQUIREMENTS = {
  pup: { level: 1, streak: 0 },      // Starting rank
  hunter: { level: 3, streak: 7 },   // ~1 week
  alpha: { level: 6, streak: 21 },   // ~3 weeks
  apex: { level: 9, streak: 42 },    // Complete program
};

function calculateRank(level: number, bestStreak: number): Rank {
  if (level >= 9 && bestStreak >= 42) return 'apex';
  if (level >= 6 && bestStreak >= 21) return 'alpha';
  if (level >= 3 && bestStreak >= 7) return 'hunter';
  return 'pup';
}
```

### Rank Rewards
| Rank | Unlocks | Crystal Bonus |
|------|---------|---------------|
| Hunter | Gold wolf color, Hunter badge | 100 |
| Alpha | Purple wolf color, Alpha badge, Ask Wolf unlimited | 200 |
| Apex | Red wolf color, Apex badge, Exclusive card pack | 500 |

---

## Daily Quests System

### Quest Pool (3 random daily)
```typescript
const DAILY_QUESTS = [
  { id: 'complete_workout', name: 'Complete Today\'s Workout', xp: 50, crystals: 5 },
  { id: 'perfect_form', name: 'Get Perfect Form Rating', xp: 30, crystals: 3 },
  { id: 'quiz_master', name: 'Score 100% on Quiz', xp: 25, crystals: 5 },
  { id: 'watch_education', name: 'Watch 2 Education Videos', xp: 20, crystals: 2 },
  { id: 'morning_warrior', name: 'Complete Workout Before 9am', xp: 35, crystals: 5 },
  { id: 'evening_wind_down', name: 'Complete Workout After 6pm', xp: 25, crystals: 3 },
  { id: 'strike_wod', name: 'Complete a StrikeWOD Challenge', xp: 40, crystals: 5 },
];

// 3 quests assigned daily at midnight
// Completing all 3 = bonus 15 crystals
```

---

## Anti-Gaming & Fairness Measures

### 1. Activity-Based Caps
```typescript
const DAILY_LIMITS = {
  workoutsCompletedForXp: 1,     // Only 1 workout gives XP per day
  quizzesForFullXp: 3,           // After 3, diminishing returns
  educationVideosForXp: 3,       // Cap content farming
  totalXpCap: 250,               // Hard cap
  totalCrystalsCap: 50,          // Hard cap
};
```

### 2. Time-Based Validation
```typescript
// Workout must take minimum time to count
const MIN_WORKOUT_DURATION_SECONDS = 300; // 5 minutes minimum

function validateWorkoutCompletion(
  startTime: Date,
  endTime: Date,
  expectedDuration: number
): boolean {
  const actualDuration = (endTime - startTime) / 1000;
  const minRequired = Math.max(MIN_WORKOUT_DURATION_SECONDS, expectedDuration * 0.5);

  return actualDuration >= minRequired;
}
```

### 3. Rate Limiting
```typescript
// Can't complete same workout twice in 20 hours
const WORKOUT_COOLDOWN_HOURS = 20;

// Can't take same quiz more than 3x per day
const QUIZ_DAILY_LIMIT = 3;
```

### 4. Quality Gates
```typescript
// Quiz score must be 70%+ to earn XP
const MIN_QUIZ_SCORE_FOR_XP = 70;

// StrikeWOD must be completed (not skipped) for XP
const STRIKEWOD_COMPLETION_REQUIRED = true;
```

### 5. Suspicious Activity Detection
```typescript
const SUSPICIOUS_PATTERNS = {
  // Too fast workout completion
  workoutUnder3Minutes: true,

  // Perfect quiz in under 10 seconds
  quizTooFast: true,

  // Multiple devices same account
  multiDeviceAbuse: true,

  // XP spike (3x normal in one day)
  abnormalXpGain: true,
};

// Flag for manual review, don't auto-punish
```

---

## Dopamine Balance (The "Right Dosage")

### Immediate Rewards (Every Session)
- XP gain animation with sound
- Crystal shard sparkle effect
- Progress bar advancement
- "Workout Complete" celebration

### Short-term Rewards (Daily/Weekly)
- Daily quest completion badges
- Streak counter increment
- Level up celebration (confetti + sound)
- Weekly progress summary

### Long-term Rewards (Monthly/Program)
- Rank promotions (big celebration)
- Program phase completions
- Card collection milestones
- "Foundation Complete" ceremony

### Avoiding Over-Gamification
1. **No push notifications for XP** - Only streak risks
2. **No social comparison pressure** - No public leaderboards (yet)
3. **No loss of earned progress** - XP never decreases
4. **No pay-to-win** - Crystals are cosmetic/convenience only
5. **No artificial urgency** - No "limited time" daily rewards that expire

---

## Implementation Priority

### Phase 1: Core Loop (Must Have)
- [x] XP earning for workout completion
- [x] Level progression
- [x] Streak tracking
- [ ] Daily quest system
- [ ] Workout completion validation

### Phase 2: Economy (Should Have)
- [ ] Crystal earning
- [ ] Crystal spending (streak freeze, card packs)
- [ ] Rank system implementation

### Phase 3: Polish (Nice to Have)
- [ ] Achievement badges
- [ ] Card collection system
- [ ] Celebration animations
- [ ] Sound effects for rewards

---

## Database Schema Updates Needed

```typescript
// Add to users table
users: {
  // ... existing fields
  dailyXpEarned: number;        // Reset at midnight
  dailyCrystalsEarned: number;  // Reset at midnight
  lastXpResetAt: number;        // Timestamp

  // Quest tracking
  dailyQuestIds: string[];      // Today's assigned quests
  completedQuestIds: string[];  // Completed today
  lastQuestResetAt: number;
}

// Add daily_activity table
dailyActivity: {
  userId: Id<"users">;
  date: string;                 // YYYY-MM-DD
  workoutsCompleted: number;
  quizzesTaken: number;
  videosWatched: number;
  xpEarned: number;
  crystalsEarned: number;
}
```

---

## Sources
- [Duolingo's Gamification Secrets](https://www.orizon.co/blog/duolingos-gamification-secrets)
- [Duolingo Gaming Principles Analysis](https://www.deconstructoroffun.com/blog/2025/4/14/duolingo-how-the-15b-app-uses-gaming-principles-to-supercharge-dau-growth)
- [Top Gamification in Fitness Apps](https://yukaichou.com/gamification-analysis/top-10-gamification-in-fitness/)
- [Gamified Fitness Apps 2024](https://hitberrygames.medium.com/gamified-fitness-apps-in-2023-the-trend-you-cannot-miss-b1640232e67a)
