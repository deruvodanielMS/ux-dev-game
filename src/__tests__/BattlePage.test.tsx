import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.useFakeTimers();

// Mock Auth0
vi.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({
    user: {
      sub: 'auth0|123',
      name: 'Player',
      email: 'p@example.com',
      picture: null,
    },
    isAuthenticated: true,
    isLoading: false,
    getAccessTokenSilently: vi.fn().mockResolvedValue('token'),
    logout: vi.fn(),
  }),
}));

// Mock enemies to a single easy enemy with low health to ensure quick victory
vi.mock('@/data/enemies.json', () => ({
  default: [
    {
      id: 'enemy-1',
      name: 'Dummy Enemy',
      stats: { health: 20 },
      difficulty: 'easy',
      avatar_url: null,
    },
  ],
}));

// Spy persistProgress
const persistProgressMock = vi.fn().mockResolvedValue(undefined);
vi.mock('@/services/progress', () => ({
  persistProgress: (...a: unknown[]) => persistProgressMock(...a),
}));

// Mock players service functions used in GameContext
const ensureRemotePlayerRecordMock = vi
  .fn()
  .mockResolvedValue({ id: 'auth0|123', level: 1, experience: 0 });
vi.mock('@/services/players', () => ({
  ensureRemotePlayerRecord: (...a: unknown[]) =>
    ensureRemotePlayerRecordMock(...a),
}));

// Mock supabase client unused paths
vi.mock('@/services/supabase', () => ({ supabase: undefined }));

import { BattlePage } from '@/pages/BattlePage/BattlePage';

import { AudioProvider } from '@/context/AudioContext';
import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { ToastProvider } from '@/context/ToastContext';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AudioProvider>
        <ToastProvider>
          <GameProvider>{children}</GameProvider>
        </ToastProvider>
      </AudioProvider>
    </AuthProvider>
  );
}

function seedPlayer() {
  const player = {
    id: 'auth0|123',
    name: 'Player',
    email: 'p@example.com',
    level: 1,
    experience: 0,
    defeatedEnemies: [],
    avatarUrl: null,
    characters: [],
    inventory: { items: [], cards: [] },
    progress: { currentLevelId: '1', completedLevels: [] },
    stats: {},
  };
  localStorage.setItem('duelo_player_state_v1', JSON.stringify(player));
}

describe('BattlePage victory flow', () => {
  beforeEach(() => {
    localStorage.clear();
    seedPlayer();
    vi.clearAllMocks();
    // Avoid navigation confirm dialog interfering
    vi.spyOn(window, 'confirm').mockReturnValue(false);
  });

  it('awards experience and persists progress after defeating enemy', async () => {
    render(
      <MemoryRouter initialEntries={['/battle']}>
        <Routes>
          <Route
            path="/battle"
            element={
              <Providers>
                <BattlePage />
              </Providers>
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    // Find a card button (they are rendered in CardHand). We look for one by text.
    // Expect at least 'Bug Fix' or localized label: uses ids 'bug-fix', 'code-review', 'refactor' but rendered maybe as plain text.
    // We'll click the one containing 'Bug' or fallback to first button inside cards area.
    let cardButton = screen.queryByText(/bug fix/i);
    if (!cardButton) {
      cardButton = screen
        .getAllByRole('button')
        .find((b: HTMLElement) =>
          /bug/i.test(b.textContent || ''),
        ) as HTMLElement;
    }
    expect(cardButton).toBeTruthy();
    fireEvent.click(cardButton!);

    // Advance timers to process enemy health reduction effect + victory useEffect + persistProgress timeouts
    await vi.advanceTimersByTimeAsync(1000); // covers 50ms + 400ms debounce + other timeouts

    // Assert local storage player updated with experience 50 and defeated enemy id added
    const stored = JSON.parse(
      localStorage.getItem('duelo_player_state_v1') || 'null',
    );
    expect(stored.experience).toBeGreaterThanOrEqual(50);
    expect(stored.defeatedEnemies).toContain('enemy-1');

    // persistProgress should have been called (battle immediate + reactive debounced)
    expect(persistProgressMock.mock.calls.length).toBeGreaterThan(0);
  });
});
