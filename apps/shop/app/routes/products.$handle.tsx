import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `${data?.product.title || 'Product'} | YP Shop`},
    {description: data?.product.description || ''},
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

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
  const {title, description, featuredImage, priceRange, variants} = product;
  const firstVariant = variants.nodes[0];

  return (
    <main className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-surface rounded-xl overflow-hidden">
            {featuredImage && (
              <Image
                data={featuredImage}
                className="w-full h-full object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            )}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-center">
            <h1 className="font-display text-5xl tracking-wider mb-4">
              {title}
            </h1>

            <div className="text-3xl text-cyan font-mono mb-6">
              <Money data={priceRange.minVariantPrice} />
            </div>

            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              {description}
            </p>

            {/* Add to Cart Form */}
            <form action="/cart" method="post" className="space-y-4">
              <input
                type="hidden"
                name="merchandiseId"
                value={firstVariant?.id}
              />
              <input type="hidden" name="quantity" value="1" />

              <button
                type="submit"
                className="w-full py-4 bg-neon-green text-wolf-black font-bold text-lg rounded-lg glow-green hover:scale-[1.02] transition-transform"
              >
                ADD TO CART
              </button>
            </form>

            {/* Variant selector would go here */}
            {variants.nodes.length > 1 && (
              <div className="mt-6">
                <h3 className="text-sm font-semibold mb-3">Options</h3>
                <div className="flex gap-2">
                  {variants.nodes.map((variant: any) => (
                    <button
                      key={variant.id}
                      className="px-4 py-2 border border-white/20 rounded-lg hover:border-cyan transition-colors"
                    >
                      {variant.title}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
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
