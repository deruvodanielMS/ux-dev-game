import { type Character, type Level } from '@/types';

import enemiesData from '@/data/enemies.json';

// Mapea los datos de enemigos al tipo Character
const enemies: Character[] = enemiesData.map((e) => ({
  id: e.id,
  name: e.name,
  avatar: e.avatar_url,
  level: ((): number => {
    switch (e.difficulty) {
      case 'easy':
        return 1;
      case 'medium':
        return 3;
      case 'hard':
        return 5;
      default:
        return 1;
    }
  })(),
  stats: {
    hp: e.stats.health,
    attack: e.stats.attack,
    defense: e.stats.defense,
    speed: 50, // Valor por defecto
  },
  abilities: [], // Sin habilidades por ahora
}));

// Mock data para los niveles
const levels: Level[] = [
  {
    id: '1',
    name: 'Nivel 1: El Despertar del Código',
    description: 'Comienza tu viaje y enfréntate a tu primer desafío.',
    enemies: [enemies[0]],
    rewards: {
      experience: 50,
    },
    nextLevelId: '2',
  },
  {
    id: '2',
    name: 'Nivel 2: La Senda del Junior',
    description: 'Has superado lo básico, pero el camino apenas comienza.',
    enemies: [enemies[1]],
    rewards: {
      experience: 100,
    },
  },
];

// Simula una llamada a una API para obtener un nivel por su ID
export const getLevel = async (id: string): Promise<Level | null> => {
  console.log(`Buscando nivel con id: ${id}`);
  const level = levels.find((l) => l.id === id);
  return Promise.resolve(level || null);
};
