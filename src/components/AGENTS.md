# Components Domain Guide

**Quick reference for component development - see main AGENTS.md for full protocols**

## 🎯 Primary Agent: UX-Developer ($UI-Architect$)

**Specializes in**: Component structure, CSS Modules, accessibility, responsive design

## 🏗️ Key Patterns

### Structure

```
atoms/ → molecules/ → organisms/ → templates/
```

### Key Rules

- **Never** use `export default` - always inline named exports
- Add `data-testid` for all interactive elements
- Include ARIA attributes for accessibility
- Use CSS Modules with responsive design
- Follow handoff protocol: FE-Developer → UX-Developer → QA

### Component Template

```tsx
export const ComponentName = ({ title, ...props }: ComponentProps) => {
  const { state, actions } = useComponentLogic(props);

  return (
    <article
      className={styles.component}
      data-testid="component-name"
      role="region"
      aria-labelledby="title"
    >
      <h3 id="title">{title}</h3>
      {/* Component content */}
    </article>
  );
};
```

### 4. **Props & Types**

- **Shared types**: Define in `src/types/components/components-[layer].ts`
- **Private types**: Inline only if truly component-specific
- **Forward props**: Always spread `{...rest}` for reusability

## 🎯 Layer Guidelines

### Atoms (`src/components/atoms/`)

**Purpose**: Basic, indivisible UI elements

- No business logic
- Highly reusable
- Focus on presentation
- Example: Button, Skeleton, TurnIndicator

**Adding an Atom:**

```tsx
// atoms/NewAtom/NewAtom.tsx
export const NewAtom = ({ variant, children, ...rest }: NewAtomProps) => {
  return (
    <element className={styles[variant]} {...rest}>
      {children}
    </element>
  );
};
```

### Molecules (`src/components/molecules/`)

**Purpose**: Simple combinations of atoms

- Limited business logic
- Reusable across different contexts
- Example: PlayerCard, StatDisplay, AvatarUploader

### Organisms (`src/components/organisms/`)

**Purpose**: Complex, feature-complete components

- May contain business logic
- Often context-aware
- Example: Header, CharacterList, Ladderboard

### Templates (`src/components/templates/`)

**Purpose**: Layout and page structure

- Define page layouts
- Compose organisms and molecules
- Example: ProgressMapTemplate

## 🔧 Technical Requirements

### Import Order (Enforced by ESLint)

1. External packages (React, npm libs)
2. `import type ...` (explicit type imports)
3. Internal types (`@/types`)
4. Other atoms/molecules/organisms
5. Context, hooks, services, utils
6. Styles (`.css` / modules)

### CSS Modules

- Use for all styling
- Prefix classes with component name
- BEM-like naming: `.componentName__element--modifier`

### Data Attributes

- Add `data-testid` for E2E testing
- Use kebab-case: `data-testid="login-button"`

## 🎮 Game-Specific Patterns

### Character/Enemy Display

- Use `CharacterCard` for character representation
- Avatar handling: Use `resolvePlayerAvatar()` helper
- Stats: Use `StatDisplay` molecule

### Battle Components

- Attack actions: Use `AttackButton` atom
- Damage feedback: Use `DamageNumber` atom
- Health/status: Use `StatusBar` atom

### Navigation & Layout

- App-wide nav: Use `Header` organism
- Modals: Use `Modal` organism with `ModalContext`
- Footer: Use `AppFooter` organism

## 🚀 Adding New Components

### 1. Choose the Right Layer

- **Atom**: Single-purpose, no dependencies
- **Molecule**: Combines atoms, limited logic
- **Organism**: Complex functionality, may use context
- **Template**: Layout and page structure

### 2. Create Component Structure

```bash
mkdir src/components/[layer]/ComponentName
touch src/components/[layer]/ComponentName/ComponentName.tsx
touch src/components/[layer]/ComponentName/ComponentName.module.css
```

### 3. Define Types (if reusable)

Add to `src/types/components/components-[layer].ts`:

```tsx
export interface ComponentNameProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'primary' | 'secondary';
  customProp?: string;
}
```

### 4. Implement Component

```tsx
import type { ComponentNameProps } from '@/types';
import styles from './ComponentName.module.css';

export const ComponentName = ({
  variant = 'primary',
  customProp,
  children,
  className,
  ...rest
}: ComponentNameProps) => {
  return (
    <div
      className={`${styles.componentName} ${styles[variant]} ${className || ''}`}
      data-testid="component-name"
      {...rest}
    >
      {children}
    </div>
  );
};
```

## ⚠️ Common Mistakes to Avoid

1. **Export defaults**: Never use them
2. **Inline styles**: Always use CSS modules
3. **Missing data-testid**: Add for testability
4. **Not forwarding props**: Always spread `{...rest}`
5. **Wrong layer**: Atoms shouldn't contain molecules
6. **Duplicate types**: Use shared types from `@/types`

## 🔍 Context Integration

### Using Context in Components

```tsx
import { useGameContext } from '@/context/GameContext';

export const GameAwareComponent = () => {
  const { state, dispatch } = useGameContext();

  return <div>{/* Use state and dispatch */}</div>;
};
```

### Available Contexts

- `GameContext`: Game state and actions
- `PlayerContext`: Player data and authentication
- `ModalContext`: Modal management
- `ToastContext`: Notifications
- `AudioContext`: Sound effects

## 📚 Component Examples

### Simple Atom

```tsx
// atoms/Button/Button.tsx
export const Button = ({
  variant = 'primary',
  disabled,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[variant]}`}
      disabled={disabled}
      data-testid="button"
      {...rest}
    >
      {children}
    </button>
  );
};
```

### Context-aware Organism

```tsx
// organisms/Header/Header.tsx
import { usePlayerContext } from '@/context/PlayerContext';

export const Header = ({ className, ...rest }: HeaderProps) => {
  const { player, isAuthenticated } = usePlayerContext();

  return (
    <header className={`${styles.header} ${className || ''}`} {...rest}>
      {isAuthenticated ? <PlayerCard player={player} /> : <AuthButton />}
    </header>
  );
};
```

## 🧪 Testing Components

- Add `data-testid` attributes
- Test user interactions, not implementation
- Use React Testing Library patterns
- E2E tests should use page objects

## 📱 Responsive Design

- Mobile-first approach
- Use CSS modules with media queries
- Consider touch interactions for game elements
- Test on different screen sizes

---

**Remember**: Components should be predictable, reusable, and follow the established patterns. When in doubt, look at existing components for reference.
