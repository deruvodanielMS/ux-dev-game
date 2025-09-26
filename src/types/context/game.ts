// Game context related types
import type { Character, Level, Player } from '@/types';

export interface GameState {
  userId: string;
  player: Player | null;
  currentLevel: Level | null;
  allCharacters: Character[];
  loading: boolean;
  error: Error | null;
}

export type GameAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: Error | null }
  | {
      type: 'SET_GAME_DATA';
      payload: {
        player: Player | null;
        level: Level | null;
        characters: Character[];
      };
    }
  | { type: 'SET_PLAYER'; payload: Player | null }
  | { type: 'UPDATE_PLAYER_DATA'; payload: Partial<Player> }
  | { type: 'SET_AVATAR'; payload: string | null }
  | { type: 'ADD_DEFEATED_ENEMY'; payload: string }
  | { type: 'AWARD_EXPERIENCE'; payload: { enemyId: string; amount: number } }
  | { type: 'INCREMENT_STATS'; payload: Record<string, number> }
  | { type: 'CLEAR_USER' };

export type GameContextType = {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
};
