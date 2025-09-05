import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';

type AudioContextType = {
  volume: number;
  setVolume: (v: number) => void;
  play: () => void;
  pause: () => void;
  setSource: (src?: string | null) => void;
  isPlaying: boolean;
};

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [volume, setVolumeState] = useState<number>(() => {
    try {
      const v = localStorage.getItem('app_volume');
      return v ? Number(v) : 0.7;
    } catch { return 0.7; }
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
      } catch (e) {}
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
    try { localStorage.setItem('app_volume', String(volume)); } catch {}
  }, [volume]);

  const setSource = (src?: string | null) => {
    if (!audioRef.current) return;
    if (!src) {
      audioRef.current.pause();
      audioRef.current.src = '';
      setIsPlaying(false);
      return;
    }
    if (audioRef.current.src !== src) {
      audioRef.current.src = src;
    }
  };

  const play = async () => {
    try {
      if (!audioRef.current) return;
      await audioRef.current.play();
    } catch (e) {
      console.warn('Audio play failed', e);
    }
  };
  const pause = () => {
    try { audioRef.current?.pause(); } catch (e) { console.warn(e); }
  };

  const setVolume = (v: number) => setVolumeState(Math.max(0, Math.min(1, v)));

  const value = useMemo(() => ({ volume, setVolume, play, pause, setSource, isPlaying }), [volume, isPlaying]);

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}

export function useAudio(){
  const ctx = useContext(AudioContext);
  if (!ctx) throw new Error('useAudio must be used within AudioProvider');
  return ctx;
}
