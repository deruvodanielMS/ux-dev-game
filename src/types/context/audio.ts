// Audio context types
export type AudioContextType = {
  volume: number;
  setVolume: (v: number) => void;
  play: () => void;
  pause: () => void;
  setSource: (src?: string | null) => void;
  isPlaying: boolean;
  playSound: (sound: string) => void;
};
