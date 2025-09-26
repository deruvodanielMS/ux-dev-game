import { vi } from 'vitest';

import '@testing-library/jest-dom';

// Mock for supabase client (tests that rely on supabase can override)
vi.mock('@/services/supabase', () => ({
  supabase: null,
}));

// Lightweight audio context mock
vi.mock('@/context/AudioContext', () => ({
  useAudio: () => ({
    isPlaying: false,
    setSource: () => {},
    play: () => {},
    pause: () => {},
  }),
  AudioProvider: ({ children }: { children: React.ReactNode }) => children,
}));
