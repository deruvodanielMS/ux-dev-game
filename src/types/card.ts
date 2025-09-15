export interface Card {
  id: string;
  name: string;
  description: string;
  type: 'attack' | 'defense' | 'special';
  value: number;
}
