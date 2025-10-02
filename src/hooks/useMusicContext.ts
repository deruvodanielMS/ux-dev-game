import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { MusicContext } from '@/types/context/audio';

import { useAudio } from '@/context/AudioContext';

/**
 * Hook que cambia automáticamente el contexto musical basado en la ruta actual
 */
export const useMusicContext = () => {
  const location = useLocation();
  const { setMusicContext } = useAudio();

  useEffect(() => {
    const path = location.pathname;
    let context: MusicContext;

    // Determinar contexto musical basado en la ruta
    if (path.includes('/battle')) {
      context = MusicContext.BATTLE;
    } else if (
      path.includes('/ladder') ||
      path.includes('/progress') ||
      path.includes('/map')
    ) {
      context = MusicContext.MAP;
    } else if (
      path === '/' ||
      path.includes('/welcome') ||
      path.includes('/setup')
    ) {
      context = MusicContext.MENU;
    } else {
      // Default para rutas no específicas
      context = MusicContext.MENU;
    }

    setMusicContext?.(context);
  }, [location.pathname, setMusicContext]);
};

/**
 * Hook para cambiar manualmente el contexto musical
 * Útil para momentos específicos como victoria en batalla
 */
export const useMusicController = () => {
  const { setMusicContext, currentContext, isPlaying, play, pause } =
    useAudio();

  const playVictoryMusic = () => {
    setMusicContext?.(MusicContext.VICTORY);
  };

  const returnToPreviousContext = (
    context: MusicContext = MusicContext.MAP,
  ) => {
    setMusicContext?.(context);
  };

  return {
    playVictoryMusic,
    returnToPreviousContext,
    setMusicContext,
    currentContext,
    isPlaying,
    play,
    pause,
  };
};
