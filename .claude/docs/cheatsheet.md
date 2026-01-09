# Common Tasks Cheatsheet

> **Copy-paste commands** for frequent operations.

---

## Development

### Start Single App
```bash
pnpm turbo run dev --filter=@yp/web-academy   # Academy (3003)
pnpm turbo run dev --filter=@yp/shop          # Shop (3001)
pnpm turbo run dev --filter=@yp/marketing     # Marketing (3004)
pnpm turbo run dev --filter=playbook          # Playbook (3006)
pnpm turbo run dev --filter=@yp/neoball-lp    # Neoball (3002)
pnpm turbo run dev --filter=@yp/vision        # Vision (3005)
```

### Start Multiple Apps
```bash
pnpm turbo run dev --filter=@yp/web-academy --filter=@yp/shop
```

### Start Everything
```bash
pnpm dev
```

---

## Building

### Build All
```bash
pnpm build
```

### Build Single App
```bash
pnpm turbo run build --filter=@yp/web-academy
```

### Build with Dependencies
```bash
pnpm turbo run build --filter=@yp/web-academy...
```

---

## Type Checking

### Check All
```bash
pnpm typecheck
```

### Check Single App
```bash
pnpm turbo run typecheck --filter=@yp/web-academy
```

---

## Linting

### Lint All
```bash
pnpm lint
```

### Lint Single App
```bash
pnpm turbo run lint --filter=@yp/web-academy
```

---

## Convex (Database)

### Start Dev Server
```bash
cd packages/yp-alpha && npx convex dev
```

### Deploy to Production
```bash
cd packages/yp-alpha && npx convex deploy
```

### Open Dashboard
```bash
cd packages/yp-alpha && npx convex dashboard
```

### Push Schema Only
```bash
cd packages/yp-alpha && npx convex dev --once
```

---

## Git

### Create Feature Branch
```bash
git checkout -b feat/my-feature
```

### Conventional Commit
```bash
git commit -m "feat(academy): add voice onboarding"
git commit -m "fix(shop): resolve cart hydration"
git commit -m "chore: update dependencies"
```

### Sync with Master
```bash
git fetch origin && git rebase origin/master
```

---

## Port Management

### Check What's Running
```bash
lsof -i -P | grep LISTEN
```

### Kill Port
```bash
kill -9 $(lsof -t -i :3003)
```

### Kill All Node
```bash
pkill -f node
```

---

## Deployment

### Academy (Vercel)
```bash
# Auto-deploys on push to master
git push origin master
```

### Shop (Oxygen)
```bash
cd apps/shop && pnpm deploy
```

### Marketing (Cloudflare)
```bash
# Auto-deploys on push to master
git push origin master
```

---

## Debugging

### Next.js Debug Mode
```bash
NODE_OPTIONS='--inspect' pnpm turbo run dev --filter=@yp/web-academy
```

### Clear Next.js Cache
```bash
rm -rf apps/web-academy/.next
```

### Clear All Caches
```bash
pnpm turbo run clean
rm -rf node_modules/.cache
```

### Clear Turbo Cache
```bash
rm -rf .turbo
```

---

## Package Management

### Add Dependency to App
```bash
pnpm add lodash --filter @yp/web-academy
```

### Add Dev Dependency
```bash
pnpm add -D @types/lodash --filter @yp/web-academy
```

### Add Workspace Dependency
```bash
pnpm add @yp/ui --filter @yp/web-academy --workspace
```

### Remove Dependency
```bash
pnpm remove lodash --filter @yp/web-academy
```

---

## Testing (Future)

```bash
# Run all tests
pnpm test

# Run tests for app
pnpm turbo run test --filter=@yp/web-academy

# Watch mode
pnpm turbo run test --filter=@yp/web-academy -- --watch
```

---

*Updated: January 7, 2026*
