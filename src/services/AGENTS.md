# Services Domain Guide

**Quick reference for service development - see main AGENTS.md for full protocols**

## 🎯 Primary Agent: FE-Developer ($Data-Engineer$)

**Specializes in**: API integration, data fetching, error handling, business logic

## 🏗️ Key Patterns

### Structure

```
auth.ts → characters.ts → players.ts → supabase.ts
```

### Key Rules

- Define types first in src/types/
- Handle all error scenarios with ServiceError
- Provide loading/error states for UI consumption
- Create custom hooks for service integration
- Follow handoff protocol: FE-Developer → QA → UX-Developer

### Service Template

```typescript
export const fetchEntity = async (id: string): Promise<Entity> => {
  try {
    const { data, error } = await supabase
      .from('entities')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw createServiceError('FETCH_FAILED', error.message);
    return data;
  } catch (error) {
    throw createServiceError('NETWORK_ERROR', 'Failed to fetch entity');
  }
};
```

### Service Architecture Principles

#### 1. **Single Responsibility**

- Each service handles one domain (auth, players, characters, etc.)
- Pure functions where possible
- No UI logic - only data operations

### 2. **Database Abstraction**

- All Supabase operations centralized in services
- Components never import `supabase` directly
- Error handling at service level

### 3. **Type Safety**

- All service functions are strongly typed
- Return consistent response shapes
- Use domain types from `@/types`

## 📋 Service Patterns

### Core Service Structure

```tsx
// services/example.ts
import type { ExampleType } from '@/types';
import { supabase } from './supabase';

export const fetchExamples = async (): Promise<ExampleType[]> => {
  try {
    const { data, error } = await supabase.from('examples').select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching examples:', error);
    throw error;
  }
};

export const createExample = async (
  example: Omit<ExampleType, 'id'>,
): Promise<ExampleType> => {
  // Implementation
};

export const updateExample = async (
  id: string,
  updates: Partial<ExampleType>,
): Promise<ExampleType> => {
  // Implementation
};

export const deleteExample = async (id: string): Promise<void> => {
  // Implementation
};
```

## 🔧 Individual Services

### `supabase.ts` - Database Client

**Purpose**: Central database configuration and client

```tsx
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper for handling Supabase errors
export const handleSupabaseError = (error: any, context: string) => {
  console.error(`Supabase error in ${context}:`, error);
  throw new Error(`${context}: ${error.message}`);
};
```

### `auth.ts` - Authentication

**Purpose**: Auth0 integration and session management

```tsx
import type { User } from '@auth0/auth0-react';

export const getCurrentUser = (): User | null => {
  // Auth0 user extraction
};

export const getUserId = (user: User): string => {
  return user.sub || '';
};

export const isAuthenticated = (): boolean => {
  // Check authentication status
};
```

### `players.ts` - Player Operations

**Purpose**: Player CRUD operations and profile management

```tsx
import type { Player } from '@/types';

export const fetchPlayers = async (): Promise<Player[]> => {
  // Fetch all players with error handling
};

export const fetchPlayerById = async (id: string): Promise<Player | null> => {
  // Fetch single player
};

export const createPlayer = async (
  playerData: Omit<Player, 'id'>,
): Promise<Player> => {
  // Create new player
};

export const updatePlayer = async (
  id: string,
  updates: Partial<Player>,
): Promise<Player> => {
  // Update player data
};

export const updatePlayerAvatar = async (
  playerId: string,
  avatarUrl: string,
): Promise<void> => {
  // Update player avatar specifically
};
```

### `avatars.ts` - Avatar Management

**Purpose**: Avatar upload and URL resolution

```tsx
export const uploadAvatar = async (
  file: File,
  userId: string,
): Promise<string> => {
  // Upload to Supabase storage
  // Return storage path (not full URL)
};

export const publicAvatarUrlFor = (path: string): string => {
  // Convert storage path to public URL
};

export const resolvePlayerAvatar = (player: {
  avatarUrl?: string;
  avatarPath?: string;
  legacyAvatar?: string;
  authPicture?: string;
}): string => {
  // Priority fallback logic for avatar resolution
  // 1. avatarUrl (explicit)
  // 2. avatarPath (convert to URL)
  // 3. legacyAvatar (legacy field)
  // 4. authPicture (Auth0 photo)
  // 5. Default avatar
};
```

### `characters.ts` - Character Data

**Purpose**: Character and enemy data operations

```tsx
import type { Character, Enemy } from '@/types';

export const getCharacters = (): Character[] => {
  // Load from JSON or database
};

export const getEnemies = (): Enemy[] => {
  // Load enemy data
};

export const getCharacterById = (id: string): Character | null => {
  // Find specific character
};

export const getEnemyById = (id: string): Enemy | null => {
  // Find specific enemy
};
```

### `levels.ts` - Level Progression

**Purpose**: Level calculations and progression logic

```tsx
export const calculateLevel = (experience: number): number => {
  // Level calculation formula
};

export const experienceForLevel = (level: number): number => {
  // Required experience for level
};

export const experienceToNextLevel = (currentExp: number): number => {
  // Experience needed for next level
};

export const getUnlockedCharacters = (level: number): string[] => {
  // Characters unlocked at level
};
```

## 🔄 Error Handling Patterns

### Consistent Error Structure

```tsx
export interface ServiceError {
  message: string;
  code?: string;
  details?: any;
}

export const createServiceError = (
  message: string,
  code?: string,
  details?: any,
): ServiceError => ({
  message,
  code,
  details,
});
```

### Error Handling in Services

```tsx
export const fetchData = async (): Promise<DataType[]> => {
  try {
    const { data, error } = await supabase.from('table').select('*');

    if (error) {
      throw createServiceError('Failed to fetch data', 'FETCH_ERROR', error);
    }

    return data || [];
  } catch (error) {
    console.error('Service error:', error);
    throw error; // Re-throw for component handling
  }
};
```

## 🚀 Service Usage in Components

### Hook Pattern for Services

```tsx
// hooks/useServiceData.ts
import { useState, useEffect } from 'react';
import { fetchData } from '@/services/dataService';

export const useServiceData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const result = await fetchData();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, loading, error };
};
```

### Direct Service Usage in Components

```tsx
// Component with service integration
import { updatePlayer } from '@/services/players';
import { useToast } from '@/context/ToastContext';

export const PlayerForm = () => {
  const { showToast } = useToast();

  const handleSave = async (playerData) => {
    try {
      await updatePlayer(player.id, playerData);
      showToast('Player updated successfully', 'success');
    } catch (error) {
      showToast('Failed to update player', 'error');
      console.error('Update failed:', error);
    }
  };

  return (
    // Component JSX
  );
};
```

## 🔧 Service Best Practices

### 1. **Environment Variables**

```tsx
// Always validate env vars
const requiredEnvVar = import.meta.env.VITE_REQUIRED_VAR;
if (!requiredEnvVar) {
  throw new Error('Missing required environment variable: VITE_REQUIRED_VAR');
}
```

### 2. **Return Type Consistency**

```tsx
// ✅ Good - Consistent return types
export const fetchPlayer = async (id: string): Promise<Player | null> => {
  // Always returns Player or null
};

// ❌ Bad - Inconsistent returns
export const fetchPlayer = async (id: string) => {
  if (error) return false;
  if (!found) return undefined;
  return player;
};
```

### 3. **Error Boundaries**

```tsx
// Service should not crash the app
export const riskyOperation = async (): Promise<Result | null> => {
  try {
    return await performOperation();
  } catch (error) {
    console.error('Operation failed:', error);
    return null; // Graceful fallback
  }
};
```

### 4. **Caching Strategy**

```tsx
// Simple in-memory cache for frequent data
const cache = new Map();

export const getCachedData = async (key: string): Promise<DataType[]> => {
  if (cache.has(key)) {
    return cache.get(key);
  }

  const data = await fetchData();
  cache.set(key, data);
  return data;
};
```

## 🎮 Game-Specific Patterns

### Player Progress Persistence

```tsx
export const persistProgress = async (
  playerId: string,
  progress: GameProgress,
): Promise<void> => {
  try {
    await updatePlayer(playerId, {
      level: progress.level,
      experience: progress.experience,
      unlockedCharacters: progress.unlockedCharacters,
    });
  } catch (error) {
    console.error('Failed to persist progress:', error);
    throw error;
  }
};
```

### Battle Result Processing

```tsx
export const processBattleResult = async (
  playerId: string,
  enemyId: string,
  victory: boolean,
): Promise<BattleReward> => {
  const enemy = getEnemyById(enemyId);
  const reward = calculateReward(enemy, victory);

  if (victory) {
    await updatePlayer(playerId, {
      experience: currentPlayer.experience + reward.experience,
      // ... other updates
    });
  }

  return reward;
};
```

## 🔍 Testing Services

### Mock Service Functions

```tsx
// For testing - create service mocks
export const mockPlayerService = {
  fetchPlayers: jest.fn().mockResolvedValue([]),
  createPlayer: jest.fn().mockResolvedValue(mockPlayer),
  updatePlayer: jest.fn().mockResolvedValue(mockPlayer),
};
```

## ⚠️ Common Mistakes to Avoid

1. **Direct Supabase imports in components**

   ```tsx
   // ❌ Bad
   import { supabase } from '@/services/supabase';

   // ✅ Good
   import { fetchPlayers } from '@/services/players';
   ```

2. **Not handling errors**

   ```tsx
   // ❌ Bad
   export const fetchData = async () => {
     const { data } = await supabase.from('table').select('*');
     return data;
   };

   // ✅ Good
   export const fetchData = async () => {
     try {
       const { data, error } = await supabase.from('table').select('*');
       if (error) throw error;
       return data || [];
     } catch (error) {
       console.error('Fetch error:', error);
       throw error;
     }
   };
   ```

3. **Mixing UI logic in services**

   ```tsx
   // ❌ Bad
   export const savePlayer = async (player) => {
     const result = await updatePlayer(player);
     toast.success('Saved!'); // UI logic in service
     return result;
   };

   // ✅ Good - Handle UI in component
   const handleSave = async () => {
     try {
       await savePlayer(player);
       showToast('Saved!', 'success');
     } catch (error) {
       showToast('Save failed', 'error');
     }
   };
   ```

---

**Remember**: Services are the bridge between your UI and data. Keep them focused, error-resistant, and well-typed.
