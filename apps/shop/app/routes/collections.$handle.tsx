import type {LoaderFunctionArgs, MetaFunction} from '@shopify/remix-oxygen';
import {useLoaderData, Link} from '@remix-run/react';
import {Image, Money} from '@shopify/hydrogen';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  return [
    {title: `${data?.collection.title || 'Collection'} | YP Shop`},
    {description: data?.collection.description || ''},
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const {handle} = params;
  const {storefront} = context;

  const {collection} = await storefront.query(COLLECTION_QUERY, {
    variables: {handle},
  });

  if (!collection) {
    throw new Response('Not found', {status: 404});
  }

  return {collection};
}

export default function Collection() {
  const {collection} = useLoaderData<typeof loader>();
  const {title, description, products} = collection;

  return (
    <main className="min-h-screen pt-24 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Collection Header */}
        <div className="text-center mb-12">
          <h1 className="font-display text-5xl tracking-wider mb-4">{title}</h1>
          {description && (
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {description}
            </p>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.nodes.map((product: any) => (
            <Link
              key={product.id}
              to={`/products/${product.handle}`}
              className="group bg-surface rounded-xl overflow-hidden border border-white/5 hover:border-cyan/30 transition-all"
            >
              {product.featuredImage && (
                <div className="aspect-square overflow-hidden">
                  <Image
                    data={product.featuredImage}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />
                </div>
              )}
              <div className="p-6">
                <h3 className="font-display text-xl tracking-wide mb-2">
                  {product.title}
                </h3>
                <div className="text-cyan font-mono">
                  <Money data={product.priceRange.minVariantPrice} />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {products.nodes.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              No products in this collection yet.
            </p>
          </div>
        )}
      </div>
    </main>
  );
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
