# GitHub Environments & Secrets Configuration

This document describes the required GitHub Environments, Secrets, and Variables for the YouthPerformance CI/CD pipeline.

---

## Environments Setup

### 1. Create Environments in GitHub

Go to **Settings → Environments** and create:

| Environment | Purpose | Protection Rules |
|-------------|---------|------------------|
| `staging` | Auto-deploy on main merge | None (auto-deploy) |
| `production` | Manual deploy with approval | Required reviewers, Wait timer (optional) |

### 2. Production Environment Protection

For the `production` environment, configure:

- **Required reviewers**: Add 1-2 team members who must approve
- **Wait timer**: Optional (e.g., 5 minutes to allow cancellation)
- **Deployment branches**: `main` only

---

## Required Secrets

### Repository Secrets (Settings → Secrets → Actions)

| Secret | Description | Where to get it |
|--------|-------------|-----------------|
| `ANTHROPIC_API_KEY` | Claude API key | [console.anthropic.com](https://console.anthropic.com) |
| `CONVEX_DEPLOY_KEY_STAGING` | Convex staging deploy key | Convex Dashboard → Settings → Deploy Keys |
| `CONVEX_DEPLOY_KEY_PROD` | Convex production deploy key | Convex Dashboard → Settings → Deploy Keys |
| `VERCEL_TOKEN` | Vercel API token | [vercel.com/account/tokens](https://vercel.com/account/tokens) |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel Dashboard → Settings |
| `VERCEL_PROJECT_ID_WEB_ACADEMY` | Vercel project ID for web-academy | `.vercel/project.json` |
| `CLOUDFLARE_API_TOKEN` | Cloudflare API token | [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) |
| `PUBLIC_STOREFRONT_API_TOKEN` | Shopify Storefront API token | Shopify Admin → Apps → Hydrogen |
| `OXYGEN_DEPLOYMENT_TOKEN_1000078410` | Shopify Oxygen deploy token | Shopify Admin → Hydrogen app |
| `TURBO_TOKEN` | Turborepo remote cache token | [vercel.com/account/tokens](https://vercel.com/account/tokens) |

### Optional Secrets

| Secret | Description | When needed |
|--------|-------------|-------------|
| `BETTER_AUTH_SECRET` | BetterAuth session signing key | Server-side auth (Academy) |
| `STRIPE_SECRET_KEY` | Stripe secret key | Webhook testing |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing | Webhook verification |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | OAuth sign-in |
| `GOOGLE_CLIENT_SECRET` | Google OAuth secret | OAuth sign-in |
| `APPLE_CLIENT_ID` | Apple OAuth client ID | OAuth sign-in |
| `APPLE_CLIENT_SECRET` | Apple OAuth secret | OAuth sign-in |

---

## Required Variables

### Repository Variables (Settings → Variables → Actions)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex production URL | `https://wry-cuttlefish-942.convex.cloud` |
| `NEXT_PUBLIC_CONVEX_URL_STAGING` | Convex staging URL | `https://staging-xxx.convex.cloud` |
| `NEXT_PUBLIC_SITE_URL` | Academy production URL | `https://academy.youthperformance.com` |
| `PUBLIC_STORE_DOMAIN` | Shopify store domain | `youthperformance.myshopify.com` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID | Found in CF dashboard URL |
| `TURBO_TEAM` | Turborepo team name | `youthperformance` |

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CI/CD Pipeline                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  PR Created/Updated                                             │
│       │                                                         │
│       ▼                                                         │
│  ┌─────────┐                                                    │
│  │   CI    │  ← ci.yml                                          │
│  │ (Gate)  │    - Typecheck, Lint, Test                         │
│  └────┬────┘    - Security scan                                 │
│       │         - Build verification                            │
│       │                                                         │
│       ▼                                                         │
│  PR Merged to Main                                              │
│       │                                                         │
│       ▼                                                         │
│  ┌──────────────┐                                               │
│  │   Staging    │  ← deploy-staging.yml                         │
│  │   Deploy     │    - Auto-detect changed apps                 │
│  │  (Auto)      │    - Deploy to staging environment            │
│  └──────┬───────┘                                               │
│         │                                                       │
│         ▼                                                       │
│  Manual Trigger (workflow_dispatch)                             │
│         │                                                       │
│         ▼                                                       │
│  ┌──────────────┐                                               │
│  │  Production  │  ← deploy-prod.yml                            │
│  │   Deploy     │    - Pre-flight checks                        │
│  │  (Manual)    │    - Requires environment approval            │
│  └──────────────┘    - Full deployment                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Release Process

### 1. Create Release

Run the **Release** workflow manually:

```
Actions → Release → Run workflow
  - Version bump: patch/minor/major
  - Release notes: "What changed"
```

This creates a release PR with:
- Version bump in `package.json`
- Updated `CHANGELOG.md`
- Auto-generated PR description

### 2. Review & Merge

Review the release PR and merge when ready.

### 3. Tag Created

The **On Release Merge** workflow automatically:
- Creates a git tag (e.g., `v1.2.3`)
- Creates a GitHub Release
- Staging deploys automatically

### 4. Production Deploy

When ready for production:
- Go to **Actions → Deploy to Production**
- Click **Run workflow**
- Select which apps to deploy
- Wait for environment approval
- Monitor deployment

---

## Deployment URLs

| App | Staging | Production |
|-----|---------|------------|
| Web Academy | staging.academy.youthperformance.com | academy.youthperformance.com |
| Marketing | staging.youthperformance.com | youthperformance.com |
| Shop | preview-shop.youthperformance.com | shop.youthperformance.com |
| Convex | staging project | production project |

---

## Troubleshooting

### Common Issues

**1. "CONVEX_DEPLOY_KEY not found"**
- Add `CONVEX_DEPLOY_KEY_STAGING` and `CONVEX_DEPLOY_KEY_PROD` to repository secrets
- Get keys from Convex Dashboard → Settings → Deploy Keys

**2. "Vercel deployment failed"**
- Verify `VERCEL_TOKEN`, `VERCEL_ORG_ID`, `VERCEL_PROJECT_ID_WEB_ACADEMY`
- Check Vercel dashboard for detailed error

**3. "Cloudflare deployment failed"**
- Verify `CLOUDFLARE_API_TOKEN` has Pages:Edit permission
- Check `CLOUDFLARE_ACCOUNT_ID` is correct

**4. "Production deployment stuck on approval"**
- Check **Settings → Environments → production**
- Verify required reviewers are set
- Approve the deployment in the Actions run

**5. "Build failed with missing env vars"**
- Add missing variables to **Settings → Variables → Actions**
- Check both Secrets and Variables sections

---

## Security Notes

1. **Never commit secrets** - Use GitHub Secrets only
2. **Rotate keys regularly** - Update secrets quarterly
3. **Use environment protection** - Require approvals for production
4. **Audit deployments** - Review Actions logs for anomalies
5. **Limit secret access** - Only give secrets to required workflows

---

*Last updated: January 2026*
