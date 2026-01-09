import {
  Links,
  Meta,
  Outlet,
  PrefetchPageLinks,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { Analytics, useNonce } from "@shopify/hydrogen";
import type { HeadersFunction, LinksFunction, LoaderFunctionArgs } from "@shopify/remix-oxygen";
import styles from "./styles/app.css?url";

/**
 * Performance-optimized links
 * - Preconnect to critical origins
 * - Preload fonts for faster rendering
 * - DNS prefetch for Shopify CDN
 */
export const links: LinksFunction = () => [
  // Critical CSS
  { rel: "stylesheet", href: styles },
  // Preconnect to critical origins (reduces connection time by ~100ms)
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "preconnect", href: "https://cdn.shopify.com" },
  // DNS prefetch for image CDN
  { rel: "dns-prefetch", href: "https://cdn.shopify.com" },
  // Fonts with display=swap for faster text rendering
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap",
  },
];

/**
 * Response headers for edge caching
 */
export const headers: HeadersFunction = () => ({
  "Cache-Control": "public, max-age=600, stale-while-revalidate=86400",
});

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront, cart } = context;

  // Fetch cart for header cart count (parallel with page data)
  const cartPromise = cart.get();

  return {
    publicStoreDomain: context.env.PUBLIC_STORE_DOMAIN,
    cart: await cartPromise,
    shop: {
      shopId: storefront.getShopifyDomain(),
      acceptedLanguage: storefront.i18n.language,
      currency: "USD" as const,
      hydrogenSubchannelId: "0",
    },
  };
}

export default function App() {
  const nonce = useNonce();
  const data = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#0a0a0a" />
        {/* Performance: prevent layout shift */}
        <meta name="color-scheme" content="dark" />
        <Meta />
        <Links />
      </head>
      <body className="bg-wolf-black text-white min-h-screen">
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />

        {/* Prefetch critical routes on idle */}
        <PrefetchPageLinks page="/products" />
        <PrefetchPageLinks page="/cart" />

        {/* Shopify Analytics */}
        <Analytics.Provider cart={data.cart} shop={data.shop} consent={{}} />
      </body>
    </html>
  );
}
