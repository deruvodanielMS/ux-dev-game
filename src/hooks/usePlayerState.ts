import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

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

  // Listen to Supabase auth state and sync profile
  useEffect(() => {
    if (!supabase) return; // nothing to do if not configured

    let mounted = true;

    const getProfile = async (userId: string) => {
      try {
        const { data, error } = await supabase.from('players').select('*').eq('id', userId).single();
        if (error && (error as any).code !== 'PGRST116') {
          console.warn('Error fetching player profile:', error);
          return null;
        }
        return data;
      } catch (err) {
        console.warn('Failed to fetch profile', err);
        return null;
      }
    };

    const createProfile = async (userId: string, email?: string | null) => {
      const base = {
        id: userId,
        // store user id in slug as well when useful
        slug: userId,
        name: email ?? userId,
        avatar_url: null,
        level: 1,
        exp: 0,
        coins: 0,
        soft_skills: 10,
        tech_skills: 10,
        core_values: 10,
        creativity: 10,
        ai_level: 1,
        character_id: null,
      };
      try {
        await supabase.from('players').insert(base);
        return base;
      } catch (err) {
        console.warn('Failed to create profile', err);
        return base;
      }
    };

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      const user = session?.user ?? null;
      if (!user) {
        // signed out
        setState((prev) => ({ ...DEFAULT_STATE }));
        return;
      }

      const userId = user.id;
      // Try fetch profile
      const profile = await getProfile(userId);
      let finalProfile = profile;
      if (!profile) {
        finalProfile = await createProfile(userId, user.email ?? user.user_metadata?.email ?? null);
      }

      if (finalProfile) {
        (async () => {
          let avatar = finalProfile.avatarUrl ?? finalProfile.avatar_url ?? finalProfile.avatar_path ?? finalProfile.avatarPath ?? null;
          if (avatar && !(avatar as string).startsWith('http')) {
            try {
              const { resolveAvatarUrl } = await import('../services/avatars');
              const resolved = await resolveAvatarUrl(avatar as string);
              if (resolved) avatar = resolved;
            } catch (e) {
              console.warn('Failed resolving avatar url', e);
            }
          }

          setState((prev) => ({
            ...prev,
            playerName: finalProfile.name ?? prev.playerName,
            avatarUrl: (avatar as string) ?? prev.avatarUrl,
            isLoggedIn: true,
            stats: {
              soft_skills: finalProfile.softSkills ?? finalProfile.soft_skills ?? prev.stats.soft_skills,
              tech_skills: finalProfile.techSkills ?? finalProfile.tech_skills ?? prev.stats.tech_skills,
              core_values: finalProfile.coreValues ?? finalProfile.core_values ?? prev.stats.core_values,
              creativity: finalProfile.creativity ?? finalProfile.creativity ?? prev.stats.creativity,
              ai_level: finalProfile.aiLevel ?? finalProfile.ai_level ?? prev.stats.ai_level,
            },
          }));
        })();
      }
    });

    return () => {
      mounted = false;
      // unsubscribe
      try { sub?.subscription.unsubscribe(); } catch (e) {}
    };
  }, []);

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
