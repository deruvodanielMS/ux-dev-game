import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

// Default background music tracks (royalty-free placeholders)
const DEFAULT_TRACKS = [
  'https://cdn.pixabay.com/download/audio/2022/03/15/audio_f5509d4f52.mp3?filename=arcade-funk-110045.mp3',
  'https://cdn.pixabay.com/download/audio/2023/01/12/audio_bfa4b5d479.mp3?filename=loopable-atmospheric-video-game-music-133983.mp3',
];

import type { AudioContextType } from '@/types/context/audio';

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
      audioRef.current.src = DEFAULT_TRACKS[0];
    }
  }, []);

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

  const value = useMemo(
    () => ({
      volume,
      setVolume,
      play,
      pause,
      setSource,
      isPlaying,
      playSound,
    }),
    [volume, isPlaying, playSound, play, pause, setSource],
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
