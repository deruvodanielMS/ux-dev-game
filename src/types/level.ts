import { Card } from './card';
import { Character } from './character';
import { Item } from './item';

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
