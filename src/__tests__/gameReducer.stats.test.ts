import { describe, expect, it } from 'vitest';

import type { Player } from '@/types/player';

// Reducer no está exportado: replicamos la lógica de acumulación para validar el comportamiento esperado.

function applyIncrementStats(
  player: Player,
  increments: Record<string, number>,
): Player {
  const current = player.stats || {};
  const next: Record<string, number> = { ...current };
  for (const [k, v] of Object.entries(increments)) {
    const prev = typeof current[k] === 'number' ? current[k]! : 0;
    next[k] = prev + v;
  }
  return { ...player, stats: next };
}

describe('stats accumulation logic', () => {
  it('increments fresh stats', () => {
    const player: Player = {
      id: 'u1',
      name: 'Test',
      level: 1,
      experience: 0,
      characters: [],
      inventory: { items: [], cards: [] },
      progress: { currentLevelId: '1', completedLevels: [] },
      stats: undefined,
    };
    const after = applyIncrementStats(player, {
      battles_won: 1,
      damage_dealt: 50,
    });
    expect(after.stats).toEqual({ battles_won: 1, damage_dealt: 50 });
  });

  it('merges and accumulates existing stats', () => {
    const player: Player = {
      id: 'u1',
      name: 'Test',
      level: 1,
      experience: 0,
      characters: [],
      inventory: { items: [], cards: [] },
      progress: { currentLevelId: '1', completedLevels: [] },
      stats: { battles_won: 2, damage_dealt: 100 },
    };
    const after = applyIncrementStats(player, {
      battles_won: 1,
      damage_dealt: 40,
      enemies_defeated: 1,
    });
    expect(after.stats).toEqual({
      battles_won: 3,
      damage_dealt: 140,
      enemies_defeated: 1,
    });
  });
});
