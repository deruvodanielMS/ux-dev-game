// src/data/enemies.ts
import type { EnemyMap, IEnemy } from '@/types/enemy';

// Los enemigos del catálogo extendido basados en el stack tecnológico
const ALL_ENEMIES: IEnemy[] = [
  // EASY ENEMIES
  {
    id: 'ts-any-tyrant',
    name: "'any' Tyrant",
    type: 'technology',
    difficulty: 'easy',
    stats: {
      health: 60,
      attack: 12,
      defense: 8,
    },
    description:
      'Un enemigo débil que evade el tipado estricto. Se derrota con interfaces y tipados genéricos.',
    avatar_url: null,
    weakness: 'interfaces',
  },
  {
    id: 'vite-cache-miss',
    name: 'Vite Cache Miss',
    type: 'tooling',
    difficulty: 'easy',
    stats: {
      health: 80,
      attack: 18,
      defense: 12,
    },
    description:
      'Un fallo menor en el Hot Module Replacement. Se derrota con una limpieza de caché o un reinicio rápido.',
    avatar_url: null,
    weakness: 'cache-clear',
  },

  // MEDIUM ENEMIES
  {
    id: 'component-spaghetti',
    name: 'Spaghetti Component',
    type: 'architecture',
    difficulty: 'medium',
    stats: {
      health: 140,
      attack: 28,
      defense: 20,
    },
    description:
      'Un componente enorme con lógica mezclada y sobrecarga de props. Requiere refactorización y aplicación de Atomic Design.',
    avatar_url: null,
    weakness: 'refactoring',
  },
  {
    id: 'prop-drilling-fiend',
    name: 'Prop Drilling Fiend',
    type: 'architecture',
    difficulty: 'medium',
    stats: {
      health: 160,
      attack: 32,
      defense: 25,
    },
    description:
      'Un demonio que extiende las props innecesariamente. Se derrota implementando Context API o un gestor de estado.',
    avatar_url: null,
    weakness: 'context',
  },

  // HARD ENEMIES
  {
    id: 'supa-query-lag',
    name: 'Supabase Query Lag',
    type: 'architecture',
    difficulty: 'hard',
    stats: {
      health: 240,
      attack: 45,
      defense: 35,
    },
    description:
      'Una consulta ineficiente que causa retrasos en el servidor. Se derrota con indexación, políticas RLS y optimización de joins.',
    avatar_url: null,
    weakness: 'optimization',
  },

  // BOSS ENEMY
  {
    id: 'the-absorber',
    name: 'The Absorber (AI Core)',
    type: 'ai',
    difficulty: 'boss',
    stats: {
      health: 400,
      attack: 60,
      defense: 50,
    },
    description:
      'La IA que absorbe a los desarrolladores inactivos. Se derrota con la finalización del Design System y un Pull Request magistral.',
    avatar_url: null,
    weakness: 'design-system',
  },
];

/**
 * Función utilitaria para organizar los enemigos por dificultad.
 */
export const getEnemiesByDifficulty = (enemies: IEnemy[]): EnemyMap => {
  return enemies.reduce(
    (acc, enemy) => {
      // Inicializa el array si es la primera vez que se ve esa dificultad
      if (!acc[enemy.difficulty]) {
        acc[enemy.difficulty] = [];
      }
      acc[enemy.difficulty].push(enemy);
      return acc;
    },
    {} as EnemyMap, // 'as EnemyMap' asegura el tipo de retorno
  );
};

export const ENEMY_DATA: EnemyMap = getEnemiesByDifficulty(ALL_ENEMIES);

/**
 * Obtiene un enemigo por su ID
 */
export const getEnemyById = (id: string): IEnemy | undefined => {
  return ALL_ENEMIES.find((enemy) => enemy.id === id);
};

/**
 * Obtiene enemigos por dificultad
 */
export const getEnemiesByDifficultyLevel = (
  difficulty: IEnemy['difficulty'],
): IEnemy[] => {
  return ENEMY_DATA[difficulty] || [];
};

/**
 * Obtiene un enemigo aleatorio de una dificultad específica
 */
export const getRandomEnemyByDifficulty = (
  difficulty: IEnemy['difficulty'],
): IEnemy | null => {
  const enemies = getEnemiesByDifficultyLevel(difficulty);
  if (enemies.length === 0) return null;
  return enemies[Math.floor(Math.random() * enemies.length)];
};

/**
 * Obtiene la lista completa de enemigos
 */
export const getAllEnemies = (): IEnemy[] => {
  return ALL_ENEMIES;
};

// Ejemplo de uso: ENEMY_DATA.easy, ENEMY_DATA.medium, etc.
