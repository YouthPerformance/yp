# Checkout Subdomain Setup Guide

> **Goal:** `shop.youthperformance.com` serves Hydrogen, `checkout.youthperformance.com` handles Shopify checkout

## Why This Architecture?

- **Hydrogen** = Your custom React storefront (fast, branded experience)
- **Shopify Checkout** = Secure, PCI-compliant payment processing
- **Separation** = Best of both worlds, like Gymshark and Allbirds do

## Step-by-Step Setup

### 1. DNS Configuration (Cloudflare/Your DNS Provider)

Add these records to your domain:

```
# Main domain -> Hydrogen/Oxygen
shop.youthperformance.com    CNAME    shops.myshopify.com

# Checkout subdomain -> Shopify Online Store (checkout)
checkout.youthperformance.com    CNAME    shops.myshopify.com
```

**Note:** Both point to `shops.myshopify.com` but Shopify routes them differently based on your admin settings.

### 2. Shopify Admin Configuration

#### A. Make Hydrogen Public
1. Go to: **Shopify Admin > Sales channels > Hydrogen**
2. Select your storefront
3. Click `...` beside **Production environment**
4. Click **Edit environment**
5. Change **URL privacy** to **Public**
6. Click **Save**

#### B. Configure Domain Routing
1. Go to: **Shopify Admin > Settings > Domains**
2. Add both domains if not already added:
   - `shop.youthperformance.com`
   - `checkout.youthperformance.com`

3. For `shop.youthperformance.com`:
   - **Target:** Select your **Hydrogen storefront** (not Online Store)
   - **Domain type:** Primary

4. For `checkout.youthperformance.com`:
   - **Target:** **Online Store** (Liquid theme)
   - This handles checkout since Hydrogen uses Shopify's hosted checkout

#### C. Remove Password Protection
1. Go to: **Online Store > Preferences**
2. Scroll to **Restrict store access**
3. **Uncheck** "Restrict access to visitors with the password"
4. Click **Save**

### 3. Update Hydrogen Cart Checkout URL (Optional)

If you want checkout to explicitly use the subdomain, update the checkout URL in your cart:

```tsx
// apps/shop/app/routes/cart.tsx
// The checkoutUrl from Shopify will automatically use your configured domain
<a href={cart.checkoutUrl}>CHECKOUT</a>
```

Shopify automatically generates the correct checkout URL based on your domain settings.

### 4. Install Hydrogen Redirect Theme (Safety Net)

This catches any traffic that accidentally hits the Liquid theme:

```bash
# Clone the redirect theme
git clone https://github.com/shopify/hydrogen-redirect-theme.git

# Or download and upload via Shopify Admin > Online Store > Themes
```

This theme redirects all Liquid store traffic to your Hydrogen storefront.

### 5. Verify Setup

After configuration, test:

1. `https://shop.youthperformance.com` → Should show Hydrogen storefront
2. `https://shop.youthperformance.com/cart` → Add item, click checkout
3. Checkout URL should be `https://checkout.youthperformance.com/...`
4. `https://6wpwgr-ce.myshopify.com` → Should redirect to Hydrogen (if redirect theme installed)

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Customer Journey                        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              shop.youthperformance.com                      │
│                   (Hydrogen/Oxygen)                         │
│                                                             │
│  • Homepage, Product pages, Collections                     │
│  • Custom React components                                  │
│  • 3D animations, branded UX                                │
│  • Cart management                                          │
│  • Edge-rendered, <100ms TTFB                              │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ "Checkout" button click
                              ▼
┌─────────────────────────────────────────────────────────────┐
│            checkout.youthperformance.com                    │
│                 (Shopify Checkout)                          │
│                                                             │
│  • PCI-compliant payment processing                         │
│  • Shop Pay, Apple Pay, Google Pay                          │
│  • Address validation                                       │
│  • Tax calculation                                          │
│  • Order confirmation                                       │
└─────────────────────────────────────────────────────────────┘
```

## Troubleshooting

### Still seeing password page?
- Verify Hydrogen deployment is **Public** (not password protected)
- Verify domain **Target** is set to Hydrogen storefront, not Online Store
- Clear browser cache and try incognito

### Checkout not working?
- Ensure `checkout.youthperformance.com` targets **Online Store**
- Check that Storefront API token has checkout scope

### SEO concerns?
- Add canonical URLs to Hydrogen pages
- Ensure sitemap points to Hydrogen domain
- Set up 301 redirects from old URLs if migrating

## Related Docs
- [Shopify: Redirect Traffic to Hydrogen](https://shopify.dev/docs/storefronts/headless/hydrogen/migrate/redirect-traffic)
- [Hydrogen Redirect Theme](https://github.com/shopify/hydrogen-redirect-theme)
