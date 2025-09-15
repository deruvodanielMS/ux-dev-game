// ProfileSetupPage specific types
import type { Player, Stats } from './index';

export interface ProfileSetupPageLocalState {
  userId: string | null;
  email: string;
  pendingAvatarPath: string | null;
}

export interface UpdatePlayerProfilePayload {
  name: string;
  email: string | null;
}

// Re-export aliases (useful for semantic clarity without creating empty interfaces)
export type SaveLadderPlayer = Player;
export type DefaultStats = Stats;
