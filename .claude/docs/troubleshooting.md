# Troubleshooting Guide

> **Common errors and fixes.** Stop wasting cycles on known issues.

---

## Build Errors

### `Module not found: @yp/alpha`

**Cause:** Package not built or workspace link broken.

**Fix:**
```bash
pnpm build --filter=@yp/alpha
# or rebuild all
pnpm build
```

---

### `Cannot find module 'convex/_generated/api'`

**Cause:** Convex codegen hasn't run.

**Fix:**
```bash
cd packages/yp-alpha && npx convex dev --once
```

---

### `Type error: Cannot find type definition file for 'node'`

**Cause:** Missing `@types/node`.

**Fix:**
```bash
pnpm add -D @types/node --filter <app-name>
```

---

### `ENOENT: no such file or directory, open '.next/...'`

**Cause:** Corrupted Next.js cache.

**Fix:**
```bash
rm -rf apps/web-academy/.next
pnpm turbo run dev --filter=@yp/web-academy
```

---

## Port Errors

### `EADDRINUSE: address already in use :::3003`

**Cause:** Port already in use.

**Fix:**
```bash
# Find what's using it
lsof -i :3003

# Kill it
kill -9 $(lsof -t -i :3003)
```

---

### Hydrogen won't start (port 3001)

**Cause:** Shopify CLI cache issue.

**Fix:**
```bash
cd apps/shop
rm -rf node_modules/.cache
pnpm dev
```

---

## Convex Errors

### `Convex functions are out of sync`

**Cause:** Schema changed but not deployed.

**Fix:**
```bash
cd packages/yp-alpha && npx convex dev --once
```

---

### `Document validation failed`

**Cause:** Data doesn't match schema.

**Fix:** Check `packages/yp-alpha/convex/schema.ts` for required fields.

---

### `Rate limit exceeded`

**Cause:** Too many Convex requests.

**Fix:** Add debouncing to client queries. Check for infinite loops.

---

## Auth Errors

### `Clerk: Invalid API Key`

**Cause:** Missing or wrong Clerk key.

**Fix:** Check `.env.local` for:
```bash
CLERK_SECRET_KEY=sk_live_...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
```

---

### `401 Unauthorized` on API routes

**Cause:** Missing auth middleware or expired session.

**Fix:** Ensure route has `auth()` check. Clear browser cookies.

---

## Deployment Errors

### Vercel: `Build failed: Cannot find module`

**Cause:** Dependencies not in package.json.

**Fix:**
```bash
pnpm add <missing-module> --filter @yp/web-academy
git push
```

---

### Vercel: `Function Size Too Large`

**Cause:** Bundle too big (>50MB).

**Fix:**
1. Check for large imports
2. Use dynamic imports: `const X = dynamic(() => import(...))`
3. Move to Edge runtime if possible

---

### Oxygen: `Hydrogen build failed`

**Cause:** Usually env var issues.

**Fix:**
```bash
# Check env vars are set in Shopify admin
# Verify with:
cd apps/shop && shopify hydrogen env list
```

---

### Cloudflare Pages: `Build failed`

**Cause:** Wrong build command or output dir.

**Fix:** Check CF dashboard settings:
- Build command: `pnpm turbo run build --filter=@yp/marketing`
- Output directory: `apps/marketing/dist`

---

## TypeScript Errors

### `Type 'X' is not assignable to type 'Y'`

**Cause:** Type mismatch.

**Fix:** Check schema types in `packages/yp-alpha/convex/schema.ts`. Use proper type imports.

---

### `Property 'x' does not exist on type '{}'`

**Cause:** Type inference failed.

**Fix:** Add explicit type annotation or use type guard.

---

### `Cannot use import statement outside a module`

**Cause:** ESM/CJS conflict.

**Fix:** Check `package.json` has `"type": "module"` or use `.mjs` extension.

---

## React Errors

### `Hydration mismatch`

**Cause:** Server/client HTML differs.

**Fix:**
1. Check for `Date.now()` or random values in render
2. Use `suppressHydrationWarning` for intentional mismatches
3. Wrap in `<ClientOnly>` component

---

### `Cannot update a component while rendering`

**Cause:** State update during render.

**Fix:** Move state update to `useEffect`.

---

### `Too many re-renders`

**Cause:** Infinite update loop.

**Fix:** Check `useEffect` dependencies. Don't update state that triggers the effect.

---

## Performance Issues

### Slow dev server startup

**Fix:**
```bash
# Use turbo for caching
pnpm turbo run dev --filter=<app>

# Or clear and restart
rm -rf .turbo node_modules/.cache
pnpm dev
```

---

### Slow builds

**Fix:**
1. Check turbo cache: `turbo run build --dry`
2. Use `--filter` to build only what changed
3. Enable parallel builds in `turbo.json`

---

## Network Errors

### `CORS error`

**Cause:** Cross-origin request blocked.

**Fix:** Add CORS headers to API route or use proxy.

---

### `fetch failed` in server components

**Cause:** Network timeout or DNS issue.

**Fix:**
1. Check if external service is up
2. Add retry logic
3. Increase timeout

---

## Quick Diagnostics

```bash
# Check Node version
node -v  # Should be 18+

# Check pnpm version
pnpm -v  # Should be 8+

# Check workspace status
pnpm ls --depth 0

# Check for outdated packages
pnpm outdated

# Verify turbo config
turbo run build --dry

# Check git status
git status
```

---

*Updated: January 7, 2026*
