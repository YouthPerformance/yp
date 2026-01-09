# Environment Variable Registry

> **Single source of truth** for all env vars across apps.

---

## Quick Lookup

| Var | Used In | Type | Required |
|-----|---------|------|----------|
| `BETTER_AUTH_SECRET` | Academy | Secret | Yes |
| `NEXT_PUBLIC_SITE_URL` | Academy | Public | Yes |
| `CONVEX_DEPLOYMENT` | All | Secret | Yes |
| `NEXT_PUBLIC_CONVEX_URL` | Academy | Public | Yes |
| `STRIPE_SECRET_KEY` | Academy | Secret | Yes |
| `STRIPE_WEBHOOK_SECRET` | Academy | Secret | Yes |
| `PUBLIC_STOREFRONT_API_TOKEN` | Shop | Public | Yes |
| `PRIVATE_STOREFRONT_TOKEN` | Shop | Secret | Yes |
| `SESSION_SECRET` | Shop | Secret | Yes |
| `PUBLIC_STORE_DOMAIN` | Shop | Public | Yes |
| `ANTHROPIC_API_KEY` | yp-alpha | Secret | Yes |
| `ELEVENLABS_API_KEY` | Academy | Secret | For voice |
| `DEEPGRAM_API_KEY` | Academy | Secret | For voice |
| `MUX_TOKEN_ID` | Academy | Secret | For video |
| `MUX_TOKEN_SECRET` | Academy | Secret | For video |

---

## By App

### Academy (`apps/web-academy/.env.local`)
```bash
# Auth (BetterAuth - migrated from Clerk Jan 2026)
BETTER_AUTH_SECRET=             # Random 32+ char string
NEXT_PUBLIC_SITE_URL=           # e.g., http://localhost:3003 or https://academy.youthperformance.com

# OAuth (optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=

# Database
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# Payments
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# AI Voice
ANTHROPIC_API_KEY=
ELEVENLABS_API_KEY=
DEEPGRAM_API_KEY=

# Video
MUX_TOKEN_ID=
MUX_TOKEN_SECRET=
```

### Shop (`apps/shop/.env`)
```bash
# Shopify
PUBLIC_STOREFRONT_API_TOKEN=
PRIVATE_STOREFRONT_TOKEN=
PUBLIC_STORE_DOMAIN=

# Session
SESSION_SECRET=
```

### Marketing (`apps/marketing/.env`)
```bash
# Database
VITE_CONVEX_URL=

# Note: Marketing app uses BetterAuth sessions from Academy
# via shared cookie domain. No separate auth config needed.
```

### yp-alpha (`packages/yp-alpha/.env`)
```bash
# AI
ANTHROPIC_API_KEY=

# Database
CONVEX_DEPLOYMENT=
```

---

## Production Secrets (CI/CD)

### Vercel (Academy)
Set in Vercel Dashboard > Project > Settings > Environment Variables:
- `BETTER_AUTH_SECRET` (required - session signing)
- `NEXT_PUBLIC_SITE_URL` (required - e.g., https://academy.youthperformance.com)
- `NEXT_PUBLIC_CONVEX_URL`
- `CONVEX_DEPLOYMENT`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `ANTHROPIC_API_KEY`
- `ELEVENLABS_API_KEY`
- `DEEPGRAM_API_KEY`
- `GOOGLE_CLIENT_ID` (optional - OAuth)
- `GOOGLE_CLIENT_SECRET` (optional - OAuth)
- `APPLE_CLIENT_ID` (optional - OAuth)
- `APPLE_CLIENT_SECRET` (optional - OAuth)

### Shopify Oxygen (Shop)
Set in Shopify Admin > Hydrogen > Environment:
- `SESSION_SECRET`
- `PRIVATE_STOREFRONT_TOKEN`

### Cloudflare Pages (Marketing)
Set in Cloudflare Dashboard > Pages > Settings > Environment:
- `VITE_CONVEX_URL`
# Note: Auth is handled via shared BetterAuth cookies from Academy

### GitHub Actions
Set in GitHub > Settings > Secrets:
- `CONVEX_DEPLOY_KEY`

---

## Naming Conventions

| Prefix | Meaning | Safe to Expose? |
|--------|---------|-----------------|
| `NEXT_PUBLIC_` | Next.js client-side | Yes |
| `VITE_` | Vite client-side | Yes |
| `PUBLIC_` | Hydrogen client-side | Yes |
| `PRIVATE_` | Server-only | No |
| No prefix | Server-only | No |

---

## Security Rules

1. **Never commit `.env` files** - Use `.env.example` templates
2. **Never log secrets** - Use redaction in logs
3. **Rotate quarterly** - Set calendar reminders
4. **Validate on startup** - Use Zod schemas (see `apps/shop/app/lib/env.server.ts`)

---

*Updated: January 8, 2026 - Migrated from Clerk to BetterAuth*
