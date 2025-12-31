import {
  createStorefrontClient,
  storefrontRedirect,
  createCartHandler,
} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
  type AppLoadContext,
} from '@shopify/remix-oxygen';
import {HydrogenSession} from './app/lib/session.server';
import {validateEnv} from './app/lib/env.server';
// @ts-expect-error Virtual module provided by Vite/Remix
import * as remixBuild from 'virtual:remix/server-build';

// Maintenance mode HTML response
const maintenanceHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>YP Shop - Maintenance</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #050505;
      color: #fff;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      text-align: center;
      padding: 2rem;
    }
    h1 {
      font-family: 'Bebas Neue', sans-serif;
      font-size: 3rem;
      color: #00f6e0;
      margin-bottom: 1rem;
    }
    p {
      color: #888;
      font-size: 1.1rem;
      max-width: 400px;
      line-height: 1.6;
    }
    .wolf { font-size: 4rem; margin-bottom: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <div class="wolf">🐺</div>
    <h1>WE'RE UPGRADING</h1>
    <p>The pack is making improvements. We'll be back shortly with something even better.</p>
  </div>
</body>
</html>`;

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      // Validate environment variables at request time
      const validatedEnv = validateEnv(env as unknown as Record<string, string | undefined>);

      // Check maintenance mode
      if (validatedEnv.MAINTENANCE_MODE) {
        return new Response(maintenanceHTML, {
          status: 503,
          headers: {
            'Content-Type': 'text/html',
            'Retry-After': '3600',
          },
        });
      }
      // Create Hydrogen storefront client
      const {storefront} = createStorefrontClient({
        cache: await caches.open('hydrogen'),
        waitUntil: (p) => executionContext.waitUntil(p),
        i18n: {language: 'EN', country: 'US'},
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.PUBLIC_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
        storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2024-10',
      });

      // Create session
      const session = await HydrogenSession.init(request, [env.SESSION_SECRET]);

      // Create cart handler
      const cart = createCartHandler({
        storefront,
        getCartId: () => {
          const cartId = session.get('cartId');
          return cartId;
        },
        setCartId: (cartId: string) => {
          session.set('cartId', cartId);
        },
      });

      // Build load context
      const loadContext: AppLoadContext = {
        storefront,
        session,
        cart,
        env,
        waitUntil: (p) => executionContext.waitUntil(p),
      };

      // Create Remix request handler
      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => loadContext,
      });

      const response = await handleRequest(request);

      if (response.status === 404) {
        return storefrontRedirect({request, response, storefront});
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};

// Environment variables interface (matches Oxygen auto-provided vars)
interface Env {
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_STOREFRONT_API_VERSION: string;
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  PRIVATE_ADMIN_API_TOKEN?: string;
  SESSION_SECRET: string;
  PUBLIC_STOREFRONT_ID?: string;
}
