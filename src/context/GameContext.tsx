import React, { createContext, useContext, useEffect, useReducer } from 'react';
import type { ReactNode } from 'react';

import type {
  GameAction,
  GameContextType,
  GameState,
} from '@/types/context/game';

import { useAuth } from '@/context/AuthContext';
import { publicAvatarUrlFor } from '@/services/avatars';
import { ensureRemotePlayerRecord } from '@/services/players';
import { persistProgress } from '@/services/progress';

import type { Player } from '@/types';

// --- State and Initial State ---

const initialState: GameState = {
  player: null,
  currentLevel: null,
  allCharacters: [],
  loading: true,
  error: null,
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
        loading: false,
      };
    case 'SET_PLAYER':
      return { ...state, player: action.payload };
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
    case 'SET_AVATAR': {
      if (!state.player) return state;
      const raw = action.payload; // ahora la convención es almacenar siempre URL completa
      let normalized: string | null = raw || null;
      if (normalized && !/^https?:\/\//i.test(normalized)) {
        // convertir path relativo a URL completa
        normalized = publicAvatarUrlFor(normalized);
      }
      const avatarUrl = normalized || state.player.avatarUrl || null;
      return {
        ...state,
        player: { ...state.player, avatarUrl },
      };
    }
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
    case 'AWARD_EXPERIENCE': {
      if (!state.player) return state;
      const { enemyId, amount } = action.payload;
      const prevXp = state.player.experience || 0;
      const newXp = prevXp + amount;
      // same curve used in services (linear incremental cost 100 * level)
      let level = 1;
      let remaining = newXp;
      let cost = 100;
      while (remaining >= cost) {
        remaining -= cost;
        level += 1;
        cost = 100 * level;
        if (level >= 99) break;
      }
      const defeated = state.player.defeatedEnemies || [];
      const already = defeated.includes(enemyId);
      return {
        ...state,
        player: {
          ...state.player,
          experience: newXp,
          level,
          defeatedEnemies: already ? defeated : [...defeated, enemyId],
        },
      };
    }
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
  const auth = useAuth();
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

  // When auth user changes, if we have an authenticated user and no player yet or email differs, seed a basic player shell.
  useEffect(() => {
    let cancelled = false;
    async function sync() {
      if (auth.loading) return;
      if (!auth.isAuthenticated) {
        dispatch({ type: 'CLEAR_USER' });
        return;
      }
      const authUser = auth.user;
      if (!authUser) return;

      // seed shell immediately for UI responsiveness
      const existing = state.player;
      if (!existing || existing.id !== authUser.id) {
        const shell: Player = {
          id: authUser.id,
          // use auth0 sub as canonical id (also used as slug remotely)
          name: existing?.name || authUser.name || 'Sin nombre',
          email: authUser.email || existing?.email || '',
          level: existing?.level || 1,
          experience: existing?.experience || 0,
          stats: existing?.stats || {},
          defeatedEnemies: existing?.defeatedEnemies || [],
          avatarUrl: existing?.avatarUrl || authUser.picture || null,
          characters: existing?.characters || [],
          inventory: existing?.inventory || { items: [], cards: [] },
          progress: existing?.progress || {
            currentLevelId: '1',
            completedLevels: [],
          },
        } as Player;
        dispatch({ type: 'SET_PLAYER', payload: shell });
      }

      // ensure remote record exists / fetch remote authoritative data
      const remote = await ensureRemotePlayerRecord({
        id: authUser.id,
        name: authUser.name || null,
        email: authUser.email || null,
        picture: authUser.picture || null,
      });
      if (remote && !cancelled) {
        // merge remote authoritative fields into state without dropping local unsynced props
        dispatch({
          type: 'UPDATE_PLAYER_DATA',
          payload: {
            name: remote.name ?? undefined,
            level: remote.level ?? undefined,
            experience: remote.experience ?? undefined,
            avatarUrl: remote.avatarUrl ?? undefined,
            defeatedEnemies: remote.defeatedEnemies ?? undefined,
            stats: remote.stats ?? undefined,
          },
        });
      }
      if (state.loading) dispatch({ type: 'SET_LOADING', payload: false });
    }
    void sync();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auth.user, auth.isAuthenticated, auth.loading]);

  // Reactive persistence: debounce-like effect for progress fields
  useEffect(() => {
    const player = state.player;
    if (!player) return;
    const timer = setTimeout(() => {
      void persistProgress(player);
    }, 400);
    return () => clearTimeout(timer);
  }, [state.player]);

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
