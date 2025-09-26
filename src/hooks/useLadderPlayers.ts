import { useCallback, useEffect, useRef, useState } from 'react';

import { fetchPlayers, sortPlayersForLadder } from '@/services/players';

import type { Player } from '@/types';

type LadderState = {
  players: Player[];
  ladder: Player[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
};

export interface UseLadderOptions {
  /** TTL en ms antes de forzar refetch. Default 30s */
  ttlMs?: number;
  /** Prefetch automático al montar (default true) */
  auto?: boolean;
}

/**
 * Hook de ladder con cache in-memory + TTL.
 * Evita múltiples requests concurrentes y ofrece un refresh manual.
 * Futuro: integrar canal realtime de Supabase para invalidar cache.
 */
export function useLadderPlayers(options: UseLadderOptions = {}) {
  const { ttlMs = 30_000, auto = true } = options;
  const [state, setState] = useState<LadderState>(() => ({
    players: [],
    ladder: [],
    loading: auto,
    error: null,
    lastFetched: null,
  }));
  const inFlight = useRef<Promise<Player[]> | null>(null);

  const fetchIfNeeded = useCallback(
    async (force = false) => {
      const now = Date.now();
      if (!force && state.lastFetched && now - state.lastFetched < ttlMs) {
        return state.players;
      }
      if (inFlight.current) return inFlight.current;
      setState((s) => ({ ...s, loading: true, error: null }));
      const p = fetchPlayers()
        .then((list) => {
          setState({
            players: list,
            ladder: sortPlayersForLadder(list),
            loading: false,
            error: null,
            lastFetched: Date.now(),
          });
          return list;
        })
        .catch((err: unknown) => {
          setState((s) => ({
            ...s,
            loading: false,
            error: err instanceof Error ? err.message : 'Error desconocido',
          }));
          return [] as Player[];
        })
        .finally(() => {
          inFlight.current = null;
        });
      inFlight.current = p;
      return p;
    },
    [state.lastFetched, state.players, ttlMs],
  );

  const refresh = useCallback(() => fetchIfNeeded(true), [fetchIfNeeded]);

  useEffect(() => {
    if (auto) void fetchIfNeeded();
  }, [auto, fetchIfNeeded]);

  return {
    players: state.players,
    ladder: state.ladder,
    loading: state.loading,
    error: state.error,
    lastFetched: state.lastFetched,
    refresh,
    stale: !state.lastFetched || Date.now() - state.lastFetched > ttlMs,
  } as const;
}
