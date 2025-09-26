// Deprecated implementation replaced by context-backed hook.
// Kept for backward compatibility. Prefer usePlayersContext from PlayersContext.
import type { Player } from '@/types/player';

import { usePlayersContext } from '@/context/PlayersContext';

export const usePlayers = () => {
  const ctx = usePlayersContext();
  return {
    players: ctx.players,
    ladder: ctx.ladder,
    loading: ctx.loading,
    error: ctx.error,
    refresh: ctx.refresh,
    upsert: async (player: Player) => {
      ctx.upsertLocal(player);
      return player;
    },
  } as const;
};
