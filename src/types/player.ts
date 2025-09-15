import { Card } from './card';
import { Character } from './character';
import { Item } from './item';

export interface Player {
  id: string;
  name: string;
  avatarUrl?: string | null;
  level: number;
  experience: number;
  characters: Character[];
  inventory: {
    items: Item[];
    cards: Card[];
  };
  progress: {
    currentLevelId: string;
    completedLevels: string[];
  };
  // Auth related / legacy compatibility fields
  email?: string | null;
  userId?: string | null;
  selectedCharacter?: string | null;
  githubPRs?: number;
  stats?: Record<string, number>;
  defeatedEnemies?: string[];
  isLoggedIn?: boolean;
}
