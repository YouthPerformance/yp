# Release Wolf Checklist

Manual reference for when you need to verify deployment readiness without running the full automation.

---

## Pre-Flight Checklist

### Security (CRITICAL - Do NOT skip)

- [ ] No `process.env.SHOPIFY_ADMIN_TOKEN` in any component file
- [ ] No `OPENAI_API_KEY` in client-side code
- [ ] No `STRIPE_SECRET_KEY` exposed to browser
- [ ] All sensitive operations happen in server-side code only (`/api/`, server components)
- [ ] `.env` files are in `.gitignore`
- [ ] No hardcoded API keys in the codebase

### Performance

- [ ] Lighthouse Performance score >= 90
- [ ] LCP (Largest Contentful Paint) < 2.5s
- [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] FID (First Input Delay) < 100ms
- [ ] Images are optimized and use next/image or equivalent
- [ ] JavaScript bundle is code-split appropriately

### Links

- [ ] All Header/Nav links return 200
- [ ] No 404s on internal pages
- [ ] External links open in new tab where appropriate
- [ ] Shop/Purchase links work correctly
- [ ] Social media links are correct

### Visual

- [ ] Mobile responsive (375px width)
- [ ] Primary CTA visible above the fold
- [ ] No elements overlapping the Buy/CTA button
- [ ] Chat widget doesn't block critical UI
- [ ] Footer links visible and clickable

---

## Quick Commands

```bash
# Run full check
python .claude/skills/prodcheck/scripts/qa_wolf.py

# Security only
python .claude/skills/prodcheck/scripts/qa_wolf.py --security-only

# Link audit only
python .claude/skills/prodcheck/scripts/qa_wolf.py --links-only

# Specific port
python .claude/skills/prodcheck/scripts/qa_wolf.py --port 3001

# Skip Lighthouse (faster)
python .claude/skills/prodcheck/scripts/qa_wolf.py --no-lighthouse
```

---

## GO / NO-GO Criteria

| Check | GO Condition | NO-GO Condition |
|-------|--------------|-----------------|
| Security | Zero secrets in client code | Any secret exposure |
| Lighthouse | Performance >= 90 | Performance < 90 |
| Links | All return 200 | Any return 404/500 |
| Visual | CTA visible on mobile | CTA obscured/missing |

**Rule:** If ANY check is NO-GO, the entire release is blocked.

---

## Emergency Override

In rare cases where you need to deploy despite warnings:

1. Document the risk in the PR description
2. Get explicit approval from team lead
3. Set a reminder to fix the issue within 24 hours
4. Never override a Security NO-GO
