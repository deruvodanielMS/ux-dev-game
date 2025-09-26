import { useCallback, useEffect, useState } from 'react';

import { supabase } from '@/services/supabase';

interface BasicUser {
  id: string;
  email?: string | null;
}
interface BasicSession {
  user?: BasicUser | null;
}

export interface SupabaseAuthState {
  user: BasicUser | null;
  session: BasicSession | null;
  loading: boolean;
  error: string | null;
}

export const useSupabaseAuth = () => {
  const [state, setState] = useState<SupabaseAuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  const refresh = useCallback(async () => {
    if (!supabase) {
      setState((s) => ({
        ...s,
        loading: false,
        error: 'Supabase no configurado',
      }));
      return;
    }
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      const u = data.user ? { id: data.user.id, email: data.user.email } : null;
      setState((s) => ({
        ...s,
        user: u,
        session: { user: u },
        loading: false,
        error: null,
      }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Auth error';
      setState((s) => ({ ...s, error: msg, loading: false }));
    }
  }, []);

  useEffect(() => {
    refresh();
    if (!supabase) return;
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const u = session?.user
          ? { id: session.user.id, email: session.user.email }
          : null;
        setState((s) => ({
          ...s,
          user: u,
          session: { user: u },
          loading: false,
          error: null,
        }));
      },
    );
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [refresh]);

  const signUp = useCallback(async (email: string, password: string) => {
    if (!supabase)
      return { data: null, error: new Error('Supabase not configured') };
    return supabase.auth.signUp({ email, password });
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase)
      return { data: null, error: new Error('Supabase not configured') };
    return supabase.auth.signInWithPassword({ email, password });
  }, []);

  const signOut = useCallback(async (): Promise<{ error: Error | null }> => {
    if (!supabase) return { error: new Error('Supabase not configured') };
    const { error } = await supabase.auth.signOut();
    return { error };
  }, []);

  return { ...state, signUp, signIn, signOut, refresh };
};
