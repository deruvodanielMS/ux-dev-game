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

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
      audioRef.current.preload = 'auto';
      audioRef.current.addEventListener('play', () => setIsPlaying(true));
      audioRef.current.addEventListener('pause', () => setIsPlaying(false));
      audioRef.current.addEventListener('ended', () => setIsPlaying(false));
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
      if (audioRef.current.src !== newTrack) {
        const wasPlaying = !audioRef.current.paused;
        audioRef.current.src = newTrack;
        if (wasPlaying) {
          audioRef.current.play().catch(console.warn);
        }
      }
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
