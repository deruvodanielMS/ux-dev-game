# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Runtime Requirements

This project now requires:

- Node.js >= 20.19.0 (recommended: latest 22.x LTS) because Vite 7 uses the modern `crypto.hash` API and enforces a minimum Node version. Older Node (e.g. 18.x) will fail with errors like `crypto.hash is not a function` and a startup warning.
- npm 10+ (bundled with Node 22) or a compatible package manager.

### Verifying Your Environment

```bash
node -v   # should be >= v20.19.0 (prefer v22.x)
npm -v
```

If you use multiple version managers (e.g. both `asdf` and `nvm`), ensure the active Node comes from one consistent tool. A leftover shim (such as `~/.asdf/shims/node` pointing to an older version) can cause `npm run dev` to appear to use the wrong Node even if `node -v` shows the correct version. Remove or reorder paths so the desired Node (from `nvm`) comes first.

### Common Fix

If you see the warning requesting an upgrade or the `crypto.hash` error:

1. Install a newer Node: `nvm install 22 && nvm use 22`.
2. Reinstall dependencies: `rm -rf node_modules && npm install`.
3. Clear Vite cache if present: `rm -rf node_modules/.vite`.
4. Start dev server: `npm run dev`.

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x';
import reactDom from 'eslint-plugin-react-dom';

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

## Project Conventions (Architecture & Tooling)

### 1. Component & Export Style

All React components are declared as const arrow functions and exported using named exports (no default exports). Example:

```ts
// Good
export const MyWidget: React.FC<Props> = ({ title }) => {
  /* ... */
};
```

### 2. Centralized Types

All shared interfaces / types live in `src/types` (with subfolders like `components`, `context`, `pages`, etc.) and are re-exported via the barrel file `src/types/index.ts` for convenience:

```ts
import type { Character, Player } from '@/types';
```

Do NOT declare component/page/context types inline unless they are strictly local. Promote reusability and consistency.

### 3. Import Order (Auto-Enforced)

Import order is enforced by `eslint-plugin-simple-import-sort` with the following grouping (blank line between groups):

1. External packages (React first) - e.g. `react`, `react-dom`, other npm deps.
2. Explicit Type imports using `import type ...` (prefixed internally by the plugin as `type:`) — keeps type-only imports isolated.
3. Internal project types (`src/types` barrel or any path containing `/types`).
4. UI / feature modules (components, pages) in this order: atoms, molecules, organisms, templates, pages (also any remaining `components/` path).
5. Other internal relative modules (hooks, context, services, utils) excluding styles.
6. CSS / style files (always last).

Example:

```ts
import React from 'react';
import { createRoot } from 'react-dom/client';

import type { Character } from '@/types';

import { CharacterCard } from '@/components/molecules/CharacterCard/CharacterCard';
import { BattlePage } from '@/pages/BattlePage/BattlePage';

import { useGame } from '@/context/GameContext';
import { getCharacters } from '@/services/characters';

import './BattlePage.module.css';
```

The linter will auto-fix ordering; do not fight it—run `npm run lint:fix` or rely on the pre-commit hook.

### 4. Pre-Commit Automation

`husky` + `lint-staged` run automatically on staged files:

- ESLint (with `--fix`) on `*.ts, *.tsx`
- Prettier formatting for TypeScript, JavaScript, JSON, CSS, Markdown

If a file fails lint (e.g. unused variable), the commit is aborted. Fix and re-stage.

### 5. Running Manually

```bash
npm run lint        # strict (no warnings allowed)
npm run lint:fix    # auto-fix where possible
npm run format      # prettier across repo
```

### 6. Adding New Types

1. Create or extend a file under `src/types/...`.
2. Export from that file and add to `src/types/index.ts` (barrel) if broadly reused.
3. Use `import type { X } from '@/types';`.

### 7. Rationale

- Named exports improve refactor safety and tooling.
- Centralized types reduce duplication and drift.
- Deterministic import order improves diff clarity and avoids merge noise.

### 8. Troubleshooting

If imports reorder unexpectedly, let ESLint auto-fix instead of manually adjusting. If a new path category emerges, adjust the grouping in `eslint.config.js`.

### 9. Future Enhancements

Potential additions:

- Path aliases (`@/components`, etc.) already partially supported via `vite-tsconfig-paths`; ensure tsconfig path mappings if expanded.
- Add stricter `typescript-eslint` type checking config.
- Enforce exhaustive deps for custom hooks beyond react-hooks defaults.

### 10. Environment & Secrets

Environment variables (Supabase, Auth, etc.) go in a local `.env` (and optional `.env.local`). These files are git-ignored. Do NOT commit secrets. If you need to document required keys, create a `.env.example` without values or with placeholder values. Never place real credentials in the repo or commit history.

---

For environment requirements and general framework notes, see earlier sections in this README.
