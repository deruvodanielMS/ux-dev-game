import { useCallback, useEffect, useState } from 'react';

export type Stats = {
  soft_skills: number;
  tech_skills: number;
  core_values: number;
  creativity: number;
  ai_level: number;
};

export type PlayerState = {
  playerName: string;
  avatarUrl: string | null;
  selectedCharacterId: string | null;
  isLoggedIn: boolean;
  stats: Stats;
};

const STORAGE_KEY = 'duelo_player_state_v1';

const DEFAULT_STATE: PlayerState = {
  playerName: '',
  avatarUrl: null,
  selectedCharacterId: null,
  isLoggedIn: false,
  stats: {
    soft_skills: 10,
    tech_skills: 10,
    core_values: 10,
    creativity: 10,
    ai_level: 1,
  },
};

export default function usePlayerState() {
  const [state, setState] = useState<PlayerState>(() => {
    try {
      if (typeof window === 'undefined') return DEFAULT_STATE;
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_STATE;
      const parsed = JSON.parse(raw) as Partial<PlayerState> | null;
      if (!parsed) return DEFAULT_STATE;
      return { ...DEFAULT_STATE, ...parsed, stats: { ...DEFAULT_STATE.stats, ...(parsed.stats ?? {}) } };
    } catch (err) {
      console.warn('Failed to read player state from localStorage:', err);
      return DEFAULT_STATE;
    }
  });

  // Persist changes to localStorage
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      console.warn('Failed to save player state to localStorage:', err);
    }
  }, [state]);

  const setPlayerState = useCallback(
    (patch: Partial<PlayerState> | ((prev: PlayerState) => Partial<PlayerState>)) => {
      setState((prev) => {
        const delta = typeof patch === 'function' ? patch(prev) : patch;
        const next: PlayerState = {
          ...prev,
          ...delta,
          stats: { ...prev.stats, ...(delta.stats ?? {}) },
        };
        try {
          if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch (err) {
          console.warn('Failed to save player state to localStorage:', err);
        }
        return next;
      });
    },
    []
  );

  const clearSession = useCallback(() => {
    setState(DEFAULT_STATE);
    try {
      if (typeof window !== 'undefined') localStorage.removeItem(STORAGE_KEY);
    } catch (err) {
      console.warn('Failed to clear player state from localStorage:', err);
    }
  }, []);

  return { state, setPlayerState, clearSession } as const;
}
