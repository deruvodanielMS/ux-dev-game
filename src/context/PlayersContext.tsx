import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { PlayersContextValue } from '@/types/context/players';
import type { Player } from '@/types/player';

import {
  fetchPlayers,
  savePlayer,
  sortPlayersForLadder,
} from '@/services/players';

interface PlayersProviderProps {
  children: React.ReactNode;
  /** TTL ms for cache validity (default 30s) */
  ttlMs?: number;
  /** Auto fetch on mount (default true) */
  auto?: boolean;
}

interface InternalState {
  players: Player[];
  ladder: Player[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

const PlayersContext = createContext<PlayersContextValue | undefined>(
  undefined,
);

export const PlayersProvider: React.FC<PlayersProviderProps> = ({
  children,
  ttlMs = 30_000,
  auto = true,
}) => {
  const [state, setState] = useState<InternalState>({
    players: [],
    ladder: [],
    loading: auto,
    error: null,
    lastFetched: null,
  });
  const inFlight = useRef<Promise<Player[]> | null>(null);

  const performFetch = useCallback(async (): Promise<Player[]> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const list = await fetchPlayers();
      setState({
        players: list,
        ladder: sortPlayersForLadder(list),
        loading: false,
        error: null,
        lastFetched: Date.now(),
      });
      return list;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setState((s) => ({ ...s, loading: false, error: message }));
      return [];
    }
  }, []);

  const refresh = useCallback(
    async (force = false) => {
      const now = Date.now();
      if (!force && state.lastFetched && now - state.lastFetched < ttlMs) {
        return;
      }
      if (inFlight.current) {
        await inFlight.current;
        return;
      }
      const p = performFetch().finally(() => {
        inFlight.current = null;
      });
      inFlight.current = p;
      await p;
    },
    [performFetch, state.lastFetched, ttlMs],
  );

  useEffect(() => {
    if (auto) void refresh();
  }, [auto, refresh]);

  const getById = useCallback(
    (id: string) => state.players.find((p) => p.id === id || p.slug === id),
    [state.players],
  );

  const upsertLocal = useCallback((player: Player) => {
    setState((s) => {
      const idx = s.players.findIndex((p) => p.id === player.id);
      const next = [...s.players];
      if (idx >= 0) next[idx] = player;
      else next.push(player);
      const ladder = sortPlayersForLadder(next);
      // persist locally via existing service (no remote write guaranteed)
      void savePlayer(player);
      return { ...s, players: next, ladder };
    });
  }, []);

  const value: PlayersContextValue = {
    players: state.players,
    ladder: state.ladder,
    loading: state.loading,
    error: state.error,
    lastFetched: state.lastFetched,
    stale: !state.lastFetched || Date.now() - state.lastFetched > ttlMs,
    refresh,
    getById,
    upsertLocal,
  };

  return (
    <PlayersContext.Provider value={value}>{children}</PlayersContext.Provider>
  );
};

export function usePlayersContext(): PlayersContextValue {
  const ctx = useContext(PlayersContext);
  if (!ctx)
    throw new Error('usePlayersContext must be used within PlayersProvider');
  return ctx;
}
