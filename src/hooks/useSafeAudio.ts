import { useAudio as useAudioOriginal } from '@/context/AudioContext';

// Safe audio hook that provides fallbacks when AudioProvider is not available
export const useSafeAudio = () => {
  try {
    return useAudioOriginal();
  } catch {
    // Return fallback values when AudioProvider is not available
    return {
      isPlaying: false,
      volume: 0.5,
      play: () => console.warn('Audio not available: play()'),
      pause: () => console.warn('Audio not available: pause()'),
      setVolume: () => console.warn('Audio not available: setVolume()'),
      setSource: () => console.warn('Audio not available: setSource()'),
    };
  }
};
