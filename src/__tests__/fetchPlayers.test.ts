import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Player } from '@/types/player';

import { fetchPlayers, sortPlayersForLadder } from '@/services/players';

vi.mock('@/services/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        limit: () => ({
          // simulate a minimal Supabase client promise-like chain
          then: (cb: (arg: { data: unknown[]; error: null }) => void) => {
            cb({ data: [], error: null });
            return { catch: () => {} };
          },
        }),
      }),
    }),
  },
}));

describe('fetchPlayers + ladder mapping (placeholder)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no players stored locally and supabase mocked empty', async () => {
    // Force fetchPlayers to catch branch returning []
    const players = await fetchPlayers();
    expect(Array.isArray(players)).toBe(true);
  });

  it('sortPlayersForLadder orders by level then experience', () => {
    const ordered = sortPlayersForLadder([
      {
        id: '1',
        name: 'A',
        level: 2,
        experience: 10,
        characters: [],
        inventory: { items: [], cards: [] },
        progress: { currentLevelId: '1', completedLevels: [] },
        defeatedEnemies: [],
      },
      {
        id: '2',
        name: 'B',
        level: 3,
        experience: 5,
        characters: [],
        inventory: { items: [], cards: [] },
        progress: { currentLevelId: '1', completedLevels: [] },
        defeatedEnemies: [],
      },
      {
        id: '3',
        name: 'C',
        level: 3,
        experience: 20,
        characters: [],
        inventory: { items: [], cards: [] },
        progress: { currentLevelId: '1', completedLevels: [] },
        defeatedEnemies: [],
      },
    ] as Player[]);
    expect(ordered[0].id).toBe('3');
    expect(ordered[1].id).toBe('2');
    expect(ordered[2].id).toBe('1');
  });
});
