import { jsx, jsxs } from "react/jsx-runtime";
import { RemixServer, useLoaderData, Meta, Links, Outlet, ScrollRestoration, Scripts, Link } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToReadableStream } from "react-dom/server";
import { createContentSecurityPolicy, useNonce, Analytics, Image, Money } from "@shopify/hydrogen";
async function handleRequest(request, responseStatusCode, responseHeaders, remixContext) {
  const { nonce, header, NonceProvider } = createContentSecurityPolicy();
  const body = await renderToReadableStream(
    /* @__PURE__ */ jsx(NonceProvider, { children: /* @__PURE__ */ jsx(RemixServer, { context: remixContext, url: request.url }) }),
    {
      nonce,
      signal: request.signal,
      onError(error) {
        console.error(error);
        responseStatusCode = 500;
      }
    }
  );
  if (isbot(request.headers.get("user-agent"))) {
    await body.allReady;
  }
  responseHeaders.set("Content-Type", "text/html");
  responseHeaders.set("Content-Security-Policy", header);
  return new Response(body, {
    headers: responseHeaders,
    status: responseStatusCode
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const styles = "/assets/app-BGJGAnV9.css";
const links = () => [
  { rel: "stylesheet", href: styles },
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
  { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&display=swap" }
];
async function loader$4({ context }) {
  const { storefront, cart } = context;
  return {
    cart: cart.get(),
    publicStoreDomain: context.env.PUBLIC_STORE_DOMAIN
  };
}
function App() {
  const nonce = useNonce();
  const data = useLoaderData();
  return /* @__PURE__ */ jsxs("html", { lang: "en", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx("meta", { name: "theme-color", content: "#0a0a0a" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { className: "bg-wolf-black text-white min-h-screen", children: [
      /* @__PURE__ */ jsx(Outlet, {}),
      /* @__PURE__ */ jsx(ScrollRestoration, { nonce }),
      /* @__PURE__ */ jsx(Scripts, { nonce }),
      /* @__PURE__ */ jsx(Analytics.Provider, { cart: data.cart, shop: {}, consent: {} })
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: App,
  links,
  loader: loader$4
}, Symbol.toStringTag, { value: "Module" }));
const meta$2 = ({ data }) => {
  return [
    { title: `${(data == null ? void 0 : data.collection.title) || "Collection"} | YP Shop` },
    { description: (data == null ? void 0 : data.collection.description) || "" }
  ];
};
async function loader$3({ params, context }) {
  const { handle } = params;
  const { storefront } = context;
  const { collection } = await storefront.query(COLLECTION_QUERY, {
    variables: { handle }
  });
  if (!collection) {
    throw new Response("Not found", { status: 404 });
  }
  return { collection };
}
function Collection() {
  const { collection } = useLoaderData();
  const { title, description, products } = collection;
  return /* @__PURE__ */ jsx("main", { className: "min-h-screen pt-24 px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
    /* @__PURE__ */ jsxs("div", { className: "text-center mb-12", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-5xl tracking-wider mb-4", children: title }),
      description && /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg max-w-2xl mx-auto", children: description })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: products.nodes.map((product) => /* @__PURE__ */ jsxs(
      Link,
      {
        to: `/products/${product.handle}`,
        className: "group bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-cyan/30 transition-all",
        children: [
          product.featuredImage && /* @__PURE__ */ jsx("div", { className: "aspect-square overflow-hidden", children: /* @__PURE__ */ jsx(
            Image,
            {
              data: product.featuredImage,
              className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500",
              sizes: "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
            }
          ) }),
          /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl tracking-wide mb-2", children: product.title }),
            /* @__PURE__ */ jsx("div", { className: "text-cyan font-mono", children: /* @__PURE__ */ jsx(Money, { data: product.priceRange.minVariantPrice }) })
          ] })
        ]
      },
      product.id
    )) }),
    products.nodes.length === 0 && /* @__PURE__ */ jsx("div", { className: "text-center py-20", children: /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg", children: "No products in this collection yet." }) })
  ] }) });
}
const COLLECTION_QUERY = `#graphql
  query Collection($handle: String!) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      products(first: 20) {
        nodes {
          id
          title
          handle
          featuredImage {
            id
            url
            altText
            width
            height
          }
          priceRange {
            minVariantPrice {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Collection,
  loader: loader$3,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const meta$1 = ({ data }) => {
  return [
    { title: `${(data == null ? void 0 : data.product.title) || "Product"} | YP Shop` },
    { description: (data == null ? void 0 : data.product.description) || "" }
  ];
};
async function loader$2({ params, context }) {
  const { handle } = params;
  const { storefront } = context;
  const { product } = await storefront.query(PRODUCT_QUERY, {
    variables: { handle }
  });
  if (!product) {
    throw new Response("Not found", { status: 404 });
  }
  return { product };
}
function Product() {
  const { product } = useLoaderData();
  const { title, description, featuredImage, priceRange, variants } = product;
  const firstVariant = variants.nodes[0];
  return /* @__PURE__ */ jsx("main", { className: "min-h-screen pt-24 px-6", children: /* @__PURE__ */ jsx("div", { className: "max-w-7xl mx-auto", children: /* @__PURE__ */ jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-12", children: [
    /* @__PURE__ */ jsx("div", { className: "aspect-square bg-surface rounded-xl overflow-hidden", children: featuredImage && /* @__PURE__ */ jsx(
      Image,
      {
        data: featuredImage,
        className: "w-full h-full object-cover",
        sizes: "(min-width: 1024px) 50vw, 100vw"
      }
    ) }),
    /* @__PURE__ */ jsxs("div", { className: "flex flex-col justify-center", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-5xl tracking-wider mb-4", children: title }),
      /* @__PURE__ */ jsx("div", { className: "text-3xl text-cyan font-mono mb-6", children: /* @__PURE__ */ jsx(Money, { data: priceRange.minVariantPrice }) }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg mb-8 leading-relaxed", children: description }),
      /* @__PURE__ */ jsxs("form", { action: "/cart", method: "post", className: "space-y-4", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "hidden",
            name: "merchandiseId",
            value: firstVariant == null ? void 0 : firstVariant.id
          }
        ),
        /* @__PURE__ */ jsx("input", { type: "hidden", name: "quantity", value: "1" }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "submit",
            className: "w-full py-4 bg-neon-green text-wolf-black font-bold text-lg rounded-lg glow-green hover:scale-[1.02] transition-transform",
            children: "ADD TO CART"
          }
        )
      ] }),
      variants.nodes.length > 1 && /* @__PURE__ */ jsxs("div", { className: "mt-6", children: [
        /* @__PURE__ */ jsx("h3", { className: "text-sm font-semibold mb-3", children: "Options" }),
        /* @__PURE__ */ jsx("div", { className: "flex gap-2", children: variants.nodes.map((variant) => /* @__PURE__ */ jsx(
          "button",
          {
            className: "px-4 py-2 border border-white/20 rounded-lg hover:border-cyan transition-colors",
            children: variant.title
          },
          variant.id
        )) })
      ] })
    ] })
  ] }) }) });
}
const PRODUCT_QUERY = `#graphql
  query Product($handle: String!) {
    product(handle: $handle) {
      id
      title
      handle
      description
      featuredImage {
        id
        url
        altText
        width
        height
      }
      priceRange {
        minVariantPrice {
          amount
          currencyCode
        }
        maxVariantPrice {
          amount
          currencyCode
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          availableForSale
          price {
            amount
            currencyCode
          }
          selectedOptions {
            name
            value
          }
        }
      }
    }
  }
`;
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Product,
  loader: loader$2,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const meta = () => {
  return [
    { title: "YP Shop | Youth Performance Gear" },
    { description: "Premium training gear for young athletes. NeoBall, training equipment, and more." }
  ];
};
async function loader$1({ context }) {
  const { storefront } = context;
  const { products } = await storefront.query(FEATURED_PRODUCTS_QUERY);
  return {
    products: products.nodes
  };
}
function Homepage() {
  const { products } = useLoaderData();
  return /* @__PURE__ */ jsxs("main", { className: "min-h-screen", children: [
    /* @__PURE__ */ jsxs("section", { className: "relative h-screen flex items-center justify-center overflow-hidden", children: [
      /* @__PURE__ */ jsx("div", { className: "absolute inset-0 bg-gradient-to-b from-transparent via-wolf-black/50 to-wolf-black" }),
      /* @__PURE__ */ jsxs("div", { className: "relative z-10 text-center px-6 max-w-4xl", children: [
        /* @__PURE__ */ jsxs("h1", { className: "font-display text-6xl md:text-8xl tracking-wider mb-6", children: [
          "TRAIN LIKE A",
          /* @__PURE__ */ jsx("span", { className: "block text-cyan", children: "WOLF" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400 mb-8 max-w-xl mx-auto", children: "Premium training gear designed for young athletes who refuse to settle." }),
        /* @__PURE__ */ jsx(
          Link,
          {
            to: "/collections/all",
            className: "inline-block px-8 py-4 bg-neon-green text-wolf-black font-bold text-lg rounded-lg glow-green hover:scale-105 transition-transform",
            children: "SHOP NOW"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-7xl mx-auto", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-4xl text-center mb-12 tracking-wider", children: "FEATURED GEAR" }),
      /* @__PURE__ */ jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8", children: products.map((product) => /* @__PURE__ */ jsxs(
        Link,
        {
          to: `/products/${product.handle}`,
          className: "group bg-surface rounded-xl overflow-hidden border border-glow hover:border-cyan/30 transition-all",
          children: [
            product.featuredImage && /* @__PURE__ */ jsx("div", { className: "aspect-square overflow-hidden", children: /* @__PURE__ */ jsx(
              "img",
              {
                src: product.featuredImage.url,
                alt: product.featuredImage.altText || product.title,
                className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              }
            ) }),
            /* @__PURE__ */ jsxs("div", { className: "p-6", children: [
              /* @__PURE__ */ jsx("h3", { className: "font-display text-xl tracking-wide mb-2", children: product.title }),
              /* @__PURE__ */ jsxs("p", { className: "text-cyan font-mono", children: [
                "$",
                parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)
              ] })
            ] })
          ]
        },
        product.id
      )) })
    ] }) }),
    /* @__PURE__ */ jsx("section", { className: "py-20 px-6 bg-surface", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center", children: [
      /* @__PURE__ */ jsx("h2", { className: "font-display text-5xl mb-6 tracking-wider", children: /* @__PURE__ */ jsx("span", { className: "text-cyan", children: "NEOBALL" }) }),
      /* @__PURE__ */ jsx("p", { className: "text-xl text-gray-400 mb-8", children: "The world's best silent basketball. Train anytime, anywhere without the noise." }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "https://neoball.co",
          target: "_blank",
          rel: "noopener noreferrer",
          className: "inline-block px-8 py-4 border-2 border-cyan text-cyan font-bold text-lg rounded-lg hover:bg-cyan hover:text-wolf-black transition-all",
          children: "LEARN MORE AT NEOBALL.CO"
        }
      )
    ] }) })
  ] });
}
const FEATURED_PRODUCTS_QUERY = `#graphql
  query FeaturedProducts {
    products(first: 6, sortKey: BEST_SELLING) {
      nodes {
        id
        title
        handle
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
        }
        featuredImage {
          url
          altText
        }
      }
    }
  }
`;
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Homepage,
  loader: loader$1,
  meta
}, Symbol.toStringTag, { value: "Module" }));
async function loader({ context }) {
  return { cart: null };
}
async function action({ request, context }) {
  const formData = await request.formData();
  formData.get("merchandiseId");
  Number(formData.get("quantity") || 1);
  return { success: true };
}
function Cart() {
  var _a, _b;
  const { cart } = useLoaderData();
  if (!cart || !((_b = (_a = cart == null ? void 0 : cart.lines) == null ? void 0 : _a.nodes) == null ? void 0 : _b.length)) {
    return /* @__PURE__ */ jsx("main", { className: "min-h-screen pt-24 px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto text-center py-20", children: [
      /* @__PURE__ */ jsx("h1", { className: "font-display text-5xl tracking-wider mb-6", children: "YOUR CART" }),
      /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-lg mb-8", children: "Your cart is empty" }),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/collections/all",
          className: "inline-block px-8 py-4 bg-neon-green text-wolf-black font-bold text-lg rounded-lg glow-green hover:scale-105 transition-transform",
          children: "CONTINUE SHOPPING"
        }
      )
    ] }) });
  }
  return /* @__PURE__ */ jsx("main", { className: "min-h-screen pt-24 px-6", children: /* @__PURE__ */ jsxs("div", { className: "max-w-4xl mx-auto", children: [
    /* @__PURE__ */ jsx("h1", { className: "font-display text-5xl tracking-wider mb-12 text-center", children: "YOUR CART" }),
    /* @__PURE__ */ jsx("div", { className: "space-y-6 mb-12", children: cart.lines.nodes.map((line) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: "flex gap-6 p-4 bg-surface rounded-xl border border-white/5",
        children: [
          line.merchandise.image && /* @__PURE__ */ jsx(
            "img",
            {
              src: line.merchandise.image.url,
              alt: line.merchandise.image.altText || "",
              className: "w-24 h-24 object-cover rounded-lg"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "flex-1", children: [
            /* @__PURE__ */ jsx("h3", { className: "font-display text-xl", children: line.merchandise.product.title }),
            /* @__PURE__ */ jsxs("p", { className: "text-gray-400", children: [
              "Qty: ",
              line.quantity
            ] })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "text-cyan font-mono", children: /* @__PURE__ */ jsx(Money, { data: line.cost.totalAmount }) })
        ]
      },
      line.id
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "bg-surface rounded-xl p-6 border border-white/5", children: [
      /* @__PURE__ */ jsxs("div", { className: "flex justify-between text-lg mb-6", children: [
        /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
        /* @__PURE__ */ jsx("span", { className: "text-cyan font-mono", children: /* @__PURE__ */ jsx(Money, { data: cart.cost.subtotalAmount }) })
      ] }),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: cart.checkoutUrl,
          className: "block w-full py-4 bg-neon-green text-wolf-black font-bold text-lg rounded-lg text-center glow-green hover:scale-[1.02] transition-transform",
          children: "CHECKOUT"
        }
      ),
      /* @__PURE__ */ jsx(
        Link,
        {
          to: "/collections/all",
          className: "block w-full py-4 mt-4 border border-white/20 text-white font-bold text-lg rounded-lg text-center hover:border-cyan transition-colors",
          children: "CONTINUE SHOPPING"
        }
      )
    ] })
  ] }) });
}
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action,
  default: Cart,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CWQX6QNa.js", "imports": ["/assets/components-uNmAz_NV.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/root-BAGbz56J.js", "imports": ["/assets/components-uNmAz_NV.js"], "css": [] }, "routes/collections.$handle": { "id": "routes/collections.$handle", "parentId": "root", "path": "collections/:handle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/collections._handle-Y_EMDrLL.js", "imports": ["/assets/components-uNmAz_NV.js", "/assets/Image-BJzuFEQ8.js", "/assets/Money-JsgWfhup.js"], "css": [] }, "routes/products.$handle": { "id": "routes/products.$handle", "parentId": "root", "path": "products/:handle", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/products._handle-DHIJ2K0e.js", "imports": ["/assets/components-uNmAz_NV.js", "/assets/Image-BJzuFEQ8.js", "/assets/Money-JsgWfhup.js"], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-BNjmBX_m.js", "imports": ["/assets/components-uNmAz_NV.js"], "css": [] }, "routes/cart": { "id": "routes/cart", "parentId": "root", "path": "cart", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/cart-CSovUwjW.js", "imports": ["/assets/components-uNmAz_NV.js", "/assets/Money-JsgWfhup.js"], "css": [] } }, "url": "/assets/manifest-b3c33c1b.js", "version": "b3c33c1b" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": false, "v3_lazyRouteDiscovery": false, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/collections.$handle": {
    id: "routes/collections.$handle",
    parentId: "root",
    path: "collections/:handle",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/products.$handle": {
    id: "routes/products.$handle",
    parentId: "root",
    path: "products/:handle",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route3
  },
  "routes/cart": {
    id: "routes/cart",
    parentId: "root",
    path: "cart",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
