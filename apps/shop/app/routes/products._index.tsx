import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export const meta: MetaFunction = () => {
  return [
    {title: 'All Products | YP Shop'},
    {description: 'Browse all YP training gear and equipment.'},
  ];
};

export async function loader({context}: LoaderFunctionArgs) {
  const {storefront} = context;

  const {products} = await storefront.query(ALL_PRODUCTS_QUERY);

  return {products: products.nodes};
}

export default function Products() {
  const {products} = useLoaderData<typeof loader>();

  return (
    <main className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="hero-subtitle mb-4">YP Gear</p>
          <h1 className="font-display text-5xl tracking-wider mb-4">
            ALL <span className="text-cyan">PRODUCTS</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Premium training gear built for athletes who train while others sleep.
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="product-card group"
            >
              <div className="product-card__image">
                {product.featuredImage && (
                  <img
                    src={product.featuredImage.url}
                    alt={product.featuredImage.altText || product.title}
                  />
                )}
              </div>
              <div className="product-card__info">
                <p className="product-card__label">YP Gear</p>
                <h3 className="product-card__name">{product.title}</h3>
                <p className="product-card__price">
                  ${parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No products available yet. Check back soon!
            </p>
          </div>
        )}

        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link to="/" className="btn-secondary">
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}

const ALL_PRODUCTS_QUERY = `#graphql
  query AllProducts {
    products(first: 50, sortKey: TITLE) {
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
