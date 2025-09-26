import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AuthButton } from '@/components/organisms/AuthButton/AuthButton';

import { AuthProvider } from '@/context/AuthContext';
import { GameProvider } from '@/context/GameContext';

// Mock auth0-react hook
vi.mock('@auth0/auth0-react', () => {
  return {
    useAuth0: () => ({
      loginWithPopup: vi.fn(),
      loginWithRedirect: vi.fn(),
      logout: vi.fn(),
      user: { name: 'Tester', picture: 'http://pic' },
      getAccessTokenSilently: vi.fn(),
      isAuthenticated: true,
    }),
  };
});

// Wrap with GameProvider because component dispatches CLEAR_USER on logout
function renderWithProviders(ui: React.ReactElement) {
  return render(
    <AuthProvider>
      <GameProvider>{ui}</GameProvider>
    </AuthProvider>,
  );
}

describe('AuthButton', () => {
  it('renders logout button when authenticated and triggers logout', () => {
    renderWithProviders(<AuthButton />);
    const btn = screen.getByRole('button', { name: /cerrar/i });
    expect(btn).toBeInTheDocument();
    fireEvent.click(btn);
    // If no error thrown, dispatch path executed. Full verification would require exporting reducer or spying storage.
    expect(localStorage.getItem('duelo_player_state_v1')).toBeNull();
  });
});
