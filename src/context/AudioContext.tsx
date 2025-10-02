import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import type { AudioContextType } from '@/types/context/audio';
import { MusicContext } from '@/types/context/audio';

// Music tracks for different game contexts
const MUSIC_TRACKS = {
  [MusicContext.MENU]: '/music/pre-battle-workout-317984.mp3',
  [MusicContext.BATTLE]: '/music/Battle Cry.mp3',
  [MusicContext.MAP]:
    '/music/190729-heavy-battle-guitar-dark-hard-noise-155527.mp3',
  [MusicContext.VICTORY]: '/music/stealth-battle-205902.mp3', // Using map music for victory
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const v = localStorage.getItem('app_volume');
      return v ? Number(v) : 0.7;
    } catch {
      return 0.7;
    }
  });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentContext, setCurrentContextState] = useState<MusicContext>(
    MusicContext.MENU,
  );
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.preload = 'auto';
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));

      // Auto-play inicial cuando se carga el audio
      audioRef.current.src = MUSIC_TRACKS[currentContext];

      // Función para intentar reproducir
      const tryAutoPlay = () => {
        if (audioRef.current) {
          const playPromise = audioRef.current.play();
          playPromise?.catch(() => {
            console.info('Autoplay was prevented by browser policy');
          });
        }
      };

      // Intentar inmediatamente
      tryAutoPlay();

      // Configurar listener para el primer click/touch del usuario
      const handleFirstInteraction = () => {
        setUserHasInteracted(true);
        tryAutoPlay();
        // Remover listeners después del primer uso
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };

      document.addEventListener('click', handleFirstInteraction);
      document.addEventListener('keydown', handleFirstInteraction);
      document.addEventListener('touchstart', handleFirstInteraction);

      return () => {
        document.removeEventListener('click', handleFirstInteraction);
        document.removeEventListener('keydown', handleFirstInteraction);
        document.removeEventListener('touchstart', handleFirstInteraction);
      };
    }
    return () => {
      try {
        audioRef.current?.pause();
        audioRef.current = null;
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    try {
      localStorage.setItem('app_volume', String(volume));
    } catch {
      // ignore
    }
  }, [volume]);

  // Efecto para auto-reproducir cuando cambia el contexto
  useEffect(() => {
    if (audioRef.current && audioRef.current.src) {
      // Si ya tenemos una fuente y el usuario ha interactuado o es la primera carga
      const tryPlay = () => {
        const playPromise = audioRef.current?.play();
        playPromise?.catch(() => {
          console.info('Could not auto-play music');
        });
      };

      // Pequeño delay para asegurar que el src está listo
      const timer = setTimeout(tryPlay, 100);
      return () => clearTimeout(timer);
    }
  }, [currentContext, userHasInteracted]);

  const setVolume = (v: number) => setVolumeState(Math.max(0, Math.min(1, v)));

  // DEFAULT_TRACKS moved outside component scope (see bottom) if needed

  const ensureSource = useCallback(() => {
    if (audioRef.current && !audioRef.current.src) {
      audioRef.current.src = MUSIC_TRACKS[currentContext];
    }
  }, [currentContext]);

  const play = useCallback(() => {
    if (!audioRef.current) return;
    ensureSource();

    // Asegurar que el usuario ha interactuado
    setUserHasInteracted(true);

    const p = audioRef.current.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => undefined);
    }
  }, [ensureSource]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const setSource = useCallback(
    (src?: string | null) => {
      if (audioRef.current) {
        audioRef.current.src = src ?? '';
        if (src && isPlaying) {
          const p = audioRef.current.play();
          p?.catch(() => undefined);
        }
      }
    },
    [isPlaying],
  );

  const playSound = useCallback(
    (sound: string) => {
      const audio = new Audio(sound);
      audio.volume = volume;
      audio.play();
    },
    [volume],
  );

  const setMusicContext = useCallback((context: MusicContext) => {
    setCurrentContextState(context);
    if (audioRef.current) {
      const newTrack = MUSIC_TRACKS[context];
      const currentSrc = audioRef.current.src;

      // Verificar si necesita cambiar la fuente
      if (!currentSrc.endsWith(newTrack)) {
        audioRef.current.src = newTrack;
      }

      // Siempre intentar reproducir cuando cambia el contexto
      const playPromise = audioRef.current.play();
      playPromise?.catch(() => {
        console.info('Auto-play was prevented by browser policy');
      });
    }
  }, []);

  const value = useMemo(
    () => ({
      volume,
      setVolume,
      play,
      pause,
      setSource,
      setMusicContext,
      currentContext,
      isPlaying,
      playSound,
    }),
    [
      volume,
      isPlaying,
      playSound,
      play,
      pause,
      setSource,
      setMusicContext,
      currentContext,
    ],
  );

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
};

export const useAudio = () => {
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
};
