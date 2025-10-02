// Music contexts for different game states
export enum MusicContext {
  MENU = 'menu',
  BATTLE = 'battle',
  MAP = 'map',
  VICTORY = 'victory',
}

// Audio context types
export type AudioContextType = {
  volume: number;
  setVolume: (v: number) => void;
  play: () => void;
  pause: () => void;
  setSource: (src?: string | null) => void;
  setMusicContext: (context: MusicContext) => void;
  currentContext: MusicContext;
  isPlaying: boolean;
  playSound: (sound: string) => void;
};
