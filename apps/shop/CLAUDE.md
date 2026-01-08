# shop

> E-commerce store for NeoBall and merch.
> **URL:** shop.youthperformance.com
> **Deploy:** Shopify Oxygen

---

## Stack

| Layer | Technology |
|-------|------------|
| Framework | Hydrogen (Remix) |
| Data | Shopify Storefront GraphQL API |
| Deploy | Shopify Oxygen |
| Styling | Tailwind CSS |

---

## Project Structure

```
app/
├── routes/                 # Remix file-based routes
│   ├── _index.tsx          # Homepage
│   ├── products._index.tsx # Products listing
│   ├── products.$handle.tsx # Product detail
│   ├── collections.$handle.tsx # Collection
│   └── cart.tsx            # Shopping cart
├── components/
│   ├── Layout.tsx          # Main wrapper
│   ├── HeroSection.tsx     # Homepage hero
│   ├── ProductCard.tsx     # Product display
│   └── Cart*.tsx           # Cart components
├── lib/
│   ├── session.server.ts   # Server session
│   └── env.server.ts       # Env validation (Zod)
└── styles/
    └── app.css             # Global styles
```

---

## Key Routes

| Route | Purpose |
|-------|---------|
| `/` | Homepage with hero |
| `/products` | All products |
| `/products/:handle` | Product detail |
| `/collections/:handle` | Collection |
| `/cart` | Shopping cart |

---

## Development

```bash
# Start dev server
shopify hydrogen dev

# Build
pnpm build

# Deploy
shopify hydrogen deploy
```

---

## Environment Variables

```bash
# Required
PUBLIC_STORE_DOMAIN=
PUBLIC_STOREFRONT_API_TOKEN=
PUBLIC_STOREFRONT_API_VERSION=2024-10

# For deployment
SHOPIFY_HYDROGEN_DEPLOYMENT_TOKEN=
```

---

## Shopify Integration

Uses Storefront API for:
- Product queries
- Collection queries
- Cart mutations
- Checkout

```typescript
// Example query
const { product } = await storefront.query(PRODUCT_QUERY, {
  variables: { handle: params.handle }
});
```

---

## Notes

- Products managed in Shopify Admin
- Oxygen deployment triggered by GitHub Actions
- Preview deployments available for PRs
