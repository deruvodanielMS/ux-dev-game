# AGENTS.md - Context

**State Management & Context Architecture Guide for LLMs working on "Duelo de Código"**

## 🌐 Context Overview

```
src/context/
├── AudioContext.tsx        # Sound effects and music
├── GameContext.tsx         # Game state and battle logic
├── ModalContext.tsx        # Modal management
├── PlayerContext.tsx       # Player data and authentication
└── ToastContext.tsx        # Notification system
```

## 🎯 Context Architecture Principles

### 1. **Single Responsibility**

- Each context manages one domain of state
- Clear separation of concerns
- Minimal overlap between contexts

### 2. **Provider Pattern**

- Wrap app/sections with providers
- Use custom hooks for consumption
- Type-safe context access

### 3. **Performance Optimization**

- Split contexts to minimize re-renders
- Use `useMemo` and `useCallback` appropriately
- Lazy initialization where possible

## 📋 Context Patterns

### Base Context Structure

```tsx
// context/ExampleContext.tsx
import { createContext, useContext, useReducer, type ReactNode } from 'react';
import type { ExampleState, ExampleAction } from '@/types';

// Context type
interface ExampleContextValue {
  state: ExampleState;
  dispatch: React.Dispatch<ExampleAction>;
  // Helper methods
  helperMethod: () => void;
}

// Create context with null default
const ExampleContext = createContext<ExampleContextValue | null>(null);

// Custom hook for consuming context
export const useExampleContext = (): ExampleContextValue => {
  const context = useContext(ExampleContext);
  if (!context) {
    throw new Error('useExampleContext must be used within ExampleProvider');
  }
  return context;
};

// Provider component
export const ExampleProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(exampleReducer, initialState);

  const helperMethod = useCallback(() => {
    // Helper logic
  }, []);

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      helperMethod,
    }),
    [state, helperMethod],
  );

  return (
    <ExampleContext.Provider value={contextValue}>
      {children}
    </ExampleContext.Provider>
  );
};
```

## 🔧 Individual Contexts

### `GameContext.tsx` - Game State

**Purpose**: Battle mechanics, game progression, current game state

```tsx
interface GameState {
  currentLevel: number;
  currentEnemy: Enemy | null;
  battleState: BattleState | null;
  unlockedCharacters: string[];
  gameMode: 'menu' | 'battle' | 'progression';
}

type GameAction =
  | { type: 'START_BATTLE'; payload: { enemy: Enemy } }
  | { type: 'END_BATTLE'; payload: { winner: 'player' | 'enemy' } }
  | { type: 'LEVEL_UP'; payload: { newLevel: number } }
  | { type: 'UNLOCK_CHARACTER'; payload: { characterId: string } };

export const useGameContext = () => {
  const context = useContext(GameContext);
  // ...
  return {
    state,
    dispatch,
    startBattle: (enemy: Enemy) =>
      dispatch({ type: 'START_BATTLE', payload: { enemy } }),
    endBattle: (winner: 'player' | 'enemy') =>
      dispatch({ type: 'END_BATTLE', payload: { winner } }),
  };
};
```

**Key Features:**

- Battle state management
- Level progression tracking
- Character unlocking logic
- Game mode transitions

### `PlayerContext.tsx` - Player & Auth

**Purpose**: Player data, authentication state, profile management

```tsx
interface PlayerState {
  player: Player | null;
  players: Player[]; // For leaderboard
  isAuthenticated: boolean;
  loading: boolean;
}

export const usePlayerContext = () => {
  // Auth0 integration
  const { user, isAuthenticated, isLoading } = useAuth0();

  const updatePlayer = useCallback(
    async (updates: Partial<Player>) => {
      if (!player) return;

      try {
        const updatedPlayer = await updatePlayerService(player.id, updates);
        setPlayer(updatedPlayer);
      } catch (error) {
        console.error('Failed to update player:', error);
      }
    },
    [player],
  );

  return {
    player,
    players,
    isAuthenticated,
    loading: isLoading,
    updatePlayer,
    createPlayer,
    fetchPlayers,
  };
};
```

**Key Features:**

- Auth0 integration
- Player CRUD operations
- Leaderboard data
- Avatar management

### `ModalContext.tsx` - Modal Management

**Purpose**: Centralized modal state and operations

```tsx
interface ModalState {
  modals: Array<{
    id: string;
    component: React.ComponentType<any>;
    props?: any;
    persistent?: boolean;
  }>;
}

export const useModalContext = () => {
  const openModal = useCallback(
    (
      component: React.ComponentType<any>,
      props?: any,
      options?: { persistent?: boolean },
    ) => {
      const id = generateId();
      dispatch({
        type: 'OPEN_MODAL',
        payload: { id, component, props, ...options },
      });
      return id;
    },
    [],
  );

  const closeModal = useCallback((id?: string) => {
    dispatch({ type: 'CLOSE_MODAL', payload: { id } });
  }, []);

  return {
    modals: state.modals,
    openModal,
    closeModal,
    closeAllModals: () => dispatch({ type: 'CLOSE_ALL_MODALS' }),
  };
};
```

**Key Features:**

- Stack-based modal management
- Modal props passing
- Persistent modal support
- Programmatic modal control

### `ToastContext.tsx` - Notifications

**Purpose**: User feedback through toast notifications

```tsx
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  persistent?: boolean;
}

export const useToastContext = () => {
  const showToast = useCallback(
    (
      message: string,
      type: Toast['type'] = 'info',
      options?: { duration?: number; persistent?: boolean },
    ) => {
      const id = generateId();
      const toast: Toast = {
        id,
        message,
        type,
        duration: options?.duration || 3000,
        persistent: options?.persistent || false,
      };

      dispatch({ type: 'ADD_TOAST', payload: toast });

      if (!toast.persistent) {
        setTimeout(() => {
          dispatch({ type: 'REMOVE_TOAST', payload: { id } });
        }, toast.duration);
      }

      return id;
    },
    [],
  );

  return {
    toasts: state.toasts,
    showToast,
    removeToast: (id: string) =>
      dispatch({ type: 'REMOVE_TOAST', payload: { id } }),
    clearToasts: () => dispatch({ type: 'CLEAR_TOASTS' }),
  };
};
```

**Key Features:**

- Auto-dismiss functionality
- Different toast types
- Persistent toast support
- Queue management

### `AudioContext.tsx` - Sound Management

**Purpose**: Background music and sound effects

```tsx
interface AudioState {
  musicEnabled: boolean;
  sfxEnabled: boolean;
  musicVolume: number;
  sfxVolume: number;
  currentMusic: string | null;
}

export const useAudioContext = () => {
  const playSound = useCallback(
    (soundId: string, volume?: number) => {
      if (!state.sfxEnabled) return;

      const audio = new Audio(`/sounds/${soundId}.mp3`);
      audio.volume = volume || state.sfxVolume;
      audio.play().catch(console.error);
    },
    [state.sfxEnabled, state.sfxVolume],
  );

  const playMusic = useCallback(
    (musicId: string) => {
      if (!state.musicEnabled) return;

      // Stop current music
      if (currentMusicRef.current) {
        currentMusicRef.current.pause();
      }

      const music = new Audio(`/music/${musicId}.mp3`);
      music.volume = state.musicVolume;
      music.loop = true;
      music.play().catch(console.error);

      currentMusicRef.current = music;
      dispatch({ type: 'SET_CURRENT_MUSIC', payload: musicId });
    },
    [state.musicEnabled, state.musicVolume],
  );

  return {
    ...state,
    playSound,
    playMusic,
    stopMusic,
    toggleMusic,
    toggleSfx,
    setMusicVolume,
    setSfxVolume,
  };
};
```

**Key Features:**

- Sound effect management
- Background music control
- Volume controls
- Enable/disable toggles

## 🚀 Context Integration Patterns

### Provider Hierarchy

```tsx
// App.tsx - Context provider structure
import { GameProvider } from '@/context/GameContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { ModalProvider } from '@/context/ModalContext';
import { ToastProvider } from '@/context/ToastContext';
import { AudioProvider } from '@/context/AudioContext';

export const App = () => (
  <BrowserRouter>
    <Auth0Provider {...auth0Config}>
      <PlayerProvider>
        <GameProvider>
          <AudioProvider>
            <ModalProvider>
              <ToastProvider>
                <AppRoutes />
                <Modal />
                <Toast />
              </ToastProvider>
            </ModalProvider>
          </AudioProvider>
        </GameProvider>
      </PlayerProvider>
    </Auth0Provider>
  </BrowserRouter>
);
```

### Multi-Context Usage

```tsx
// Component using multiple contexts
import { useGameContext } from '@/context/GameContext';
import { usePlayerContext } from '@/context/PlayerContext';
import { useToastContext } from '@/context/ToastContext';
import { useAudioContext } from '@/context/AudioContext';

export const BattleComponent = () => {
  const { state: gameState, startBattle, endBattle } = useGameContext();
  const { player, updatePlayer } = usePlayerContext();
  const { showToast } = useToastContext();
  const { playSound } = useAudioContext();

  const handleVictory = async () => {
    playSound('victory');
    showToast('Victory!', 'success');

    const newExp = player.experience + gameState.currentEnemy.experience;
    await updatePlayer({ experience: newExp });

    endBattle('player');
  };

  return (
    // Battle component JSX
  );
};
```

### Context with Local State

```tsx
// Combining context with local component state
import { useState } from 'react';
import { useGameContext } from '@/context/GameContext';

export const BattleForm = () => {
  // Local form state
  const [selectedMove, setSelectedMove] = useState('');

  // Global game state
  const { state, dispatch } = useGameContext();

  const handleSubmit = () => {
    // Use both local and global state
    dispatch({
      type: 'PLAYER_MOVE',
      payload: { move: selectedMove, player: state.player },
    });
    setSelectedMove(''); // Reset local state
  };
};
```

## 🔧 Context Best Practices

### 1. **Error Boundaries in Providers**

```tsx
import { ErrorBoundary } from 'react-error-boundary';

export const SafeProvider = ({ children }) => (
  <ErrorBoundary fallback={<ProviderError />}>
    <ContextProvider>{children}</ContextProvider>
  </ErrorBoundary>
);
```

### 2. **Memoization for Performance**

```tsx
export const OptimizedProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Memoize expensive computations
  const derivedState = useMemo(() => {
    return computeExpensiveValue(state);
  }, [state.relevantProp]);

  // Memoize callbacks
  const stableCallback = useCallback((param) => {
    dispatch({ type: 'ACTION', payload: param });
  }, []); // No dependencies if dispatch is stable

  const contextValue = useMemo(
    () => ({
      state,
      dispatch,
      derivedState,
      stableCallback,
    }),
    [state, derivedState, stableCallback],
  );

  return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};
```

### 3. **Context Debugging**

```tsx
// Development-only context debugging
export const DebugProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const debugDispatch = useCallback(
    (action) => {
      if (process.env.NODE_ENV === 'development') {
        console.group(`🔄 ${action.type}`);
        console.log('Previous state:', state);
        console.log('Action:', action);
      }

      dispatch(action);

      if (process.env.NODE_ENV === 'development') {
        console.log('New state:', state);
        console.groupEnd();
      }
    },
    [state],
  );

  return (
    <Context.Provider value={{ state, dispatch: debugDispatch }}>
      {children}
    </Context.Provider>
  );
};
```

### 4. **Context Persistence**

```tsx
// Persist context state to localStorage
export const PersistentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState, (initial) => {
    const saved = localStorage.getItem('contextState');
    return saved ? JSON.parse(saved) : initial;
  });

  useEffect(() => {
    localStorage.setItem('contextState', JSON.stringify(state));
  }, [state]);

  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};
```

## ⚠️ Common Mistakes to Avoid

1. **Missing error handling in hooks**

   ```tsx
   // ❌ Bad
   export const useContext = () => {
     return useContext(Context);
   };

   // ✅ Good
   export const useContext = () => {
     const context = useContext(Context);
     if (!context) {
       throw new Error('useContext must be used within Provider');
     }
     return context;
   };
   ```

2. **Not memoizing context values**

   ```tsx
   // ❌ Bad - Creates new object every render
   return (
     <Context.Provider value={{ state, dispatch, helper }}>
       {children}
     </Context.Provider>
   );

   // ✅ Good - Memoized value
   const value = useMemo(() => ({ state, dispatch, helper }), [state, helper]);
   return <Context.Provider value={value}>{children}</Context.Provider>;
   ```

3. **Overusing context**

   ```tsx
   // ❌ Bad - Context for every small piece of state
   const [loading, setLoading] = useState(false);
   // Don't create context for this

   // ✅ Good - Context for shared, complex state
   const gameState = useReducer(gameReducer, initialState);
   // This deserves context
   ```

## 🧪 Testing Contexts

### Context Testing Wrapper

```tsx
// test-utils/contextWrapper.tsx
export const createContextWrapper = (providers: Array<React.ComponentType>) => {
  return ({ children }) => {
    return providers.reduceRight(
      (acc, Provider) => <Provider>{acc}</Provider>,
      children,
    );
  };
};

// Usage in tests
const wrapper = createContextWrapper([GameProvider, PlayerProvider]);

render(<ComponentUnderTest />, { wrapper });
```

### Mock Context Values

```tsx
// Mock context for testing
export const mockGameContext = {
  state: mockGameState,
  dispatch: jest.fn(),
  startBattle: jest.fn(),
  endBattle: jest.fn(),
};

jest.mock('@/context/GameContext', () => ({
  useGameContext: () => mockGameContext,
}));
```

---

**Remember**: Context is for state that truly needs to be shared across components. Use it wisely to avoid performance issues and unnecessary complexity.
