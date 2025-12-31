/// <reference types="vite/client" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type {Storefront} from '@shopify/hydrogen';
import type {HydrogenSession} from '~/lib/session.server';

declare global {
  /**
   * A global `process` object is only available during build to access NODE_ENV.
   */
  const process: {env: {NODE_ENV: 'production' | 'development'}};

  /**
   * Declare expected Env parameter in fetch handler.
   */
  interface Env {
    PUBLIC_STORE_DOMAIN: string;
    PUBLIC_STOREFRONT_API_TOKEN: string;
    PUBLIC_STOREFRONT_API_VERSION: string;
    PRIVATE_STOREFRONT_TOKEN?: string;
    PRIVATE_ADMIN_API_TOKEN?: string;
    SESSION_SECRET: string;
    SHOPIFY_STOREFRONT_ID?: string;
  }
}

declare module '@shopify/remix-oxygen' {
  export interface AppLoadContext {
    storefront: Storefront;
    session: HydrogenSession;
    env: Env;
    waitUntil: ExecutionContext['waitUntil'];
  }
}
