export interface Character {
  id: string;
  name: string;
  avatar: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    speed: number;
  };
  abilities: {
    name: string;
    description: string;
    power: number;
  }[];
}
