module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: { jsx: true },
  },
  extends: ['eslint:recommended', 'plugin:react/recommended', 'plugin:react-hooks/recommended'],
  settings: {
    react: { version: 'detect' },
  },
  globals: {
    gtag: 'readonly',
    posthog: 'readonly',
    mixpanel: 'readonly',
  },
  ignorePatterns: ['node_modules/', 'dist/', 'convex/_generated/', 'logs/', 'server/'],
  rules: {
    'no-unused-vars': 'off',
    'no-extra-semi': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    'react/no-unescaped-entities': 'off',
    'react-hooks/exhaustive-deps': 'off',
  },
};
