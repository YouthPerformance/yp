const {getSchema, pluckConfig, preset} = require('@shopify/hydrogen-codegen');

/** @type {import('@graphql-codegen/cli').CodegenConfig} */
module.exports = {
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
};

