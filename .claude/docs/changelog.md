# Changelog

All notable changes to the YP platform.

---

## [Unreleased]

### Added
- Wolf Pack Protocol (CLAUDE.md) for agentic workflow
- Automated documentation in `.claude/docs/`
- Custom slash commands for common tasks

### Security
- Identified exposed Shopify tokens (pending rotation)
- Identified hardcoded JWT fallback (pending removal)

---

## [2026-01-01] - Pre-Launch Audit

### Added
- **Mission/Manifesto Page** (`/mission`)
  - Scroll-driven animations with Framer Motion
  - Word-by-word text reveal effect
  - Progress bar tracking scroll position
  - 4 full-bleed academy images with parallax
  - "JOIN THE RESISTANCE" CTA

- **ONBOARDING.md** documentation
  - Complete question reference for all flows
  - Marketing Quiz (6 questions)
  - Academy onboarding (5 steps)
  - Profile settings (4 fields)

### Changed
- **Navigation Links**
  - Performance Center: `/programs` → `/start`
  - Courts: `/courts` → `https://neoball.co` (external)

- **Footer Links**
  - Removed broken `/science` → Now `/start`
  - Removed broken `/stories` → Now `/library`

### Fixed
- Wolf logo path in MascotReveal (`/logo/wolffront.png`)
- Footer logo path (`/logo/yp-logo.png`)

### Deployed
- Marketing site to Cloudflare Pages (yp-landing)
- Academy live at app.youthperformance.com
- Shop live at shop.youthperformance.com

---

## [2025-12-31] - Academy DNS Configuration

### Added
- Configured app.youthperformance.com DNS via Cloudflare
- SSL certificate provisioned

### Fixed
- Academy 522 error (was pointing to non-existent CF Worker)

---

## [2025-12-30] - Shop Hero Animations

### Added
- Horizontal scroll page with 3D basketball
- Hero section with layered images
- Glass morphic header styling
- Shopify Supply-style animations

### Changed
- Shop hero redesign with new headline
- Product showcase with sticky positioning

---

## [2025-12-29] - Marketing Site Launch

### Added
- Full marketing site content
- Wolf AI chat integration
- Movement Check Quiz
- Parent Settings page
- Clerk authentication

### Deployed
- Marketing to Cloudflare Pages
- Replaced "Coming Soon" teaser

---

## [2025-12-28] - Oxygen CI/CD Fix

### Fixed
- `fix(ci): Remove --env flag for CI deploy` (#4)
- `fix(shop): Add --no-lockfile-check to build command` (#3)
- `fix(ci): Use turbo build for monorepo Oxygen deploy` (#2)

---

## Version History

| Version | Date | Highlights |
|---------|------|------------|
| 0.8.0 | Jan 1, 2026 | Pre-launch audit, Mission page |
| 0.7.0 | Dec 31, 2025 | Academy DNS, full deployment |
| 0.6.0 | Dec 30, 2025 | Shop hero animations |
| 0.5.0 | Dec 29, 2025 | Marketing launch |
| 0.4.0 | Dec 28, 2025 | CI/CD fixes |

---

*Format: [YYYY-MM-DD] - Release Name*
*Maintained by: Wolf Pack Protocol*
