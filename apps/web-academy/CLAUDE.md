# web-academy

> Core training platform with AI coach, ILM modules, and gamification.
> **URL:** academy.youthperformance.com
> **Deploy:** Vercel (auto on main merge)

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| State | Convex (server) + Zustand (client) |
| Auth | Clerk |
| Payments | Stripe |
| Styling | Tailwind CSS |
| Animation | Framer Motion |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (main)/             # Authenticated routes
│   │   ├── home/           # Dashboard
│   │   ├── playbook/       # ILM modules
│   │   ├── programs/       # 42-day programs
│   │   ├── ask-wolf/       # AI Coach (Pro only)
│   │   └── shop/           # Crystal shop
│   ├── (onboarding)/       # Onboarding flow
│   ├── api/                # API routes
│   └── sign-in/            # Clerk auth
├── components/             # React components
│   ├── modules/            # ILM (CardSwiper, cards)
│   ├── programs/           # Workout player
│   └── ui/                 # Base UI
├── data/                   # Static content
│   ├── modules/            # ILM module data
│   └── programs/           # Program data
├── contexts/               # React contexts
├── hooks/                  # Custom hooks
├── stores/                 # Zustand stores
└── lib/                    # Utilities
```

---

## Key Routes

| Route | Purpose | Auth |
|-------|---------|------|
| `/home` | Dashboard | Required |
| `/playbook/modules` | All ILM modules | Required |
| `/playbook/modules/[slug]` | Module detail | Required |
| `/playbook/modules/[slug]/play` | Card swiper | Required |
| `/programs` | 42-day programs | Required |
| `/ask-wolf` | AI Coach | Pro only |
| `/shop` | Crystal shop | Required |

---

## Economy v2.0

| Lane | Purpose |
|------|---------|
| **XP** | Progress, ranks, leveling |
| **Shards** | 10 shards = 1 crystal |
| **Crystals** | Shop purchases, AI credits |

### ILM Rewards
- Per card: +5 XP (first try) / +2 XP (retry)
- Level completion: Bonus XP + Shards
- Total per module: ~360 XP, 5 shards

---

## Data Pattern

Static TypeScript files, not CMS:

```typescript
// data/modules/bulletproof-ankles/index.ts
export const bulletproofAnklesModule: ILMModule = {
  slug: "bulletproof-ankles",
  title: "Bulletproof Ankles",
  sections: [ /* ... */ ]
}
```

---

## Development

```bash
# Start dev server (port 3003)
pnpm dev

# Build
pnpm build

# Type check
pnpm typecheck

# Lint
pnpm lint
```

---

## Environment Variables

```bash
# Required
NEXT_PUBLIC_CONVEX_URL=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
ANTHROPIC_API_KEY=
```

---

## Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `CardSwiper` | `components/modules/` | Swipeable lesson cards |
| `XpCounter` | `components/modules/` | XP display |
| `CheckCard` | `components/modules/cards/` | Quiz cards |
| `WorkoutPlayer` | `components/workout/` | Video workout |

---

## TODO

- [ ] Connect `/api/chat` to yp-alpha router
- [ ] Streaming chat UI
- [ ] Shards counter component
- [ ] Badge display in profile
