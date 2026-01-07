# YP Monorepo Comprehensive Audit Report

> **Generated:** 2026-01-07
> **Phase:** Full Code Audit
> **Overall Status:** 🟠 NEEDS ATTENTION BEFORE PRODUCTION
> **Auditor:** Claude Code (Opus 4.5)

---

## Executive Summary

| Category | Score | Status | Critical Issues |
|----------|-------|--------|-----------------|
| **Security** | 60% | 🔴 CRITICAL | 4 critical, 5 high severity |
| **Dependencies** | 75% | 🟡 MEDIUM | 2 critical version conflicts |
| **Code Quality** | 55% | 🔴 CRITICAL | 0% test coverage, 10 TODOs blocking features |
| **Configuration** | 69% | 🟡 MEDIUM | CI non-blocking, missing env docs |
| **Architecture** | 80% | ✅ GOOD | Clean monorepo structure |
| **OVERALL** | **68%** | 🟠 **NOT PRODUCTION READY** | 16 security issues total |

---

## 1. Security Audit

### Critical Severity (4 Issues)

| # | Issue | File | Line | Description |
|---|-------|------|------|-------------|
| 1 | **XSS: Unsafe innerHTML** | `apps/marketing/src/components/PortalFrame.jsx` | 72-78 | Direct innerHTML assignment without sanitization |
| 2 | **XSS: dangerouslySetInnerHTML** | `apps/shop/app/routes/products.$handle.tsx` | 64 | FAQ answers injected unsafely |
| 3 | **Timing Attack** | `apps/web-academy/src/lib/uplink-auth.ts` | 33 | Token comparison using `===` instead of `crypto.timingSafeEqual()` |
| 4 | **CORS Wildcard** | `apps/web-academy/src/app/api/uplink/campaign/route.ts` | 159 | `Access-Control-Allow-Origin: "*"` allows any origin |

### High Severity (5 Issues)

| # | Issue | File | Lines | Description |
|---|-------|------|-------|-------------|
| 1 | JWT in localStorage | `apps/marketing/src/context/AuthContext.jsx` | 9,14,55,74 | Tokens vulnerable to XSS attacks |
| 2 | Unsafe JSON.parse | `apps/marketing/src/lib/analytics.js` | - | No try-catch around localStorage parse |
| 3 | Optional webhook secret | `apps/web-academy/src/lib/env.ts` | 26 | STRIPE_WEBHOOK_SECRET should be required |
| 4 | Unvalidated origin | `apps/web-academy/src/app/api/uplink/campaign/route.ts` | 129 | Origin header used in URL without validation |
| 5 | Token rotation pending | `packages/yp-alpha/.env` | - | Exposed Shopify tokens need rotation |

### Medium Severity (4 Issues)

- API key error disclosure in Stripe routes
- CORS env variable not validated
- Storage XSS potential in analytics
- Missing auth validation in some routes

### Secure Patterns Found ✅

- ✅ Environment variables properly validated with Zod schemas
- ✅ Proper .gitignore excludes all .env files
- ✅ Parameterized SQL queries (no injection risks)
- ✅ Bcrypt password hashing implemented correctly
- ✅ Stripe webhook signature verification working
- ✅ No hardcoded API keys in source code

---

## 2. Dependency Audit

### Critical Version Conflicts

| Package | Conflict | Apps Affected | Risk |
|---------|----------|---------------|------|
| **Vite** | v5 vs v6 | marketing, shop | Build compatibility |
| **Framer Motion** | v10 vs v11 | marketing, web-academy | Animation API mismatch |

### Version Inconsistencies

| Package | Versions Found | Recommendation |
|---------|---------------|----------------|
| react | ^18.2.0, ^18.3.1 | Standardize to ^18.3.1 |
| tailwindcss | ^3.4.0, ^3.4.17 | Standardize to ^3.4.17 |
| typescript | ^5.3.0, ^5 | Pin to ^5.3.0 |
| postcss | ^8.4.32, ^8.4.49, ^8 | Pin to ^8.4.49 |
| autoprefixer | ^10.4.16, ^10.4.20, ^10 | Pin to ^10.4.20 |

### Dependency Statistics

```
Total Packages:        146
Peer Dependencies:     All satisfied ✓
Lockfile:             Valid (pnpm v9.0)
Known CVEs:           0 detected
Circular Dependencies: None
```

---

## 3. Code Quality Audit

### Linting Status

| App | ESLint | Prettier | Status |
|-----|--------|----------|--------|
| web-academy | ✅ .eslintrc.json | ❌ No | Configured |
| marketing | ❌ No config | ❌ No | Manual only |
| shop | ❌ No | ❌ No | Uncovered |
| yp-alpha | ❌ No | ❌ No | Uncovered |
| ui | ❌ No | ❌ No | Uncovered |

**Root-level ESLint:** ❌ Missing (should enforce monorepo standards)

### TypeScript Strictness

All packages have `strict: true` ✅

### Code Smells Found

| Type | Count | Severity |
|------|-------|----------|
| console.log statements | 56 | 🟡 Medium |
| TODO/FIXME comments | 10 | 🔴 Critical (blocking features) |
| `any` type usage | 31 | 🟡 Medium |
| Async without try/catch | ~50% | 🟡 Medium |

### Critical TODOs Blocking Features

```
apps/web-academy/src/contexts/OnboardingContext.tsx:197   → Supabase validation
apps/web-academy/src/contexts/OnboardingContext.tsx:237   → Supabase signup
apps/web-academy/src/app/(main)/workout/player/page.tsx:163 → Form tracking
apps/web-academy/src/components/screens/onboarding/ParentSignup.tsx:104 → Actual signup
apps/web-academy/src/components/screens/onboarding/ParentSignup.tsx:113 → OAuth
apps/web-academy/src/app/(onboarding)/role/page.tsx:20    → Parent flow
apps/web-academy/src/app/(onboarding)/role/page.tsx:25    → Sign in
apps/marketing/src/pages/Offer.jsx:23                     → Stripe checkout
apps/marketing/src/components/SearchOverlay.jsx:36        → Search API
```

### Test Coverage

| Metric | Status |
|--------|--------|
| Test Files | 0 |
| Test Framework | Not installed |
| Coverage Config | Not configured |
| CI Test Job | Commented out |

**Test Coverage: 0%** 🔴

---

## 4. Configuration Audit

### Deployment Configs

| App | Config | Build Command | Issues |
|-----|--------|---------------|--------|
| web-academy | ✅ vercel.json | turbo build | Missing CONVEX_URL secret |
| shop | ✅ vite.config.ts | shopify hydrogen | Duplicate workflow files |
| marketing | ⚠️ vercel.json | pnpm build | **Not using turbo** |
| neoball-lp | ✅ vercel.json | turbo build | No .env.example |

### Environment Variable Documentation

| App | .env.example | Status |
|-----|--------------|--------|
| web-academy | ✅ Comprehensive | All vars documented |
| shop | ✅ Good | Well documented |
| marketing | ❌ **Missing** | No env documentation |
| neoball-lp | ❌ **Missing** | No env documentation |

### CI/CD Pipeline Issues

```yaml
# .github/workflows/ci.yml - All gates NON-BLOCKING!
- typecheck: continue-on-error: true   # Line 37
- lint: continue-on-error: true        # Line 41
- build: continue-on-error: true       # Line 45
```

**Impact:** Broken builds can merge to main!

### GitHub Secrets Missing

- `CONVEX_URL` - Required for web-academy build

---

## 5. Architecture Audit

### Monorepo Structure ✅ Good

```
/home/user/yp
├── apps/
│   ├── marketing/      (Vite + React, JavaScript)
│   ├── web-academy/    (Next.js 15, TypeScript)
│   ├── shop/           (Hydrogen + Remix, TypeScript)
│   └── neoball-lp/     (Astro, TypeScript)
├── packages/
│   ├── ui/             (Shared components)
│   └── yp-alpha/       (Core library + Convex)
└── turbo.json          (Build orchestration)
```

### Shared Code Patterns ✅

- `@yp/ui`: workspace:* - All apps consume correctly
- `@yp/alpha`: workspace:* - Shared library working
- Convex schema centralized in `packages/yp-alpha/convex/schema.ts`

### Architecture Issues

| Issue | Location | Impact |
|-------|----------|--------|
| Duplicate schema | marketing/convex/schema.ts | Should use yp-alpha |
| Marketing is JS-only | apps/marketing/ | Misses type safety |
| Root vercel.json redundant | /vercel.json | Confusing deployments |

---

## 6. Feature Completeness

| Feature | web-academy | shop | marketing | neoball-lp |
|---------|-------------|------|-----------|------------|
| Auth/Login | 🟡 Partial | N/A | 🟡 Partial | N/A |
| Payment | 🔴 TODO | 🔴 Stub | 🔴 TODO | N/A |
| Cart | N/A | 🔴 Null | N/A | N/A |
| Analytics | 🔴 None | 🔴 None | 🟡 Ready | 🔴 None |
| Legal Pages | 🔴 Missing | 🔴 Missing | 🔴 Missing | 🔴 Missing |
| Error Boundary | 🔴 Missing | 🔴 Missing | 🟡 Partial | ✅ Good |
| SEO | 🟡 Partial | 🟡 Partial | 🟡 Partial | 🟡 Partial |

---

## 7. Priority Fixes

### P0 - Critical (Block Deployment)

1. **Rotate exposed Shopify tokens** - Security breach risk
2. **Fix timing attack in uplink-auth.ts** - Use `crypto.timingSafeEqual()`
3. **Fix CORS wildcard** - Specify allowed origins
4. **Add GitHub secret CONVEX_URL** - Unblocks CI
5. **Remove continue-on-error from CI** - Enforce quality gates

### P1 - High (Before Launch)

1. Create .env.example for marketing and neoball-lp
2. Fix marketing vercel.json build command to use turbo
3. Standardize Vite and Framer Motion versions
4. Add root ESLint + Prettier config
5. Migrate JWT storage from localStorage to httpOnly cookies
6. Make STRIPE_WEBHOOK_SECRET required

### P2 - Medium (Should Have)

1. Add Vitest test framework to all apps
2. Implement error boundaries
3. Remove console.log statements (56 instances)
4. Replace `any` types with proper interfaces (31 instances)
5. Add pre-commit hooks (Husky + lint-staged)

### P3 - Low (Nice to Have)

1. Standardize TypeScript targets across apps
2. Add analytics to all apps
3. Complete legal pages (terms, privacy)
4. Delete duplicate Oxygen workflow file

---

## 8. Recommended Actions

### Immediate (Today)

```bash
# 1. Rotate compromised tokens
# User must rotate Shopify tokens in Shopify admin

# 2. Add GitHub secret
# Add CONVEX_URL to GitHub repository secrets

# 3. Fix timing vulnerability
# In apps/web-academy/src/lib/uplink-auth.ts:33
# Replace: return token === expectedToken
# With: return crypto.timingSafeEqual(Buffer.from(token), Buffer.from(expectedToken))
```

### This Sprint

1. Remove `continue-on-error: true` from CI workflow
2. Create .env.example files for marketing and neoball-lp
3. Fix marketing vercel.json build command
4. Add root ESLint configuration
5. Implement TODO features (Stripe, OAuth, parent flow)

### Next Sprint

1. Set up Vitest and write initial tests
2. Add pre-commit hooks
3. Migrate localStorage JWT to cookies
4. Complete legal pages

---

## 9. Audit Statistics

```
Security Issues:       16 total (4 critical, 5 high, 4 medium, 3 low)
Dependency Conflicts:  2 critical, 6 minor
Code Quality Issues:   97 (56 console.logs, 31 any types, 10 TODOs)
Config Issues:         8 (3 blocking, 5 non-blocking)
Test Coverage:         0%

Files Scanned:         ~200
Total Packages:        146
CI Status:             ⚠️ Non-blocking (all checks pass regardless of errors)
```

---

## 10. Conclusion

The YouthPerformance codebase has a **solid architectural foundation** with proper monorepo structure and modern tooling. However, there are **critical security and quality issues** that must be addressed before production deployment:

1. **Security vulnerabilities** need immediate attention (XSS, timing attacks, CORS)
2. **Zero test coverage** is a significant risk
3. **CI/CD gates are non-blocking** - quality not enforced
4. **Missing feature implementations** (Stripe, OAuth, cart) marked with TODOs

**Recommendation:** Address P0 issues immediately, then systematically work through P1/P2 before launch.

---

*Report generated by comprehensive audit on 2026-01-07*
*Branch: claude/code-audit-Ybxdp*
