/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable eslint-comments/no-unlimited-disable */
/* eslint-disable */
import type * as StorefrontAPI from "@shopify/hydrogen/storefront-api-types";

export type FeaturedProductsQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type FeaturedProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, "id" | "title" | "handle"> & {
        priceRange: {
          minVariantPrice: Pick<StorefrontAPI.MoneyV2, "amount" | "currencyCode">;
        };
        featuredImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, "url" | "altText">>;
      }
    >;
  };
};

export type CollectionQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars["String"]["input"];
}>;

export type CollectionQuery = {
  collection?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Collection, "id" | "title" | "handle" | "description"> & {
      products: {
        nodes: Array<
          Pick<StorefrontAPI.Product, "id" | "title" | "handle"> & {
            featuredImage?: StorefrontAPI.Maybe<
              Pick<StorefrontAPI.Image, "id" | "url" | "altText" | "width" | "height">
            >;
            priceRange: {
              minVariantPrice: Pick<StorefrontAPI.MoneyV2, "amount" | "currencyCode">;
            };
          }
        >;
      };
    }
  >;
};

export type ProductQueryVariables = StorefrontAPI.Exact<{
  handle: StorefrontAPI.Scalars["String"]["input"];
}>;

export type ProductQuery = {
  product?: StorefrontAPI.Maybe<
    Pick<StorefrontAPI.Product, "id" | "title" | "handle" | "description"> & {
      featuredImage?: StorefrontAPI.Maybe<
        Pick<StorefrontAPI.Image, "id" | "url" | "altText" | "width" | "height">
      >;
      priceRange: {
        minVariantPrice: Pick<StorefrontAPI.MoneyV2, "amount" | "currencyCode">;
        maxVariantPrice: Pick<StorefrontAPI.MoneyV2, "amount" | "currencyCode">;
      };
      variants: {
        nodes: Array<
          Pick<StorefrontAPI.ProductVariant, "id" | "title" | "availableForSale"> & {
            price: Pick<StorefrontAPI.MoneyV2, "amount" | "currencyCode">;
            selectedOptions: Array<Pick<StorefrontAPI.SelectedOption, "name" | "value">>;
          }
        >;
      };
    }
  >;
};

export type AllProductsQueryVariables = StorefrontAPI.Exact<{
  [key: string]: never;
}>;

export type AllProductsQuery = {
  products: {
    nodes: Array<
      Pick<StorefrontAPI.Product, "id" | "title" | "handle"> & {
        priceRange: {
          minVariantPrice: Pick<StorefrontAPI.MoneyV2, "amount" | "currencyCode">;
        };
        featuredImage?: StorefrontAPI.Maybe<Pick<StorefrontAPI.Image, "url" | "altText">>;
        images: { nodes: Array<Pick<StorefrontAPI.Image, "url" | "altText">> };
      }
    >;
  };
};

interface GeneratedQueryTypes {
  "#graphql\n  query FeaturedProducts {\n    products(first: 6, sortKey: BEST_SELLING) {\n      nodes {\n        id\n        title\n        handle\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        featuredImage {\n          url\n          altText\n        }\n      }\n    }\n  }\n": {
    return: FeaturedProductsQuery;
    variables: FeaturedProductsQueryVariables;
  };
  "#graphql\n  query Collection($handle: String!) {\n    collection(handle: $handle) {\n      id\n      title\n      handle\n      description\n      products(first: 20) {\n        nodes {\n          id\n          title\n          handle\n          featuredImage {\n            id\n            url\n            altText\n            width\n            height\n          }\n          priceRange {\n            minVariantPrice {\n              amount\n              currencyCode\n            }\n          }\n        }\n      }\n    }\n  }\n": {
    return: CollectionQuery;
    variables: CollectionQueryVariables;
  };
  "#graphql\n  query Product($handle: String!) {\n    product(handle: $handle) {\n      id\n      title\n      handle\n      description\n      featuredImage {\n        id\n        url\n        altText\n        width\n        height\n      }\n      priceRange {\n        minVariantPrice {\n          amount\n          currencyCode\n        }\n        maxVariantPrice {\n          amount\n          currencyCode\n        }\n      }\n      variants(first: 100) {\n        nodes {\n          id\n          title\n          availableForSale\n          price {\n            amount\n            currencyCode\n          }\n          selectedOptions {\n            name\n            value\n          }\n        }\n      }\n    }\n  }\n": {
    return: ProductQuery;
    variables: ProductQueryVariables;
  };
  "#graphql\n  query AllProducts {\n    products(first: 50, sortKey: TITLE) {\n      nodes {\n        id\n        title\n        handle\n        priceRange {\n          minVariantPrice {\n            amount\n            currencyCode\n          }\n        }\n        featuredImage {\n          url\n          altText\n        }\n        images(first: 2) {\n          nodes {\n            url\n            altText\n          }\n        }\n      }\n    }\n  }\n": {
    return: AllProductsQuery;
    variables: AllProductsQueryVariables;
  };
}

type GeneratedMutationTypes = {};

declare module "@shopify/hydrogen" {
  interface StorefrontQueries extends GeneratedQueryTypes {}
  interface StorefrontMutations extends GeneratedMutationTypes {}
}
