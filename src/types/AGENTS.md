# Types Domain Guide

**Quick reference for type development - see main AGENTS.md for full protocols**

## 🎯 Primary Agent: FE-Developer ($Data-Engineer$)

**Specializes in**: TypeScript interfaces, type organization, data contracts

## 🏗️ Key Patterns

### Structure

```
index.ts (barrel) ← domain/*.ts ← components/*.ts
```

### Key Rules

- Define all interfaces with complete properties
- Use union types for constrained values (`'common' | 'rare'`)
- Export everything via barrel pattern in index.ts
- Create type guards for runtime validation
- Follow handoff protocol: FE-Developer → UX-Developer → QA

### Type Template

```typescript
export interface Entity {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

export interface EntityProps {
  entity: Entity;
  variant?: 'default' | 'compact';
  onClick?: (entity: Entity) => void;
  'data-testid'?: string;
}

export const isEntity = (obj: unknown): obj is Entity => {
  return typeof obj === 'object' && obj !== null && 'id' in obj;
};
```

### Workflow Reference

**For complete protocols see [main AGENTS.md](../../AGENTS.md)**

- **Type-First**: Define interfaces before implementation
- **Validation**: Create type guards for runtime safety
- **Testing**: Export typed interfaces for component testing
- **Handoff**: "Types defined, interfaces ready for UI implementation"
