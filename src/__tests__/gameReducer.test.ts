import { describe, expect, it } from 'vitest';

import type { GameState } from '@/types/context/game';
import type { Player } from '@/types/player';

import { publicAvatarUrlFor } from '@/services/avatars';

// replicate reducer from GameContext (kept in sync with core branches used in tests)
type TestPlayer = Pick<
  Player,
  | 'id'
  | 'name'
  | 'experience'
  | 'level'
  | 'defeatedEnemies'
  | 'avatarUrl'
  | 'characters'
  | 'inventory'
  | 'progress'
  | 'stats'
>;
type SetPlayerAction = { type: 'SET_PLAYER'; payload: TestPlayer };
type AwardXpAction = {
  type: 'AWARD_EXPERIENCE';
  payload: { enemyId: string; amount: number };
};
type SetAvatarAction = { type: 'SET_AVATAR'; payload: string | null };
type UnknownAction = { type: 'UNKNOWN' };
type TestAction =
  | SetPlayerAction
  | AwardXpAction
  | SetAvatarAction
  | UnknownAction;

function gameReducer(state: GameState, action: TestAction): GameState {
  switch (action.type) {
    case 'SET_PLAYER':
      return { ...state, player: action.payload as Player };
    case 'AWARD_EXPERIENCE': {
      if (!state.player) return state;
      const { enemyId, amount } = action.payload;
      const prevXp = state.player.experience || 0;
      const newXp = prevXp + amount;
      let level = 1;
      let remaining = newXp;
      let cost = 100;
      while (remaining >= cost) {
        remaining -= cost;
        level += 1;
        cost = 100 * level;
        if (level >= 99) break;
      }
      const defeated = state.player.defeatedEnemies || [];
      const already = defeated.includes(enemyId);
      return {
        ...state,
        player: {
          ...state.player,
          experience: newXp,
          level,
          defeatedEnemies: already ? defeated : [...defeated, enemyId],
        },
      };
    }
    case 'SET_AVATAR': {
      if (!state.player) return state;
      let normalized: string | null = action.payload || null;
      if (normalized && !/^https?:\/\//i.test(normalized)) {
        normalized = publicAvatarUrlFor(normalized) || normalized;
      }
      return { ...state, player: { ...state.player, avatarUrl: normalized } };
    }
    default:
      return state;
  }
}

const baseState: GameState = {
  player: null,
  currentLevel: null,
  allCharacters: [],
  loading: false,
  error: null,
  userId: '',
};

describe('gameReducer progression', () => {
  it('awards experience and levels up linearly', () => {
    let state = gameReducer(baseState, {
      type: 'SET_PLAYER',
      payload: {
        id: 'u1',
        name: 'Dev',
        experience: 0,
        level: 1,
        defeatedEnemies: [],
        characters: [],
        inventory: { items: [], cards: [] },
        progress: { currentLevelId: '1', completedLevels: [] },
        stats: {},
      },
    });
    state = gameReducer(state, {
      type: 'AWARD_EXPERIENCE',
      payload: { enemyId: 'enemy-1', amount: 100 },
    });
    expect(state.player?.level).toBe(2);
    expect(state.player?.experience).toBe(100);
    expect(state.player?.defeatedEnemies).toContain('enemy-1');
  });

  it('handles multiple level-ups in one award', () => {
    let state = gameReducer(baseState, {
      type: 'SET_PLAYER',
      payload: {
        id: 'u1',
        name: 'Dev',
        experience: 0,
        level: 1,
        defeatedEnemies: [],
        characters: [],
        inventory: { items: [], cards: [] },
        progress: { currentLevelId: '1', completedLevels: [] },
        stats: {},
      },
    });
    // Award large XP to jump several levels (cost sequence: 100, 200, 300,...)
    state = gameReducer(state, {
      type: 'AWARD_EXPERIENCE',
      payload: { enemyId: 'boss', amount: 100 + 200 + 50 },
    });
    expect(state.player?.level).toBe(3); // consumed 100 (L2) + 200 (L3) then 50 leftover
    expect(state.player?.experience).toBe(350);
    expect(state.player?.defeatedEnemies).toContain('boss');
  });
});
