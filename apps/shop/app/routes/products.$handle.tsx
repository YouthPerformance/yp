import {useState, useEffect} from 'react';
import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, useFetcher, useNavigate} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';
import type {ProductQuery} from 'storefrontapi.generated';

// Extract the variant type from the generated types
type ProductVariant = NonNullable<
  ProductQuery['product']
>['variants']['nodes'][number];

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `${data?.product.title || 'Product'} | YP Shop`},
    {description: data?.product.description || ''},
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Response('Product handle is required', {status: 400});
  }

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {handle},
  });

  if (!product) {
    throw new Response('Not found', {status: 404});
  }

  return {product};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const {title, description, featuredImage, variants} = product;

  // Initialize with the first variant
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(
    variants.nodes[0],
  );

  // Cart fetcher for add to cart
  const fetcher = useFetcher<{success?: boolean; errors?: string[]}>();
  const navigate = useNavigate();

  // Determine loading and success states
  const isAddingToCart = fetcher.state !== 'idle';
  const addToCartSuccess = fetcher.data?.success === true;

  // Show success toast and optionally redirect
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (addToCartSuccess) {
      setShowSuccess(true);
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [addToCartSuccess, fetcher.data]);

  // Check availability of selected variant
  const isAvailable = selectedVariant?.availableForSale ?? false;

  return (
    <main className="min-h-screen pt-24 px-6 pb-12">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-surface rounded-xl overflow-hidden relative">
            {featuredImage && (
              <Image
                data={featuredImage}
                className="w-full h-full object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            )}

            {/* Out of stock overlay */}
            {!isAvailable && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-xl font-display tracking-wider text-gray-300">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-4xl sm:text-5xl tracking-wider mb-4">
              {title}
            </h1>

            {/* Price - shows selected variant's price */}
            <div className="text-3xl text-cyan font-mono mb-6">
              <Money data={selectedVariant.price} />
            </div>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {description}
            </p>

            {/* Variant selector - show before Add to Cart */}
            {variants.nodes.length > 1 && (
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-3 text-gray-300">
                  {variants.nodes[0]?.selectedOptions?.[0]?.name || 'Options'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {variants.nodes.map((variant: ProductVariant) => {
                    const isSelected = variant.id === selectedVariant.id;
                    const variantAvailable = variant.availableForSale;

                    return (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant)}
                        disabled={!variantAvailable}
                        className={`px-4 py-2 rounded-lg transition-all ${
                          isSelected
                            ? 'border-2 border-cyan bg-cyan/10 text-cyan'
                            : variantAvailable
                              ? 'border border-white/20 hover:border-cyan/50 text-white'
                              : 'border border-white/10 text-gray-500 cursor-not-allowed line-through'
                        }`}
                      >
                        {variant.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add to Cart Form */}
            <fetcher.Form method="post" action="/cart" className="space-y-4">
              <input type="hidden" name="action" value="ADD_TO_CART" />
              <input
                type="hidden"
                name="merchandiseId"
                value={selectedVariant.id}
              />
              <input type="hidden" name="quantity" value="1" />

              <button
                type="submit"
                disabled={!isAvailable || isAddingToCart}
                className={`w-full py-4 font-bold text-lg rounded-lg transition-all relative overflow-hidden ${
                  isAvailable
                    ? 'bg-neon-green text-wolf-black glow-green hover:scale-[1.02]'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                } ${isAddingToCart ? 'opacity-80' : ''}`}
              >
                {isAddingToCart ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    ADDING...
                  </span>
                ) : isAvailable ? (
                  'ADD TO CART'
                ) : (
                  'OUT OF STOCK'
                )}
              </button>
            </fetcher.Form>

            {/* View Cart Link (shows after adding) */}
            {showSuccess && (
              <button
                onClick={() => navigate('/cart')}
                className="w-full py-4 mt-4 border border-cyan text-cyan font-bold text-lg rounded-lg hover:bg-cyan/10 transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                ADDED! VIEW CART
              </button>
            )}

            {/* Error Message */}
            {fetcher.data?.errors && fetcher.data.errors.length > 0 && (
              <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-red-400 text-sm">
                  {fetcher.data.errors.join(', ')}
                </p>
              </div>
            )}

            {/* Show out of stock message */}
            {!isAvailable && (
              <p className="mt-3 text-sm text-red-400 text-center">
                This variant is currently unavailable
              </p>
            )}

            {/* Product Details */}
            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Availability</span>
                  <p className={isAvailable ? 'text-green-400' : 'text-red-400'}>
                    {isAvailable ? 'In Stock' : 'Out of Stock'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Toast */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="flex items-center gap-3 px-6 py-4 bg-green-500/10 border border-green-500/30 rounded-xl backdrop-blur-sm">
            <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <div>
              <p className="text-green-400 font-medium">Added to cart!</p>
              <p className="text-green-400/70 text-sm">{title}</p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
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
      variants(first: 100) {
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
