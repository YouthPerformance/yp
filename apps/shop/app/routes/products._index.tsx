import {useState, useCallback} from 'react';
import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {ProductCard, QuickViewModal} from '~/components/ProductCard';
import {ShopAllButton} from '~/components/ShopAllButton';

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

// Type for quick view product
interface QuickViewProduct {
  id: string;
  title: string;
  price: string;
  image?: string;
  handle: string;
}

export default function Products() {
  const {products} = useLoaderData<typeof loader>();

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<QuickViewProduct | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  const handleQuickView = useCallback((product: QuickViewProduct) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  }, []);

  const handleCloseQuickView = useCallback(() => {
    setIsQuickViewOpen(false);
    // Delay clearing product for exit animation
    setTimeout(() => setQuickViewProduct(null), 300);
  }, []);

  return (
    <main className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header with Rotating Shop Button */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="text-center md:text-left">
            <p className="hero-subtitle mb-4">YP Gear</p>
            <h1 className="font-display text-5xl tracking-wider mb-4">
              ALL <span className="text-cyan">PRODUCTS</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-2xl">
              Premium training gear built for athletes who train while others sleep.
            </p>
          </div>

          {/* Rotating Shop All Button */}
          <div className="hidden md:block">
            <ShopAllButton href="/collections/all" text="BROWSE" size={100} />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product: any) => {
            // Get secondary image if available
            const images = product.images?.nodes || [];
            const secondaryImage = images.length > 1 ? images[1] : null;

            return (
              <ProductCard
                key={product.id}
                id={product.id}
                title={product.title}
                handle={product.handle}
                price={parseFloat(product.priceRange.minVariantPrice.amount).toFixed(0)}
                featuredImage={product.featuredImage}
                secondaryImage={secondaryImage}
                onQuickView={handleQuickView}
              />
            );
          })}
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

      {/* Quick View Modal */}
      <QuickViewModal
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
        product={quickViewProduct}
      />
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
        images(first: 2) {
          nodes {
            url
            altText
          }
        }
      }
    }
  }
`;
