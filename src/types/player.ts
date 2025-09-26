import { type Card } from './card';
import { type Character } from './character';
import { type Item } from './item';

export interface Player {
  id: string;
  // slug: identificador externo (Auth0 sub) cuando id es numérico en DB
  slug?: string | null;
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
  email?: string | null;

  selectedCharacter?: string | null;
  githubPRs?: number;
  stats?: Record<string, number>;
  defeatedEnemies?: string[];
}
