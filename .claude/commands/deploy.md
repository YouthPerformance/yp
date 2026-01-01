---
description: Deploy an app to production with pre-flight checks
---

# Deploy Command

Deploy an app to production after running pre-flight checks.

## Usage

```
/deploy [app]
```

Where `[app]` is one of: `marketing`, `academy`, `shop`, `neoball`

## Pre-Flight Checks

Before deploying, automatically run:

1. **Security Scan**
   - Check for exposed secrets in client code
   - Verify .env files are gitignored

2. **Build Test**
   - Run `pnpm build` for the target app
   - Ensure no TypeScript errors

3. **Link Audit** (for marketing)
   - Verify all navigation links resolve

## Deploy Commands

### Marketing (Cloudflare Pages)
```bash
cd apps/marketing
pnpm build
npx wrangler pages deploy dist --project-name=yp-landing --commit-dirty=true --branch=main
```

### Academy (Vercel)
```bash
# Auto-deploys on push to main
# For manual preview:
cd apps/web-academy
vercel
```

### Shop (Shopify Oxygen)
```bash
cd apps/shop
shopify hydrogen deploy
```

### NeoBall (Vercel)
```bash
# Auto-deploys on push to main
cd apps/neoball-lp
vercel
```

## Post-Deploy

After successful deploy:

1. Verify the live URL loads correctly
2. Test one critical user flow
3. Update `.claude/docs/changelog.md` if not already done
4. Update `.claude/docs/project_status.md` with deploy status

## Output Format

```
## Deploy: [app]

### Pre-Flight
- [x] Security scan: PASS
- [x] Build: PASS
- [x] Links: PASS

### Deploy
- Platform: [platform]
- URL: [production-url]
- Status: SUCCESS

### Post-Deploy
- [ ] Verify live site
- [ ] Test critical flow
- [ ] Update changelog
```
