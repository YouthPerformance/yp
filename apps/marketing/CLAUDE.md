# marketing

> Landing page and marketing site.
> **URL:** youthperformance.com
> **Deploy:** Cloudflare Pages
> **Auth:** None - all auth redirects to app.youthperformance.com

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Vite + React |
| Router | React Router |
| Styling | CSS (custom) |
| Deploy | Cloudflare Pages |

---

## Project Structure

```
src/
├── pages/              # Route pages
│   ├── Home.jsx        # Landing page
│   ├── Quiz.jsx        # Movement assessment
│   ├── MeetWolf.jsx    # AI coach intro
│   ├── Dashboard.jsx   # User dashboard
│   ├── Mission.jsx     # Manifesto
│   └── ...
├── components/         # Shared components
│   ├── Header.jsx      # Glass morphic nav
│   ├── CardNav.jsx     # Room cards
│   └── Footer.jsx      # Wolf footer
├── context/            # React contexts
├── config/             # Configuration
├── App.jsx             # React Router setup
└── main.jsx            # Entry point
```

---

## Brand Assets

**All brand assets are centralized in `packages/brand-assets/`.** Do not add new assets to `public/` - import from the shared package instead.

```typescript
import { LOGOS, IMAGES, VIDEOS } from '@yp/brand-assets';

// Usage
<img src={LOGOS.primary.svg} alt="YP Logo" />
<video src={VIDEOS.loaders.main.webm} />
```

### Existing assets in `public/` are legacy
Assets in `public/logo/`, `public/images/`, etc. are duplicates. Use `@yp/brand-assets` for new work.

---

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Landing page |
| `/quiz` | Movement assessment (6 questions) |
| `/meet-wolf` | AI coach introduction |
| `/mission` | Manifesto |
| `/offer` | Subscription offer |
| `/faq` | FAQ |

---

## Development

```bash
# Start dev server (port 3004)
pnpm dev

# Build
pnpm build

# Deploy
npx wrangler pages deploy dist --project-name=yp-landing
```

---

## Environment Variables

```bash
VITE_APP_URL=https://app.youthperformance.com   # Main app URL for redirects
VITE_POSTHOG_KEY=                                # Analytics (optional)
```

---

## Movement Quiz

6-question assessment to diagnose dysfunction:
1. Ankle mobility
2. Hip flexibility
3. Core stability
4. Shoulder mobility
5. Balance
6. Overall readiness

Results feed into athlete profile for personalized recommendations.
