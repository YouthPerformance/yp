# YP Architecture Overview

> System design and data flow documentation for the YP monorepo.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           YP ECOSYSTEM                                   │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                  │
│  │   MARKETING │    │   ACADEMY   │    │    SHOP     │                  │
│  │   (Vite)    │    │  (Next.js)  │    │ (Hydrogen)  │                  │
│  │             │    │             │    │             │                  │
│  │ youthperf.. │    │ academy...  │    │ shop...     │                  │
│  │ .com        │    │ .com        │    │ .com        │                  │
│  └──────┬──────┘    └──────┬──────┘    └──────┬──────┘                  │
│         │                  │                  │                          │
│         │    ┌─────────────┴─────────────┐    │                          │
│         │    │                           │    │                          │
│         ▼    ▼                           ▼    ▼                          │
│  ┌─────────────────────────────────────────────────────┐                │
│  │                 SHARED PACKAGES                      │                │
│  │  ┌───────────────┐      ┌───────────────┐           │                │
│  │  │   yp-alpha    │      │      ui       │           │                │
│  │  │  (Business    │      │  (Components  │           │                │
│  │  │   Logic)      │      │   Library)    │           │                │
│  │  └───────┬───────┘      └───────────────┘           │                │
│  └──────────┼──────────────────────────────────────────┘                │
│             │                                                            │
│             ▼                                                            │
│  ┌─────────────────────────────────────────────────────┐                │
│  │                   SERVICES                           │                │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌────────┐  │                │
│  │  │ Convex  │  │  Clerk  │  │ Stripe  │  │Shopify │  │                │
│  │  │   DB    │  │  Auth   │  │Payments │  │  API   │  │                │
│  │  └─────────┘  └─────────┘  └─────────┘  └────────┘  │                │
│  └─────────────────────────────────────────────────────┘                │
│                                                                          │
└─────────────────────────────────────────────────────────────────────────┘
```

---

## App Breakdown

### Marketing Site (`apps/marketing`)
**URL:** youthperformance.com
**Platform:** Cloudflare Pages
**Framework:** Vite + React + React Router

```
apps/marketing/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.jsx   # Glass morphic nav
│   │   ├── CardNav.jsx  # Room cards navigation
│   │   └── Footer.jsx   # Wolf sign-off footer
│   ├── pages/           # Route pages
│   │   ├── Home.jsx     # Landing page
│   │   ├── Mission.jsx  # Manifesto page
│   │   ├── Quiz.jsx     # Movement assessment
│   │   ├── Start.jsx    # Onboarding entry
│   │   └── ...
│   ├── context/         # React contexts
│   ├── config/          # App configuration
│   └── App.jsx          # Router setup
├── public/              # Static assets
└── server/              # Express backend (auth)
```

**Key Features:**
- Movement Check Quiz (6 questions)
- Wolf AI Chat integration
- Parent Settings configuration
- Clerk authentication

---

### Academy (`apps/web-academy`)
**URL:** academy.youthperformance.com
**Platform:** Vercel
**Framework:** Next.js 15 (App Router)

```
apps/web-academy/
├── src/
│   ├── app/                    # App Router pages
│   │   ├── (app)/              # Authenticated routes
│   │   │   ├── home/
│   │   │   ├── playbook/
│   │   │   ├── profile/
│   │   │   └── shop/
│   │   ├── (onboarding)/       # Onboarding flow
│   │   │   ├── role/
│   │   │   ├── athlete-info/
│   │   │   ├── code/
│   │   │   ├── avatar/
│   │   │   └── ready/
│   │   └── api/                # API routes
│   │       ├── checkout/
│   │       └── webhooks/stripe/
│   ├── components/
│   │   ├── navigation/
│   │   └── screens/
│   └── lib/                    # Utilities
├── convex/                     # Convex functions
└── public/
```

**Key Features:**
- 42-day Foundation Program
- Wolf AI Coach (Ask Wolf)
- Parent code linking (COPPA)
- Stripe subscriptions
- Avatar/rank system

---

### Shop (`apps/shop`)
**URL:** shop.youthperformance.com
**Platform:** Shopify Oxygen
**Framework:** Hydrogen (Remix)

```
apps/shop/
├── app/
│   ├── components/
│   │   ├── Layout.tsx         # Header/Footer wrapper
│   │   ├── HeroSection.tsx    # Homepage hero
│   │   ├── ProductCard.tsx    # Product display
│   │   └── Cart*.tsx          # Cart components
│   ├── routes/
│   │   ├── _index.tsx         # Homepage
│   │   ├── products._index.tsx
│   │   ├── products.$handle.tsx
│   │   ├── collections.$handle.tsx
│   │   └── cart.tsx
│   └── lib/
│       └── env.server.ts      # Env validation (Zod)
├── public/images/             # Static images
└── server.ts                  # Entry server
```

**Key Features:**
- Shopify Storefront API integration
- 3D basketball hero animation
- Horizontal scroll product showcase
- Real-time cart with optimistic UI

---

## Shared Packages

### `packages/yp-alpha`
Business logic, Convex schema, utilities.

```
packages/yp-alpha/
├── convex/
│   ├── schema.ts        # Database schema
│   ├── users.ts         # User functions
│   ├── programs.ts      # Training programs
│   └── workouts.ts      # Workout tracking
├── src/
│   └── index.ts         # Exports
└── scripts/
    └── qa_wolf.py       # QA automation
```

### `packages/ui`
Shared React components.

```
packages/ui/
├── src/
│   ├── components/
│   └── index.ts
└── tsconfig.json
```

---

## Data Flow

### User Registration Flow
```
Marketing Quiz → Quiz Results → Academy Onboarding → Convex User Created
       │                              │
       ▼                              ▼
   localStorage              Clerk Auth + Parent Code
```

### Purchase Flow
```
Shop Product → Add to Cart → Checkout → Stripe → Webhook → Convex Update
                    │
                    ▼
            Shopify Storefront API
```

### Training Session Flow
```
Academy Home → Select Program → Start Stack → Complete Drills → Log to Convex
      │              │                │               │
      ▼              ▼                ▼               ▼
   Playbook      Foundation       Mux Video      Progress Tracking
```

---

## Database Schema (Convex)

### Core Tables
```typescript
// Users
users: {
  clerkId: string,
  email: string,
  name: string,
  age: number,
  sports: string[],
  avatarColor: string,
  tier: 'free' | 'pro' | 'elite',
  parentCode?: string,
  sponsorId?: string,
  onboardingComplete: boolean
}

// Programs
programs: {
  slug: string,
  name: string,
  description: string,
  duration: number, // days
  workouts: Id<"workouts">[]
}

// Progress
progress: {
  userId: Id<"users">,
  programId: Id<"programs">,
  day: number,
  completed: boolean,
  completedAt?: number
}
```

---

## External Services

| Service | Purpose | Env Vars |
|---------|---------|----------|
| **Clerk** | Authentication | `CLERK_SECRET_KEY`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` |
| **Convex** | Database | `CONVEX_DEPLOYMENT`, `NEXT_PUBLIC_CONVEX_URL` |
| **Stripe** | Payments | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` |
| **Shopify** | E-commerce | `PUBLIC_STOREFRONT_API_TOKEN`, `PRIVATE_ADMIN_API_TOKEN` |
| **Mux** | Video | `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET` |
| **OpenAI** | AI Features | `OPENAI_API_KEY` |

---

## Deployment Targets

| App | Platform | Domain | Deploy Method |
|-----|----------|--------|---------------|
| Marketing | Cloudflare Pages | youthperformance.com | `wrangler pages deploy` |
| Academy | Vercel | academy.youthperformance.com | Git push (auto) |
| Shop | Shopify Oxygen | shop.youthperformance.com | `shopify hydrogen deploy` |
| NeoBall | Vercel | neoball.co | Git push (auto) |

---

## Security Boundaries

```
┌─────────────────────────────────────────────────────────────┐
│                      PUBLIC (Client-Side)                    │
│  - NEXT_PUBLIC_* variables only                             │
│  - Publishable API keys                                      │
│  - No secrets, no admin tokens                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      PRIVATE (Server-Side)                   │
│  - Secret keys in env.server.ts                             │
│  - Admin API tokens                                          │
│  - Webhook secrets                                           │
│  - Database credentials                                      │
└─────────────────────────────────────────────────────────────┘
```

---

*Last updated: January 2026*
