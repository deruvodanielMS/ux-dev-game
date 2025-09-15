import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { User } from '@supabase/supabase-js';
import type { ReactNode } from 'react';

import type {
  GameAction,
  GameContextType,
  GameState,
} from '@/types/context/game';

import { getCharacters } from '@/services/characters';
import { getLevel } from '@/services/levels';
import { supabase } from '@/services/supabase';

import type { Player } from '@/types';

// --- State and Initial State ---

const initialState: GameState = {
  player: null,
  currentLevel: null,
  allCharacters: [],
  loading: true,
  error: null,
  isLoggedIn: false,
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

  // Sync with Supabase auth and fetch initial data
  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    const fetchInitialData = async (user: User | null) => {
      if (!user) {
        dispatch({ type: 'CLEAR_USER' });
        return;
      }

      try {
        dispatch({ type: 'SET_LOADING', payload: true });

        const { data: playerData } = await supabase!
          .from('players')
          .select('*')
          .eq('id', user.id)
          .single();

        let player: Player | null = null;
        if (playerData) {
          player = {
            id: playerData.id,
            name: playerData.name,
            avatarUrl: playerData.avatar_url,
            level: playerData.level,
            experience: playerData.experience,
            characters: [],
            inventory: { items: [], cards: [] },
            progress: {
              currentLevelId: playerData.current_level_id || '1',
              completedLevels: playerData.completed_levels || [],
            },
            email: playerData.email ?? null,
            stats: playerData.stats ?? {},
            defeatedEnemies: playerData.defeated_enemies ?? [],
            isLoggedIn: true,
          };
        }

        const [level, characters] = await Promise.all([
          player ? getLevel(player.progress.currentLevelId) : null,
          getCharacters(),
        ]);

        if (!mounted) return;
        dispatch({
          type: 'SET_GAME_DATA',
          payload: { player, level, characters },
        });
      } catch (err) {
        if (!mounted) return;
        dispatch({ type: 'SET_ERROR', payload: err as Error });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      fetchInitialData(session?.user ?? null);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        fetchInitialData(session?.user ?? null);
      },
    );

    return () => {
      mounted = false;
      authListener?.subscription.unsubscribe();
    };
  }, []);

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
