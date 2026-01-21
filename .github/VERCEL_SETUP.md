# Vercel Auto-Deploy Setup Guide

This guide will help you set up automatic deployments to Vercel whenever you push to master/main.

## Step 1: Get Vercel Credentials

### Get your Vercel Token
1. Go to [Vercel Account Settings](https://vercel.com/account/tokens)
2. Click "Create Token"
3. Name it "GitHub Actions"
4. Copy the token (you won't see it again!)

### Get your Org ID and Project ID
1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to `apps/web-academy`
3. Run `vercel link`
4. Follow prompts to link to your Vercel account
5. After linking, check `.vercel/project.json` for:
   - `orgId` (your Vercel Org ID)
   - `projectId` (your Vercel Project ID)

## Step 2: Add GitHub Secrets

Go to your GitHub repo -> Settings -> Secrets and variables -> Actions

Add these 3 secrets:

| Secret Name | Value |
|-------------|-------|
| `VERCEL_TOKEN` | Your Vercel token from Step 1 |
| `VERCEL_ORG_ID` | Your orgId from `.vercel/project.json` |
| `VERCEL_PROJECT_ID` | Your projectId from `.vercel/project.json` |

## Step 3: Test It!

Push any change to `apps/web-academy/` and watch the action run:

```bash
git add .
git commit -m "Test auto-deploy"
git push origin master
```

## What Happens

- **Push to master/main**: Deploys to production
- **Pull Request**: Deploys preview and comments the URL on the PR
