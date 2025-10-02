// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default tseslint.config(
  // Ignore build and external artifact directories
  {
    ignores: ['dist/**', 'node_modules/**', 'public/**'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
      'jsx-a11y': jsxA11y,
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      // Orden personalizado de imports
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. External packages
            ['^react$', '^react-dom$', '^@?\\w'],
            // 2. Type-only imports (handled by plugin prefix)
            ['^type:'],
            // 3. Project Types via alias or direct path
            [
              '^@/types$',
              '^@/types/.*',
              '^.+/types$',
              '^.+/types/.*',
              '^types$',
            ],
            // 4. UI Components & Pages via alias
            [
              '^@/components/atoms/.*',
              '^@/components/molecules/.*',
              '^@/components/organisms/.*',
              '^@/components/templates/.*',
              '^@/pages/.*',
              '^.+/components/.*',
            ],
            // 5. Other internal modules via alias (context, hooks, services, utils, data)
            ['^@/(context|hooks|services|utils|data)/.*'],
            // 6. Relative imports (non-style)
            ['^\\.(?!.*\\.css$)', '^\\.\\.(?!.*\\.css$)'],
            // 7. Styles
            ['^.+\\.css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],
      // Allow default exports only in Storybook story files (Storybook requires default meta export)
      'import/no-default-export': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettier,
  storybook.configs['flat/recommended'],
  {
    files: ['**/*.stories.@(ts|tsx|js|jsx|mjs)'],
    rules: {
      'import/no-default-export': 'off',
    },
  },
);
