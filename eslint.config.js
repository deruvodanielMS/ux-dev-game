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
            // 1. Paquetes externos (react primero)
            ['^react$', '^react-dom$', '^@?\\w'],
            // 2. Imports de tipos (TypeScript "import type")
            ['^type:'],
            // 3. Tipos del proyecto (cualquier ruta que termine o contenga /types)
            ['^.+/types$', '^.+/types/.*', '^types$'],
            // 4. Componentes (atoms|molecules|organisms|templates|pages)
            [
              '^.+/components/atoms/.*',
              '^.+/components/molecules/.*',
              '^.+/components/organisms/.*',
              '^.+/components/templates/.*',
              '^.+/pages/.*',
              '^.+/components/.*',
            ],
            // 5. Otros imports internos relativos (excluye styles)
            ['^\\.(?!.*\\.css$)', '^\\.\\.(?!.*\\.css$)'],
            // 6. Estilos (siempre al final)
            ['^.+\\.css$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
  prettier,
);
