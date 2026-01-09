import { useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs, MetaFunction } from "@shopify/remix-oxygen";
import { HorizontalScrollPage } from "~/components/animations/HorizontalScrollPage";

export const meta: MetaFunction = () => {
  return [
    { title: "YP Shop | Premium Training Gear" },
    {
      description:
        "Premium training gear for young athletes. NeoBall silent basketball, training equipment, and more.",
    },
  ];
};

export async function loader({ context }: LoaderFunctionArgs) {
  const { storefront } = context;

  // Fetch featured products
  const { products } = await storefront.query(FEATURED_PRODUCTS_QUERY);

  return {
    products: products.nodes,
  };
}

export default function Homepage() {
  const { products } = useLoaderData<typeof loader>();

  return <HorizontalScrollPage products={products} />;
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
