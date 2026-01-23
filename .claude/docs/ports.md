# Port Registry

> **Single source of truth for local dev ports.**
> All agents and devs must reference this before starting servers.

---

## Assigned Ports

| Port | App | Framework | Dev Command |
|------|-----|-----------|-------------|
| 3001 | Shop | Hydrogen/Remix | `pnpm --filter @yp/shop dev` |
| 3002 | Neoball LP | Astro | `pnpm --filter @yp/neoball-lp dev` |
| 3003 | Academy | Next.js | `pnpm --filter @yp/web-academy dev` |
| 3004 | Marketing | Vite/React | `pnpm --filter @yp/marketing dev` |
| 3005 | YP Vision | Next.js | `pnpm --filter @yp/vision dev` |
| 3006 | (Available) | - | - |

---

## Reserved Ports (Backend Services)

| Port | Service | Notes |
|------|---------|-------|
| 8188 | Convex Dev | Auto-assigned by `convex dev` |
| 3210 | Convex Dashboard | Convex local UI |

---

## Port Ranges

| Range | Purpose |
|-------|---------|
| 3001-3010 | Frontend apps |
| 3011-3020 | Future apps (reserved) |
| 8000-8200 | Backend services |

---

## Before Starting a Server

1. **Check what's running:** `lsof -i :PORT` or `lsof -i -P | grep LISTEN`
2. **Kill a stuck port:** `kill -9 $(lsof -t -i :PORT)`
3. **Start specific app:** `pnpm turbo run dev --filter=APP_NAME`

---

## Adding a New App

1. Pick the next available port in the 3001-3020 range
2. Update this file
3. Set port explicitly in `package.json` dev script

---

*Last updated: January 7, 2026*
