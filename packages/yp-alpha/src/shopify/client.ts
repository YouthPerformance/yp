/**
 * Shopify Storefront API Client
 * Fetches product data from youthperformance.myshopify.com
 */

interface ShopifyConfig {
  storeDomain: string;
  storefrontToken: string;
  apiVersion?: string;
}

interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
  featuredImage?: {
    url: string;
    altText: string | null;
  };
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      price: {
        amount: string;
        currencyCode: string;
      };
      availableForSale: boolean;
    }>;
  };
}

export class ShopifyClient {
  private storeDomain: string;
  private storefrontToken: string;
  private apiVersion: string;
  private endpoint: string;

  constructor(config: ShopifyConfig) {
    this.storeDomain = config.storeDomain;
    this.storefrontToken = config.storefrontToken;
    this.apiVersion = config.apiVersion || "2024-10";
    this.endpoint = `https://${this.storeDomain}/api/${this.apiVersion}/graphql.json`;
  }

  private async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": this.storefrontToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.status}`);
    }

    const result = (await response.json()) as { data: T; errors?: Array<{ message: string }> };

    if (result.errors) {
      throw new Error(`Shopify GraphQL error: ${JSON.stringify(result.errors)}`);
    }

    return result.data;
  }

  /**
   * Get a single product by handle
   */
  async getProduct(handle: string): Promise<Product | null> {
    const data = await this.query<{ product: Product | null }>(
      `
      query GetProduct($handle: String!) {
        product(handle: $handle) {
          id
          title
          handle
          description
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
          variants(first: 10) {
            nodes {
              id
              title
              price {
                amount
                currencyCode
              }
              availableForSale
            }
          }
        }
      }
    `,
      { handle },
    );

    return data.product;
  }

  /**
   * Get featured/best-selling products
   */
  async getFeaturedProducts(first: number = 6): Promise<Product[]> {
    const data = await this.query<{ products: { nodes: Product[] } }>(
      `
      query FeaturedProducts($first: Int!) {
        products(first: $first, sortKey: BEST_SELLING) {
          nodes {
            id
            title
            handle
            description
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
            variants(first: 1) {
              nodes {
                id
                title
                price {
                  amount
                  currencyCode
                }
                availableForSale
              }
            }
          }
        }
      }
    `,
      { first },
    );

    return data.products.nodes;
  }

  /**
   * Get all products from a collection
   */
  async getCollection(
    handle: string,
    first: number = 20,
  ): Promise<{ title: string; products: Product[] } | null> {
    const data = await this.query<{
      collection: {
        title: string;
        products: { nodes: Product[] };
      } | null;
    }>(
      `
      query GetCollection($handle: String!, $first: Int!) {
        collection(handle: $handle) {
          title
          products(first: $first) {
            nodes {
              id
              title
              handle
              description
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
              variants(first: 1) {
                nodes {
                  id
                  title
                  price {
                    amount
                    currencyCode
                  }
                  availableForSale
                }
              }
            }
          }
        }
      }
    `,
      { handle, first },
    );

    if (!data.collection) return null;

    return {
      title: data.collection.title,
      products: data.collection.products.nodes,
    };
  }
}

/**
 * Create a Shopify client with YP Shop credentials
 * Usage: const shopify = createYPShopClient(process.env.STOREFRONT_TOKEN)
 */
export function createYPShopClient(storefrontToken: string) {
  return new ShopifyClient({
    storeDomain: "youthperformance.myshopify.com",
    storefrontToken,
  });
}
