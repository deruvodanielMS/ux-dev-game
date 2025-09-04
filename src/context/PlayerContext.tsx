import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export type Stats = {
  soft_skills: number;
  tech_skills: number;
  core_values: number;
  creativity: number;
  ai_level: number;
};

export type PlayerState = {
  playerName: string;
  selectedCharacter: string | null;
  avatarUrl: string | null;
  githubPRs: number;
  level: number;
  stats: Stats;
  defeatedEnemies: string[];
};

const initialState: PlayerState = {
  playerName: '',
  selectedCharacter: null,
  avatarUrl: null,
  githubPRs: 0,
  level: 1,
  stats: {
    soft_skills: 10,
    tech_skills: 10,
    core_values: 10,
    creativity: 10,
    ai_level: 1,
  },
  defeatedEnemies: [],
};

type Action =
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_SELECTED_CHARACTER'; payload: string }
  | { type: 'SET_AVATAR'; payload: string | null }
  | { type: 'INC_PR'; payload?: number }
  | { type: 'SET_STATS'; payload: Partial<Stats> }
  | { type: 'ADD_DEFEATED_ENEMY'; payload: string };

function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'SET_NAME':
      return { ...state, playerName: action.payload };
    case 'SET_SELECTED_CHARACTER':
      return { ...state, selectedCharacter: action.payload };
    case 'SET_AVATAR':
      return { ...state, avatarUrl: action.payload };
    case 'INC_PR':
      return { ...state, githubPRs: state.githubPRs + (action.payload ?? 1) };
    case 'SET_STATS':
      return { ...state, stats: { ...state.stats, ...action.payload } };
    case 'ADD_DEFEATED_ENEMY':
      if (state.defeatedEnemies.includes(action.payload)) return state;
      return { ...state, defeatedEnemies: [...state.defeatedEnemies, action.payload] };
    default:
      return state;
  }
}

type ContextType = {
  state: PlayerState;
  dispatch: React.Dispatch<Action>;
};

const PlayerContext = createContext<ContextType | undefined>(undefined);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return <PlayerContext.Provider value={{ state, dispatch }}>{children}</PlayerContext.Provider>;
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
}
