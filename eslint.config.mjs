import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  // Ignore build artifacts, reports and binaries
  {
    ignores: [
      'node_modules/',
      'dist/',
      'allure-results/',
      'allure-report/',
      'logs/',
      'apps/',
      'scripts/test-live.sh',
    ],
  },

  // Base: ESLint + typescript-eslint recommended rules
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  // WebdriverIO globals (injected at runtime by wdio, typed via @wdio/globals)
  {
    languageOptions: {
      globals: {
        browser: 'readonly',
        driver: 'readonly',
        $: 'readonly',
        $$: 'readonly',
        expect: 'readonly',
      },
    },
  },

  // Project-wide tweaks
  {
    rules: {
      // Allow console.log for scenario logging in hooks/steps
      'no-console': 'off',
      // Allow intentionally-unused step arguments (Cucumber signatures)
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },

  // wdio.conf.ts deals with loosely-typed Cucumber hook parameters
  {
    files: ['wdio.conf.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },

  // Exploration/template scripts may contain intentional TODOs
  {
    files: ['.opencode/**/*.ts'],
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
    },
  },

  // Prettier must always win over conflicting stylistic rules
  eslintConfigPrettier,
);
