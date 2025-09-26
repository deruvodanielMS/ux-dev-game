import type { Player } from '@/types/player';

export interface PlayersContextValue {
  players: Player[];
  ladder: Player[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  stale: boolean;
  refresh: (force?: boolean) => Promise<void>;
  getById: (id: string) => Player | undefined;
  upsertLocal: (player: Player) => void;
}
