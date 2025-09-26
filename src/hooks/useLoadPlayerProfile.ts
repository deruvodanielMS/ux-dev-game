import { useEffect, useRef, useState } from 'react';

import { useGame } from '@/context/GameContext';
import { supabase } from '@/services/supabase';

interface PlayerRow {
  id: string;
  name?: string | null;
  email?: string | null;
  level?: number | null;
  avatar_url?: string | null;
  avatarUrl?: string | null; // legacy/local field
}

export const useLoadPlayerProfile = (email: string | null | undefined) => {
  const { state, dispatch } = useGame();
  const [profile, setProfile] = useState<PlayerRow | null>(null);
  const [loading, setLoading] = useState(false);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (!email || loadedRef.current || !supabase) return;
    let active = true;
    (async () => {
      setLoading(true);
      try {
        const { data: p } = await supabase
          .from('players')
          .select('*')
          .eq('email', email)
          .limit(1)
          .single();
        if (!active) return;
        if (p) {
          setProfile(p);
          dispatch({
            type: 'UPDATE_PLAYER_DATA',
            payload: { name: p.name ?? state.player?.name ?? '' },
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    loadedRef.current = true;
    return () => {
      active = false;
    };
  }, [email, dispatch, state.player]);

  return { profile, loading };
};
