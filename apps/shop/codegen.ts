import type { CodegenConfig } from '@graphql-codegen/cli';
import { getSchema, pluckConfig, preset } from '@shopify/hydrogen-codegen';

export default {
  overwrite: true,
  pluckConfig,
  concurrency: 1,
  generates: {
    'storefrontapi.generated.d.ts': {
      preset,
      schema: getSchema('storefront'),
      documents: ['./*.{ts,tsx,js,jsx}', './app/**/*.{ts,tsx,js,jsx}'],
    },
  },
} as CodegenConfig;

