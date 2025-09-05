import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import supabase from '../services/supabase';

export type Stats = {
  soft_skills: number;
  tech_skills: number;
  core_values: number;
  creativity: number;
  ai_level: number;
};

export type PlayerState = {
  userId: string | null;
  email: string | null;
  playerName: string;
  selectedCharacter: string | null;
  avatarUrl: string | null;
  githubPRs: number;
  level: number;
  stats: Stats;
  defeatedEnemies: string[];
  isLoggedIn: boolean;
};

const initialState: PlayerState = {
  userId: null,
  email: null,
  playerName: '',
  selectedCharacter: null,
  avatarUrl: null,
  githubPRs: 0,
  level: 1,
  stats: {
    soft_skills: 10,
    tech_skills: 10,
    core_values: 10,
    creativity: 10,
    ai_level: 1,
  },
  defeatedEnemies: [],
  isLoggedIn: false,
};

type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_SELECTED_CHARACTER'; payload: string }
  | { type: 'SET_AVATAR'; payload: string | null }
  | { type: 'INC_PR'; payload?: number }
  | { type: 'SET_STATS'; payload: Partial<Stats> }
  | { type: 'ADD_DEFEATED_ENEMY'; payload: string }
  | { type: 'SET_USER'; payload: Partial<Pick<PlayerState, 'userId' | 'email' | 'playerName' | 'avatarUrl' | 'level' | 'stats' | 'isLoggedIn'>> }
  | { type: 'CLEAR_USER' };

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, playerName: action.payload };
    case 'SET_SELECTED_CHARACTER':
      return { ...state, selectedCharacter: action.payload };
    case 'SET_AVATAR':
      return { ...state, avatarUrl: action.payload };
    case 'INC_PR':
      return { ...state, githubPRs: state.githubPRs + (action.payload ?? 1) };
    case 'SET_STATS':
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case 'ADD_DEFEATED_ENEMY':
      if (state.defeatedEnemies.includes(action.payload)) return state;
      return { ...state, defeatedEnemies: [...state.defeatedEnemies, action.payload] };
    case 'SET_USER':
      return { ...state, ...action.payload, stats: { ...state.stats, ...(action.payload?.stats ?? {}) } } as PlayerState;
    case 'CLEAR_USER':
      return { ...initialState };
    default:
      return state;
  }
}

type ContextType = {
  state: PlayerState;
  dispatch: React.Dispatch<Action>;
};

const PlayerContext = createContext<ContextType | undefined>(undefined);

const STORAGE_KEY = 'duelo_player_state_v1';

function readFromStorage(): PlayerState {
  try {
    if (typeof window === 'undefined') return initialState;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<PlayerState> | null;
    if (!parsed) return initialState;
    return { ...initialState, ...parsed, stats: { ...initialState.stats, ...(parsed.stats ?? {}) }, defeatedEnemies: parsed.defeatedEnemies ?? [] };
  } catch (err) {
    return initialState;
  }
}

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, readFromStorage());

  // persist to localStorage on changes
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (err) {
      // ignore
    }
  }, [state]);

  // Sync with Supabase auth and players table so userId, email and avatar are always available
  useEffect(() => {
    if (!supabase) return;
    let mounted = true;

    const resolveAndSet = async (user: any | null) => {
      if (!user) {
        if (!mounted) return;
        dispatch({ type: 'CLEAR_USER' });
        return;
      }

      const userId = user.id;
      try {
        const { data: p, error } = await supabase.from('players').select('*').or(`id.eq.${userId},slug.eq.${userId}`).limit(1).single();
        if (!mounted) return;
        let avatar: string | null = null;
        let level = 1;
        let stats = undefined;

        if (p) {
          avatar = p.avatar_url ?? p.avatarUrl ?? null;
          level = p.level ?? p.current_level ?? 1;
          stats = {
            soft_skills: p.soft_skills ?? p.softSkills ?? 10,
            tech_skills: p.tech_skills ?? p.techSkills ?? 10,
            core_values: p.core_values ?? p.coreValues ?? 10,
            creativity: p.creativity ?? 10,
            ai_level: p.ai_level ?? p.aiLevel ?? 1,
          } as Stats;
        }

        // If avatar is a storage path, try to resolve signed url
        if (avatar && !(avatar.startsWith('http://') || avatar.startsWith('https://'))) {
          try {
            const { resolveAvatarUrl } = await import('../services/avatars');
            const resolved = await resolveAvatarUrl(avatar);
            if (resolved) avatar = resolved;
          } catch (e) {
            // ignore
          }
        }

        dispatch({ type: 'SET_USER', payload: { userId, email: user.email ?? null, playerName: p?.name ?? user.email ?? '', avatarUrl: avatar, level, stats, isLoggedIn: true } });
      } catch (e) {
        // on error still set basic user info
        if (!mounted) return;
        dispatch({ type: 'SET_USER', payload: { userId, email: user.email ?? null, playerName: user.email ?? '', isLoggedIn: true } });
      }
    };

    // initial check
    (async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user ?? null;
        await resolveAndSet(user);
      } catch (e) {
        // ignore
      }
    })();

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      resolveAndSet(user);
    });

    return () => {
      mounted = false;
      try { sub?.subscription.unsubscribe(); } catch (e) {}
    };
  }, []);

  return <PlayerContext.Provider value={{ state, dispatch }}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
