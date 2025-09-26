import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { PlayersProvider, usePlayersContext } from '@/context/PlayersContext';

// mock services/players fetchPlayers to count calls
let callCount = 0;
vi.mock('@/services/players', async (orig) => {
  const actual = (await orig()) as Record<string, unknown>;
  return {
    ...actual,
    fetchPlayers: () => {
      callCount += 1;
      return Promise.resolve([
        {
          id: 'p1',
          name: 'Uno',
          level: callCount, // change each fetch to detect refresh
          experience: 10 * callCount,
          characters: [],
          inventory: { items: [], cards: [] },
          progress: { currentLevelId: '1', completedLevels: [] },
          defeatedEnemies: [],
        },
      ]);
    },
  } as Record<string, unknown>;
});

const Consumer: React.FC<{ label: string }> = ({ label }) => {
  const { players, ladder, loading } = usePlayersContext();
  return (
    <div>
      <div data-testid={`loading-${label}`}>{loading ? 'yes' : 'no'}</div>
      <div data-testid={`players-${label}`}>{players.length}</div>
      <div data-testid={`ladder-${label}`}>{ladder.length}</div>
    </div>
  );
};

describe('PlayersContext', () => {
  beforeEach(() => {
    callCount = 0;
  });

  it('performs a single fetch for multiple consumers', async () => {
    render(
      <PlayersProvider ttlMs={10_000}>
        <Consumer label="a" />
        <Consumer label="b" />
      </PlayersProvider>,
    );
    await waitFor(() => {
      expect(screen.getByTestId('players-a').textContent).toBe('1');
      expect(screen.getByTestId('players-b').textContent).toBe('1');
    });
    expect(callCount).toBe(1);
  });
});
