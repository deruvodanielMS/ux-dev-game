// Battle page types
export type BattleState = {
  playerHealth: number;
  playerStamina: number;
  enemyHealth: number;
  enemyStamina: number;
  playerTurn: boolean;
  playerHand: string[];
  battleLog: string[];
};

export type BattleAction =
  | { type: 'PLAY_CARD'; card: string }
  | { type: 'ENEMY_ATTACK' }
  | { type: 'REGEN' }
  | { type: 'RESET' };

export type Enemy = {
  id: string;
  name: string;
  avatar_url: string;
  stats: { health: number; attack: number; defense: number };
};
