import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';

import type {
  GameAction,
  GameContextType,
  GameState,
} from '@/types/context/game';

import type { Player } from '@/types';

// --- State and Initial State ---

const initialState: GameState = {
  player: null,
  currentLevel: null,
  allCharacters: [],
  loading: true,
  error: null,
  isLoggedIn: false,
  userId: '',
};

// --- Reducer ---

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    case 'SET_GAME_DATA':
      return {
        ...state,
        player: action.payload.player,
        currentLevel: action.payload.level,
        allCharacters: action.payload.characters,
        isLoggedIn: !!action.payload.player,
        loading: false,
      };
    case 'SET_PLAYER':
      return { ...state, player: action.payload, isLoggedIn: !!action.payload };
    case 'UPDATE_PLAYER_DATA': {
      if (!state.player) return state;
      const partial = action.payload as Partial<Player> & {
        stats?: Record<string, number>;
      };
      return {
        ...state,
        player: {
          ...state.player,
          ...partial,
          stats: { ...(state.player.stats || {}), ...(partial.stats || {}) },
        },
      };
    }
    case 'SET_AVATAR':
      if (!state.player) return state;
      return {
        ...state,
        player: { ...state.player, avatarUrl: action.payload },
      };
    case 'ADD_DEFEATED_ENEMY':
      if (!state.player) return state;
      if (state.player.defeatedEnemies?.includes(action.payload)) return state;
      return {
        ...state,
        player: {
          ...state.player,
          defeatedEnemies: [
            ...(state.player.defeatedEnemies || []),
            action.payload,
          ],
        },
      };
    case 'CLEAR_USER':
      return { ...initialState, loading: false };
    default:
      return state;
  }
}

// --- Context and Provider ---

const GameContext = createContext<GameContextType | undefined>(undefined);

const STORAGE_KEY = 'duelo_player_state_v1';

function readFromStorage(): Player | null {
  try {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Player;
  } catch {
    return null;
  }
}

export const GameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(gameReducer, {
    ...initialState,
    player: readFromStorage(),
  });

  // Persist player state to localStorage
  useEffect(() => {
    try {
      if (typeof window === 'undefined' || !state.player) return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.player));
    } catch {
      // ignore
    }
  }, [state.player]);

  // Auth0 flow: initial data load can be deferred until after Auth0 user mapping (handled elsewhere)
  useEffect(() => {
    // For now just mark not loading if no Supabase sync.
    if (state.loading) {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [state.loading]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
};

// --- Hook ---

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
