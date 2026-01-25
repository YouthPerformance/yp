# web-academy

> Core training platform with AI coach, ILM modules, and gamification.
> **URL:** app.youthperformance.com
> **Deploy:** Vercel (auto on main merge)

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 15 (App Router) |
| State | Convex (server) + Zustand (client) |
| Auth | BetterAuth |
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
│   └── auth/               # BetterAuth
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
NEXT_PUBLIC_SITE_URL=
BETTER_AUTH_SECRET=
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
ANTHROPIC_API_KEY=

# Optional - OAuth Providers
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Optional - Email (Resend)
RESEND_API_KEY=
EMAIL_FROM=
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

## Brand Assets

**All brand assets are centralized in `packages/brand-assets/`.** Do not add new assets to `public/` - import from the shared package instead.

```typescript
import { LOGOS, IMAGES, AUDIO, FONTS } from '@yp/brand-assets';

// Usage - optimized WebP versions available
<img src={IMAGES.team.james.hero.webp} alt="James" />
<img src={LOGOS.primary.svg} alt="YP Logo" />
```

---

## Anti-Patterns (Don't Repeat)

> **Pattern:** App-specific mistakes captured via `/retro`.

| Don't | Instead | Why | Added |
|-------|---------|-----|-------|
| Use `Date.now()` or `Math.random()` in SSR | Use `useEffect` or pass as prop | Hydration mismatch errors | 2026-01 |
| Import Convex directly | Use `@yp/alpha/convex/_generated/api` | One Brain - database lives in alpha | 2026-01 |
| Create new auth logic | Use `useSession` from `@/lib/auth` | Auth is already solved via BetterAuth | 2026-01 |
| Skip `suppressHydrationWarning` for timestamps | Add attribute or use ClientOnly wrapper | SSR/client mismatch warnings | 2026-01 |
| Put API keys in `NEXT_PUBLIC_*` vars | Use server-only env vars for secrets | Public vars are exposed to client | 2026-01 |
| Use relative imports for @yp packages | Use `@yp/alpha/...` absolute paths | Build resolution failures | 2026-01 |
| Duplicate brand assets in `public/` | Import from `@yp/brand-assets` | Single source, optimized WebP | 2026-01 |

---

## TODO

- [ ] Connect `/api/chat` to yp-alpha router
- [ ] Streaming chat UI
- [ ] Shards counter component
- [ ] Badge display in profile
