import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from '@remix-run/react';
import type {LinksFunction, LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {Analytics, useNonce} from '@shopify/hydrogen';
import styles from './styles/app.css?url';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: styles},
  {rel: 'preconnect', href: 'https://fonts.googleapis.com'},
  {rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous'},
  {rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600;700&display=swap'},
];

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  return {
    publicStoreDomain: context.env.PUBLIC_STORE_DOMAIN,
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
        <Meta />
        <Links />
      </head>
      <body className="bg-wolf-black text-white min-h-screen">
        <Outlet />
        <ScrollRestoration nonce={nonce} />
        <Scripts nonce={nonce} />
        <Analytics.Provider cart={null} shop={null} consent={{}} />
      </body>
    </html>
  );
}
