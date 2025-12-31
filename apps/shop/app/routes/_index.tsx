import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';

export const meta: MetaFunction = () => {
  return [
    {title: 'YP Shop | Youth Performance Gear'},
    {description: 'Premium training gear for young athletes. NeoBall, training equipment, and more.'},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  // Fetch featured products
  const {products} = await storefront.query(FEATURED_PRODUCTS_QUERY);

  return {
    products: products.nodes,
  };
}

export default function Homepage() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-wolf-black/50 to-wolf-black" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <h1 className="font-display text-6xl md:text-8xl tracking-wider mb-6">
            TRAIN LIKE A
            <span className="block text-cyan">WOLF</span>
          </h1>
          <p className="text-xl text-gray-400 mb-8 max-w-xl mx-auto">
            Premium training gear designed for young athletes who refuse to settle.
          </p>
          <Link
            to="/collections/all"
            className="inline-block px-8 py-4 bg-neon-green text-wolf-black font-bold text-lg rounded-lg glow-green hover:scale-105 transition-transform"
          >
            SHOP NOW
          </Link>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl text-center mb-12 tracking-wider">
            FEATURED GEAR
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <Link
                key={product.id}
                to={`/products/${product.handle}`}
                className="group bg-surface rounded-xl overflow-hidden border border-glow hover:border-cyan/30 transition-all"
              >
                {product.featuredImage && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={product.featuredImage.url}
                      alt={product.featuredImage.altText || product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="font-display text-xl tracking-wide mb-2">
                    {product.title}
                  </h3>
                  <p className="text-cyan font-mono">
                    ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(2)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* NeoBall CTA */}
      <section className="py-20 px-6 bg-surface">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl mb-6 tracking-wider">
            <span className="text-cyan">NEOBALL</span>
          </h2>
          <p className="text-xl text-gray-400 mb-8">
            The world's best silent basketball. Train anytime, anywhere without the noise.
          </p>
          <a
            href="https://neoball.co"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 border-2 border-cyan text-cyan font-bold text-lg rounded-lg hover:bg-cyan hover:text-wolf-black transition-all"
          >
            LEARN MORE AT NEOBALL.CO
          </a>
        </div>
      </section>
    </main>
  );
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
