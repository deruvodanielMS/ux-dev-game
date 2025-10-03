# AGENTS.md - Master Control System

**Multi-Agent Architecture for "Duelo de Código" Development**

## 🤖 Agent Team Overview

This repository uses a **specialized multi-agent system** where each agent has distinct responsibilities and collaborates through defined protocols to maintain architectural integrity.

### 🎯 Core Agent Roles

| Agent                                | Specialization       | Primary Focus                                              |
| ------------------------------------ | -------------------- | ---------------------------------------------------------- |
| **UX-Developer** `($UI-Architect$)`  | Layout, Styles, A11y | Component design, CSS, accessibility, user experience      |
| **FE-Developer** `($Data-Engineer$)` | API, State, Data     | Data fetching, state management, business logic, types     |
| **QA** `($Code-Guardian$)`           | Testing, Quality     | Unit tests, E2E tests, pre-commit validation, code quality |

## 🏛️ Agent Communication Protocol

### Workflow: Feature Development

```
1. FE-Developer: Creates types, data structures, business logic
   ↓
2. UX-Developer: Implements UI, styling, accessibility
   ↓
3. QA: Writes tests, validates, runs quality checks
   ↓
4. All Agents: Cross-validate and handoff for integration
```

### Handoff Checkpoints

- **FE → UX**: Data contracts defined, types exported, logic hooks ready
- **UX → QA**: Components implemented, styled, accessible
- **QA → Integration**: Tests passing, quality gates met

## 📋 Project Architecture

"Duelo de Código" – a gamified experience built with React 19, Vite 7, and TypeScript. Features Auth (Auth0 + Supabase), avatar upload, and player progress.

## 🚀 Agent Activation Commands

Each agent can be activated with specific role assignments for autonomous work:

### Activate UX-Developer Agent

```markdown
ACT AS UX-Developer ($UI-Architect$)
Specialized in: Layout, CSS Modules, Accessibility, Component Design
Consult: agents/UX-Developer.md and src/components/AGENTS.md for specific patterns
Autonomous work: Implement complete components following FE-Developer handoff
```

### Activate FE-Developer Agent

```markdown
ACT AS FE-Developer ($Data-Engineer$)
Specialized in: Types, State Management, API Integration, Business Logic
Consult: agents/FE-Developer.md and src/services/AGENTS.md for specific patterns
Autonomous work: Create complete technical foundation before handoff to UX-Developer
```

### Activate QA Agent

```markdown
ACT AS QA ($Code-Guardian$)
Specialized in: Unit Tests, E2E Tests, Quality Gates, Pre-commit Validation
Consult: agents/QA.md for testing patterns
Autonomous work: Validate complete features with exhaustive testing and quality gates
```

### Activate FE-Developer Agent

```markdown
ACTÚA COMO FE-Developer ($Data-Engineer$)
Especializado en: Types, State Management, API Integration, Business Logic
Consulta: agents/FE-Developer.md y src/services/AGENTS.md para patrones específicos
Trabajo autónomo: Crea fundación técnica completa antes de handoff a UX-Developer
```

### Activate QA Agent

```markdown
ACTÚA COMO QA ($Code-Guardian$)
Especializado en: Unit Tests, E2E Tests, Quality Gates, Pre-commit Validation
Consulta: agents/QA.md para patrones de testing específicos
Trabajo autónomo: Valida features completas con testing exhaustivo y quality gates
```

## 🚀 Quick Agent Activation Commands

### Complete Feature Development

```markdown
USER REQUEST: "Create new component ComponentName"

ACT AS FE-Developer ($Data-Engineer$):

- Define types in src/types/components/
- Create custom hooks with business logic
- Export via barrel pattern
- HANDOFF: "Types defined, hooks ready, logic implemented"

ACT AS UX-Developer ($UI-Architect$):

- Implement component with typed props
- Create responsive CSS Module
- Add accessibility attributes and data-testid
- HANDOFF: "Component implemented, accessible, ready for testing"

ACT AS QA ($Code-Guardian$):

- Write unit tests with >90% coverage
- Add E2E tests for user journeys
- Validate accessibility and performance
- HANDOFF: "Feature tested and ready for production"
```

## 🎯 Autonomous Agent Protocols

### For LLMs Working with This System

#### Protocol 1: Feature Creation (Full Autonomous Cycle)

```markdown
USER REQUEST: "Create new component ComponentName"

STEP 1 - Activate FE-Developer:
🔧 ACT AS FE-Developer ($Data-Engineer$)

- Analyze requirements and define types in src/types/components/
- Create custom hooks with business logic
- Implement services if needed
- Export via barrel pattern
- HANDOFF: "Types defined, hooks implemented, logic ready for UI"

STEP 2 - Activate UX-Developer:
🎨 ACT AS UX-Developer ($UI-Architect$)

- Implement JSX component with typed props
- Create CSS Module with responsive design
- Add data-testid and ARIA attributes
- Follow Atomic Design patterns
- HANDOFF: "Component implemented, accessible, ready for testing"

STEP 3 - Activate QA:
🛡️ ACT AS QA ($Code-Guardian$)

- Create unit tests with >90% coverage
- Implement E2E tests for user journeys
- Validate accessibility compliance
- Execute quality gates
- HANDOFF: "Feature completely validated, ready for production"
```

#### Protocol 2: Bug Fix (Autonomous Debugging)

```markdown
USER REQUEST: "Fix bug in ComponentName"

STEP 1 - Activate QA (Analysis):
🛡️ ACT AS QA ($Code-Guardian$)

- Reproduce bug with tests
- Identify root cause
- Determine if UI, logic, or integration issue
- HANDOFF: "Bug reproduced, cause identified: [UI/Logic/Data]"

STEP 2 - Activate Appropriate Agent:
If UI issue → UX-Developer
If Logic/Data issue → FE-Developer
If Testing issue → QA handles directly

STEP 3 - Validate Fix:
🛡️ ACT AS QA ($Code-Guardian$)

- Execute tests to confirm fix
- Validate no regression
- HANDOFF: "Bug fixed, no regression, tests passing"
```

#### Protocol 3: Performance Optimization

```markdown
USER REQUEST: "Optimize component performance"

STEP 1 - Activate QA (Analysis):
🛡️ ACT AS QA ($Code-Guardian$)

- Profile performance issues
- Identify bottlenecks
- Run performance tests
- HANDOFF: "Performance issues identified: [specific bottlenecks]"

STEP 2 - Activate FE-Developer (Logic Optimization):
🔧 ACT AS FE-Developer ($Data-Engineer$)

- Optimize hooks and data flow
- Implement memoization strategies
- Optimize API calls and caching
- HANDOFF: "Logic optimizations implemented"

STEP 3 - Activate UX-Developer (UI Optimization):
🎨 ACT AS UX-Developer ($UI-Architect$)

- Optimize CSS and animations
- Implement lazy loading
- Optimize images and assets
- HANDOFF: "UI optimizations implemented"

STEP 4 - Validate Performance:
🛡️ ACT AS QA ($Code-Guardian$)

- Re-run performance tests
- Validate improvements
- Update performance benchmarks
- HANDOFF: "Performance optimized, benchmarks updated"
```

## 🔧 LLM Integration Protocols

### Critical Rules for LLM Agents

1. **ALWAYS Read Agent Specifications First**

   ```markdown
   Before any work, MUST read:

   - src/[domain]/AGENTS.md for domain-specific guidance
   - Main AGENTS.md for complete protocols and handoff procedures
   ```

2. **Follow Handoff Protocol Strictly**

   ```markdown
   - Never skip agent sequence (FE → UX → QA)
   - Always provide exact handoff messages
   - Validate previous agent's work before proceeding
   ```

3. **Quality Gates Are Mandatory**

   ```markdown
   - Run linting after each change
   - Type-check before handoff
   - Test coverage must be >90%
   - All tests must pass before declaring completion
   ```

4. **Autonomous Operation Guidelines**
   ```markdown
   - Read requirements completely before starting
   - Plan entire feature architecture upfront
   - Make atomic, logical commits
   - Self-validate work at each step
   ```

## 🏗️ Architecture Overview

### Module Structure

```
src/
├── components/     # UI Components (UX-Developer domain)
│   └── AGENTS.md  # Component-specific agent guidance
├── services/      # Data Layer (FE-Developer domain)
│   └── AGENTS.md  # Service patterns and API integration
├── types/         # Type System (FE-Developer domain)
│   └── AGENTS.md  # Type organization and patterns
├── context/       # State Management (FE-Developer domain)
│   └── AGENTS.md  # Context patterns and state
├── pages/         # Route Components (Shared domain)
│   └── AGENTS.md  # Page architecture patterns
└── __tests__/     # Test Suite (QA domain)
```

## 🔄 Inter-Agent Protocols

### Protocol 1: Component Creation

**Scenario**: Creating a new component (e.g., `<CodeCard />`)

1. **FE-Developer** `($Data-Engineer$)`:
   - Define `interface ComponentProps` in `src/types/components/`
   - Create custom hooks for logic (e.g., `useCardLogic`)
   - Export types via barrel pattern
   - **Handoff**: "Types defined, logic ready for UI implementation"

2. **UX-Developer** `($UI-Architect$)`:
   - Implement component JSX structure
   - Create CSS Module with accessibility considerations
   - Follow Atomic Design layer (atoms/molecules/organisms)
   - Add `data-testid` attributes
   - **Handoff**: "Component implemented, ready for testing"

3. **QA** `($Code-Guardian$)`:
   - Write unit tests for component and hooks
   - Add E2E tests if needed
   - Validate accessibility compliance
   - Run quality gates
   - **Final**: "Component tested and validated"

### Protocol 2: API Integration

**Scenario**: Adding new API endpoint integration

1. **FE-Developer** `($Data-Engineer$)`:
   - Define response types in `src/types/`
   - Create service function in `src/services/`
   - Implement error handling and loading states
   - **Handoff**: "API service ready for UI consumption"

2. **UX-Developer** `($UI-Architect$)`:
   - Create loading/error UI states
   - Implement data display components
   - Handle edge cases in UI
   - **Handoff**: "UI integrated with API service"

3. **QA** `($Code-Guardian$)`:
   - Mock API for unit tests
   - Test error scenarios
   - Add E2E tests for API flows
   - **Final**: "API integration tested end-to-end"

## 🎯 Environment & Setup

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

## 22. Player Caching & Ladder Strategy (2025-09)

Para reducir requests repetidos a Supabase:

1. Hook `useLadderPlayers` (nuevo):
   - Cache in-memory (estado React) + TTL configurable (default 30s).
   - Evita solicitudes simultáneas usando `inFlight` ref.
   - Expone `refresh()` para forzar refetch manual.
   - Ordena jugadores con `sortPlayersForLadder` centralizada.
2. Futuro (no implementado aún):
   - `PlayersContext` global que unifique ladder + detalles de jugador y permita suscripción realtime.
   - Canal realtime Supabase: invalidar cache al recibir INSERT/UPDATE/DELETE en `players`.
3. Convenciones de normalización:
   - Avatar: almacenar siempre URL completa (`avatarUrl`) y normalizar paths con `publicAvatarUrlFor` al ingresar.
   - Orden ladder: nivel DESC, experiencia DESC, nombre ASC.
4. Uso recomendado en componentes:
   ```tsx
   import { useLadderPlayers } from '@/hooks/useLadderPlayers';
   const { ladder, loading, refresh, stale } = useLadderPlayers();
   // mostrar botón Refresh sólo si stale o usuario lo solicita
   ```
5. Política de fallback offline:
   - Si `fetchPlayers` falla, se retorna copia local (localStorage) y `error` se setea para UI opcional.
6. Evitar múltiples fetch locales:
   - Reutilizar el mismo hook en cada render; React deduplica si vive en un único componente contenedor.
7. Próximos pasos sugeridos (para agentes):
   - Implementar `PlayersContext` con proveedores derivados (ladder, topN, findById).
   - Integrar realtime y invalidación granular (solo reemplazar jugador mutado).
   - Agregar métrica simple (console.debug) en dev para contar fetch reales.

Esta sección debe actualizarse cuando se agregue el contexto global o el soporte realtime.
