import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
// jsdom lacks createObjectURL
// jsdom no implementa createObjectURL; mock para previsualización
// jsdom no implementa createObjectURL; añadimos mock
(URL as unknown as { createObjectURL?: (f: File) => string }).createObjectURL =
  vi.fn().mockReturnValue('blob:preview');

// External libs mocked first
vi.mock('@auth0/auth0-react', () => {
  return {
    useAuth0: () => ({
      user: {
        sub: 'auth0|123',
        name: 'Old Name',
        email: 'old@example.com',
        picture: 'http://example.com/old.png',
      },
      isAuthenticated: true,
      isLoading: false,
      getAccessTokenSilently: vi.fn().mockResolvedValue('token'),
      logout: vi.fn(),
    }),
  };
});

// Mock services used in ProfileSetupPage & GameContext
const uploadAvatarMock = vi.fn().mockResolvedValue('auth0-123/avatar-path.png');
const publicAvatarUrlForMock = vi
  .fn()
  .mockReturnValue('https://cdn.example.com/auth0-123/avatar-path.png');
const updatePlayerAvatarMock = vi.fn().mockResolvedValue(undefined);
const updatePlayerProfileMock = vi.fn().mockResolvedValue(undefined);
const savePlayerMock = vi.fn().mockResolvedValue(undefined);
const ensureRemotePlayerRecordMock = vi
  .fn()
  .mockResolvedValue({ id: 'auth0|123', level: 1, experience: 0 });

vi.mock('@/services/avatars', () => ({
  uploadAvatar: (...args: unknown[]) => uploadAvatarMock(...args),
  publicAvatarUrlFor: (...args: unknown[]) => publicAvatarUrlForMock(...args),
}));

vi.mock('@/services/players', () => ({
  updatePlayerAvatar: (...a: unknown[]) => updatePlayerAvatarMock(...a),
  updatePlayerProfile: (...a: unknown[]) => updatePlayerProfileMock(...a),
  savePlayer: (...a: unknown[]) => savePlayerMock(...a),
  ensureRemotePlayerRecord: (...a: unknown[]) =>
    ensureRemotePlayerRecordMock(...a),
}));

// Minimal supabase mock (avoid network)
vi.mock('@/services/supabase', () => ({
  supabase: undefined,
}));

import { ProfileSetupPage } from '@/pages/ProfileSetupPage/ProfileSetupPage';

import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';
import { ToastProvider } from '@/context/ToastContext';

function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider>
        <GameProvider>{children}</GameProvider>
      </ToastProvider>
    </AuthProvider>
  );
}

// Helper to seed localStorage player before GameProvider mounts
function seedPlayer() {
  const player = {
    id: 'auth0|123',
    name: 'Old Name',
    email: 'old@example.com',
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

describe('ProfileSetupPage', () => {
  beforeEach(() => {
    localStorage.clear();
    seedPlayer();
    vi.clearAllMocks();
  });

  it('updates name, uploads avatar and navigates to /ladder', async () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <Routes>
          <Route
            path="/profile"
            element={
              <Providers>
                <ProfileSetupPage />
              </Providers>
            }
          />
          <Route path="/ladder" element={<div>Ladder Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    // Change name
    const nameInput = screen.getByPlaceholderText('Tu nombre');
    fireEvent.change(nameInput, { target: { value: 'Nuevo Nombre' } });

    // Select avatar file
    const file = new File(['avatar-bytes'], 'avatar.png', {
      type: 'image/png',
    });
    screen.getByLabelText('Elegir imagen'); // ensure label exists
    // The label is associated to hidden input via htmlFor, so query actual input
    const hiddenInput = document.getElementById(
      'avatarFile',
    ) as HTMLInputElement;
    fireEvent.change(hiddenInput, { target: { files: [file] } });

    // Click save button
    const saveBtn = screen.getByRole('button', {
      name: /guardar y continuar/i,
    });
    fireEvent.click(saveBtn);

    // Avatar flow triggers onFileSelected -> uploadAvatar in saveProfile
    await waitFor(() => expect(uploadAvatarMock).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(updatePlayerAvatarMock).toHaveBeenCalledTimes(1),
    );
    expect(updatePlayerProfileMock).toHaveBeenCalledTimes(1);
    expect(savePlayerMock).toHaveBeenCalledTimes(1);

    // Ladder navigation
    await waitFor(() =>
      expect(screen.getByText('Ladder Page')).toBeInTheDocument(),
    );

    // Local storage should reflect updated name
    const stored = JSON.parse(
      localStorage.getItem('duelo_player_state_v1') || 'null',
    );
    expect(stored?.name).toBe('Nuevo Nombre');
  });
});
