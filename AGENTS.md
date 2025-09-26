# AGENTS.md

Agent-focused guide for working on this repository (React + TypeScript + Vite).

## 1. Project Goal

"Duelo de Código" – a gamified experience built with React 19, Vite 7, and TypeScript. Features Auth (Auth0 + Supabase), avatar upload, and player progress.

## 2. Environment

- Requires Node 22+ (`node -v` to verify).
- Package manager: npm (do NOT migrate to yarn/pnpm unless explicitly requested).
- Supabase environment variables required (not stored here). Do not commit secrets.

## 3. Install & Run

```bash
npm install        # install dependencies
npm run dev        # start Vite dev server
npm run build      # production build
npm start          # preview the built app
```

## 4. Lint & Formatting (AUTOMATED)

- ESLint (flat config) + `eslint-plugin-simple-import-sort` + Prettier.
- Import order auto-fixed (see section 6.3).
- Pre-commit: Husky runs `lint-staged` (eslint --fix + prettier) on staged files only.
- On save: `.vscode/settings.json` enables `source.fixAll.eslint`.

Manual commands:

```bash
npm run lint       # strict (no warnings allowed)
npm run lint:fix   # attempt auto-fix
npm run format     # run prettier across repo
```

## 5. Architecture Concepts

- Components organized by role: `atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`.
- Cross-cutting state via context providers: `GameContext`, `AudioContext`, `ModalContext`, `ToastContext`.
- Data/service logic in `src/services` (Supabase / Auth / domain helpers).
- Types centralized in `src/types` (barrel: `src/types/index.ts`).

## 6. Code Conventions

### 6.1 Exports

- NEVER use `export default`.
- Always inline: `export const ComponentName = (...) => { ... };`

### 6.2 Components

- Functional arrow components only.
- Reusable prop types/interfaces live in `src/types/...` (local inline types only if truly private).

### 6.3 Import Order (enforced)

Groups (blank line between each):

1. External packages (React / npm libs)
2. `import type ...` (explicit type-only imports)
3. Internal project types (`/types`)
4. UI modules (atoms, molecules, organisms, templates, pages)
5. Other internal (context, hooks, services, utils, data)
6. Styles (`.css` / modules)

ESLint auto-sorts. Do not fight the linter—run `npm run lint:fix` if needed.

### 6.4 Types

- Shared/reusable → move to `src/types` + export via barrel.
- Prefer `import type { X } from '@/types';` for clarity and potential build optimization.

### 6.5 Naming

- Component files: PascalCase (e.g. `CharacterCard.tsx`).
- CSS Modules: same basename + `.module.css`.

### 6.6 General Style

- Prefer composition to deeply branching conditional logic.
- Avoid heavy async logic inside JSX; move to hooks/services.

## 7. Adding a New Component (AGENT CHECKLIST)

1. Create a folder at correct layer (atoms/molecules/etc.).
2. Define prop interface (if reusable) in `src/types/components-*.ts` (or subfolder) and update barrel.
3. Implement with inline named export.
4. Respect import grouping.
5. Run `npm run lint:fix`.

## 8. Adding / Updating Types

1. Create or edit file in `src/types/`.
2. Export from that file and (if broadly reused) add to barrel `src/types/index.ts`.
3. Replace duplicated inline definitions.
4. Run lint fix.

## 9. Services / Data

- All Supabase / Auth0 / persistence logic in `src/services`.
- Avatar handling: reuse `resolveAvatarUrl` and `uploadAvatar` (do not duplicate logic).

## 10. Contexts

- Follow existing pattern (createContext + `useXxx` hook).
- Context-specific types under `src/types/context/`.

## 11. Avatars / Upload Flow

Canonical flow (2025-09 update):

1. Usuario selecciona archivo en `AvatarUploader`.
2. Llamar `uploadAvatar(file, userId)` -> devuelve path relativo en bucket público `avatars`.
3. Convertir inmediatamente a URL pública FULL usando `publicAvatarUrlFor(path)`.
4. Persistir esa URL FULL en la columna `avatar_url` vía `updatePlayerAvatar`.
5. Disparar `dispatch({ type: 'SET_AVATAR', payload: fullUrl })`.

Convención: `player.avatarPath` ahora ALMACENA una URL completa (no un path). El código mantiene retro-compatibilidad convirtiendo paths relativos antiguos al vuelo.

Helper central: `resolvePlayerAvatar({ avatarUrl, avatarPath, legacyAvatar, authPicture })` para derivar la imagen mostrando prioridad:

1. `avatarUrl` explícito
2. `avatarPath` (ya debe ser URL completa; si no lo es se normaliza)
3. `legacyAvatar` (campo heredado `avatar` si existe)
4. `authPicture` (foto de Auth0) como último recurso.

Evitar duplicar lógica de fallback en componentes; usar el helper.

## 12. Dependencies

- Add via `npm install <pkg>`.
- After adding: run `npm run lint` (import order may adjust).
- Avoid unnecessary or overlapping libraries.

## 13. Available Scripts (Summary)

| Task        | Command            |
| ----------- | ------------------ |
| Dev         | `npm run dev`      |
| Build       | `npm run build`    |
| Preview     | `npm start`        |
| Strict lint | `npm run lint`     |
| Auto-fix    | `npm run lint:fix` |
| Format      | `npm run format`   |

(Tests not yet present. See section 14 for proposal.)

## 14. Test Strategy (Proposal)

- Add `vitest` + `@testing-library/react`.
- Suggested scripts: `"test": "vitest run"`, `"test:watch": "vitest"`.
- Place tests in `src/__tests__/` or adjacent `*.test.tsx` files.

## 15. Change Strategy (For Agents)

1. Read `AGENTS.md` & `eslint.config.js` before editing.
2. Locate target file (semantic search / grep).
3. If changing types → update barrel.
4. Run `npm run lint:fix` and revalidate.
5. Avoid introducing new dependencies without justification.
6. Do not change build tooling unless task explicitly requires it.

## 16. Avoid

- `export default`.
- Duplicated type definitions.
- Direct Supabase access outside `services`.
- Bypassing pre-commit (fix failures instead).

## 17. Security

- Never commit Auth0 / Supabase secrets.
- No hardcoded tokens.

## 18. Common Issues & Quick Fixes

| Problem               | Fix                                                            |
| --------------------- | -------------------------------------------------------------- |
| Import order          | `npm run lint:fix`                                             |
| Missing types         | Add to `src/types` + barrel                                    |
| Hook outside provider | Wrap with provider (e.g. `ToastProvider`)                      |
| Avatar not loading    | Usa `resolvePlayerAvatar` / normaliza con `publicAvatarUrlFor` |

## 19. Suggested Roadmap (Optional)

- Introduce test suite (Vitest).
- Add character data caching.
- Improve centralized network error handling with toasts.

## 20. How an Agent Should Operate

- Minimize unnecessary tool calls: read file before editing.
- Make atomic changes (one file per edit when feasible).
- Run lint after each logical change group.
- Commit messages should mention which convention was applied.

## 21. Environment / Secrets Handling (Critical)

- `.env`, `.env.local`, and variant files are ignored by git.
- NEVER expose Supabase keys, JWT secrets, Auth0 client secrets, or storage bucket URLs with elevated perms.
- If adding new required vars, update `.env.example` (create if missing) with placeholder values only.
- Before committing, run `git diff --staged` and ensure no secret values are present.

---

Living document. Update when introducing new layers (tests, CI, etc.).
