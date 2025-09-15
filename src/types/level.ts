import { type Card } from './card';
import { type Character } from './character';
import { type Item } from './item';

export interface Level {
  id: string;
  name: string;
  description: string;
  enemies: Character[];
  rewards: {
    experience: number;
    items?: Item[];
    cards?: Card[];
  };
  nextLevelId?: string;
}
