import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  fetchPlayers,
  type Player,
  savePlayer,
  sortPlayersForLadder,
} from '../services/players';

export type UsePlayersState = {
  players: Player[];
  loading: boolean;
  error: string | null;
};

export const usePlayers = () => {
  const [{ players, loading, error }, setState] = useState<UsePlayersState>({
    players: [],
    loading: true,
    error: null,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const list = await fetchPlayers();
      setState({ players: list, loading: false, error: null });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      setState({ players: [], loading: false, error: message });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const upsert = useCallback(async (player: Player) => {
    const saved = await savePlayer(player);
    setState((s) => {
      const idx = s.players.findIndex((p) => p.id === saved.id);
      const next = [...s.players];
      if (idx >= 0) next[idx] = saved;
      else next.push(saved);
      return { ...s, players: next };
    });
    return saved;
  }, []);

  const ladder = useMemo(() => sortPlayersForLadder(players), [players]);

  return { players, ladder, loading, error, refresh: load, upsert } as const;
};

export type { Player };
