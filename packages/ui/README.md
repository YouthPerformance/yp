# @yp/ui - The Design System

> **"One Brand, One Header, One Experience"**

Shared UI components and tokens for the YP ecosystem. Every app uses these components to maintain visual consistency.

---

## Mandatory Components

### Header (REQUIRED on all pages)

**Every public-facing page MUST use the `<Header />` component.**

```tsx
import { Header } from "@yp/ui";

// Minimal usage - inherits all brand defaults
<Header />

// With custom links
<Header
  links={[
    { label: "STORY", href: "#story" },
    { label: "SHOP", href: "https://shop.youthperformance.com" },
  ]}
  showCart={false}  // Hide for non-ecommerce pages
/>
```

#### LOCKED Header Config (January 2026)

**All YP apps MUST use this exact configuration:**

```tsx
<Header
  logoHref="/"
  logoSrc="/logo/yp-logo.png"  // Brushed metal YP logo
  hideSubtitle                  // No "WOLF PACK" text
  showCart={false}              // Unless e-commerce
  // showBetaBadge={true}       // Default - NEVER set to false
  links={[...]}                 // App-specific links OK
/>
```

**Logo file:** `/logo/yp-logo.png` must exist in each app's `public/` folder.

#### Header Props Reference
| Prop | Locked Value | Can Customize? |
|------|--------------|----------------|
| `logoSrc` | `/logo/yp-logo.png` | NO |
| `hideSubtitle` | `true` | NO |
| `showBetaBadge` | `true` (default) | NO |
| `betaBadgeVariant` | `"glow"` (default) | NO |
| `logoHref` | `"/"` | YES - for app routing |
| `showCart` | varies | YES - true for shop only |
| `showLogin` | varies | YES - per app needs |
| `links` | varies | YES - app-specific nav |

#### Anti-Patterns
```tsx
// DON'T - creates brand inconsistency
<Header showBetaBadge={false} />
<Header hideSubtitle />

// DON'T - custom navigation without Header
<nav className="my-custom-nav">...</nav>

// DO - use Header with minimal overrides
<Header showCart={false} />
```

---

## Available Components

| Component | Status | Usage |
|-----------|--------|-------|
| `Header` | **Mandatory** | All pages |
| `BetaBadge` | Internal | Used by Header |
| `Button` | Available | CTAs, forms |

---

## Design Tokens

```tsx
import { colors, fonts, spacing, radii } from "@yp/ui";

// Colors
colors.wolfBlack    // #0A0A0A
colors.neonGreen    // #39FF14
colors.electricBlue // #00D4FF

// Fonts
fonts.heading // Power Grotesk
fonts.body    // Inter
fonts.mono    // JetBrains Mono
```

---

## Brand Constants (Hardcoded in Header)

| Token | Value | Usage |
|-------|-------|-------|
| YP Cyan | `#00F6E0` | Primary accent, CTAs, BetaBadge |
| Glass BG | `rgba(255,255,255,0.08)` | Header background |
| Border Radius | `16px` | Header container |

---

## Governance Rules

### For Claude/AI Agents

When generating new pages or components:

1. **ALWAYS** import and use `<Header />` from `@yp/ui`
2. **NEVER** create custom navigation components
3. **NEVER** set `showBetaBadge={false}`
4. **NEVER** set `hideSubtitle={true}`
5. **ONLY** customize: `links`, `showCart`, `showLogin`, `logoHref`

### For Developers

1. Header changes go in `packages/ui/src/components/Header.tsx`
2. New tokens go in `packages/ui/src/tokens.ts`
3. Run `pnpm build` in packages/ui after changes
4. All apps consuming @yp/ui get updates automatically

---

## App Integration

### Next.js (Academy)
```tsx
// app/my-page/page.tsx
import { Header } from "@yp/ui";

export default function MyPage() {
  return (
    <>
      <Header showCart={false} />
      <main>...</main>
    </>
  );
}
```

### Hydrogen/Remix (Shop)
```tsx
// app/routes/_index.tsx
import { Header } from "@yp/ui";

export default function Index() {
  return (
    <>
      <Header showCart cartCount={3} />
      <main>...</main>
    </>
  );
}
```

### Astro (NeoBall, Playbook)
```astro
---
// Use React component in Astro
import { Header } from "@yp/ui";
---
<Header client:load showCart={false} />
```

---

## Adding New Components

1. Create component in `packages/ui/src/components/`
2. Export from `packages/ui/src/index.ts`
3. Document in this README
4. Add to governance rules if mandatory

---

*@yp/ui v0.1.0 - Wolf Pack Design System*
