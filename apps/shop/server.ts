import {createStorefrontClient, storefrontRedirect} from '@shopify/hydrogen';
import {
  createRequestHandler,
  getStorefrontHeaders,
  type AppLoadContext,
} from '@shopify/remix-oxygen';
import {HydrogenSession} from '~/lib/session.server';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      // Create Hydrogen storefront client
      const {storefront} = createStorefrontClient({
        cache: await caches.open('hydrogen'),
        waitUntil: (p) => executionContext.waitUntil(p),
        i18n: {language: 'EN', country: 'US'},
        publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN,
        privateStorefrontToken: env.PRIVATE_STOREFRONT_TOKEN,
        storeDomain: env.PUBLIC_STORE_DOMAIN,
        storefrontId: env.SHOPIFY_STOREFRONT_ID,
        storefrontHeaders: getStorefrontHeaders(request),
        storefrontApiVersion: env.PUBLIC_STOREFRONT_API_VERSION || '2024-10',
      });

      // Create session
      const session = await HydrogenSession.init(request, [env.SESSION_SECRET]);

      // Build load context
      const loadContext: AppLoadContext = {
        storefront,
        session,
        env,
        waitUntil: (p) => executionContext.waitUntil(p),
      };

      // Create Remix request handler
      const handleRequest = createRequestHandler({
        build: await import('./build/server'),
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

// Environment variables interface
interface Env {
  PUBLIC_STORE_DOMAIN: string;
  PUBLIC_STOREFRONT_API_TOKEN: string;
  PUBLIC_STOREFRONT_API_VERSION: string;
  PRIVATE_STOREFRONT_TOKEN?: string;
  PRIVATE_ADMIN_API_TOKEN?: string;
  SESSION_SECRET: string;
  SHOPIFY_STOREFRONT_ID?: string;
}
