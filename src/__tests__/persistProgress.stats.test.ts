import { describe, expect, it, vi } from 'vitest';

import type { Player } from '@/types/player';

// Mock antes de importar el módulo que usa supabase
vi.mock('@/services/supabase', () => {
  return {
    supabase: {
      auth: {
        getSession: async () => ({ data: { session: { user: { id: 'u1' } } } }),
      },
      from: () => ({
        update: () => ({ eq: () => ({ error: null }) }),
        upsert: () => ({}),
      }),
    },
  };
});

describe('persistProgress stats payload', () => {
  it('includes stats when present', async () => {
    const player: Player = {
      id: 'u1',
      name: 'P',
      level: 3,
      experience: 250,
      characters: [],
      inventory: { items: [], cards: [] },
      progress: { currentLevelId: '1', completedLevels: [] },
      stats: { battles_won: 4, damage_dealt: 500 },
      defeatedEnemies: ['e1', 'e2'],
    };

    // We spy on supabase.from().update chain differently -> easier: override impl to capture payload
    const calls: unknown[] = [];
    vi.doMock('@/services/supabase', () => {
      return {
        supabase: {
          auth: {
            getSession: async () => ({
              data: { session: { user: { id: 'u1' } } },
            }),
          },
          from: () => ({
            update: (payload: Record<string, unknown>) => {
              calls.push(payload);
              return { eq: () => ({ error: null }) };
            },
            upsert: (payload: Record<string, unknown>) => {
              calls.push(payload);
              return {};
            },
          }),
        },
      };
    });

    const { persistProgress } = await import('@/services/progress');
    await persistProgress(player as Player);
    // Last call payload should include stats
    const serialized = JSON.stringify(calls);
    expect(serialized).toMatch('battles_won');
    expect(serialized).toMatch('damage_dealt');
  });
});
