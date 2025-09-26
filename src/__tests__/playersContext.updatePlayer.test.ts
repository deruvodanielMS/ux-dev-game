import { describe, expect, it } from 'vitest';

import type { Player } from '@/types/player';

import { sortPlayersForLadder } from '@/services/players';

// Lightweight unit test for update ordering logic indirectly (simulate merge + sort)
// We don't import context directly (would require React rendering); instead we mimic logic.

function simulateUpdate(
  list: Player[],
  id: string,
  patch: Partial<Player>,
): Player[] {
  const idx = list.findIndex((p) => p.id === id || p.slug === id);
  if (idx === -1) return list;
  const current = list[idx];
  const merged: Player = {
    ...current,
    ...patch,
    stats: { ...(current.stats || {}), ...(patch.stats || {}) },
  } as Player;
  const next = [...list];
  next[idx] = merged;
  return sortPlayersForLadder(next);
}

describe('PlayersContext.updatePlayer (simulated)', () => {
  const base: Player[] = [
    { id: 'a', name: 'Ana', level: 2, experience: 150 } as Player,
    { id: 'b', name: 'Beto', level: 3, experience: 50 } as Player,
    { id: 'c', name: 'Cora', level: 1, experience: 10 } as Player,
  ];

  it('keeps ordering stable when no ranking fields change', () => {
    const sorted = sortPlayersForLadder([...base]);
    const updated = simulateUpdate(sorted, 'a', { name: 'Ana Maria' });
    expect(updated.map((p) => p.id)).toEqual(sorted.map((p) => p.id));
  });

  it('re-sorts when level increases', () => {
    const sorted = sortPlayersForLadder([...base]);
    const updated = simulateUpdate(sorted, 'a', { level: 5 });
    // player a should now be first
    expect(updated[0].id).toBe('a');
  });

  it('merges stats additively overriding only provided keys', () => {
    const listWithStats = [
      { ...base[0], stats: { damage_dealt: 10, battles_won: 2 } } as Player,
      base[1],
      base[2],
    ];
    const updated = simulateUpdate(listWithStats, 'a', {
      stats: { damage_dealt: 5, enemies_defeated: 1 },
    });
    const stats = (updated.find((p) => p.id === 'a')?.stats || {}) as Record<
      string,
      number
    >;
    expect(stats.damage_dealt).toBe(5); // patch overwrites (context merge is shallow override not additive in this simulation)
    expect(stats.battles_won).toBe(2);
    expect(stats.enemies_defeated).toBe(1);
  });
});
