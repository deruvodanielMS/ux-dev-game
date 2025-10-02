// src/data/enemies.ts
import type { EnemyMap, IEnemy } from '@/types/enemy';

// Los enemigos del catálogo extendido basados en el stack tecnológico
const ALL_ENEMIES: IEnemy[] = [
  // EASY ENEMIES
  {
    id: 'html-bug',
    name: 'HTML Bug',
    type: 'technology',
    difficulty: 'easy',
    stats: {
      health: 50,
      attack: 10,
      defense: 5,
    },
    description:
      'Un error trivial que provoca desalineación y elementos invisibles. Se derrota con una estructura limpia y semántica.',
    avatar_url:
      'https://cdn.builder.io/api/v1/image/assets%2F18b71006d6404cecbe90ad5e2b850e0e%2F483352f1ff834cd18e0ba1b6c3a7206f?format=webp&width=800',
    weakness: 'semantics',
  },
  {
    id: 'css-glitch',
    name: 'CSS Glitch',
    type: 'technology',
    difficulty: 'easy',
    stats: {
      health: 70,
      attack: 15,
      defense: 10,
    },
    description:
      'Un error visual que rompe el diseño en diferentes navegadores. Se derrota con una estrategia de CSS Modules.',
    avatar_url:
      'https://cdn.builder.io/api/v1/image/assets%2F18b71006d6404cecbe90ad5e2b850e0e%2F0fb1013d496a49b781517115e4aca1fe?format=webp&width=800',
    weakness: 'css-modules',
  },
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
    id: 'javascript-logic-error',
    name: 'JS Logic Error',
    type: 'technology',
    difficulty: 'medium',
    stats: {
      health: 120,
      attack: 25,
      defense: 15,
    },
    description:
      'Un fallo de lógica que congela la interfaz y provoca comportamiento inesperado. Requiere un pensamiento algorítmico y buenas prácticas de hooks.',
    avatar_url:
      'https://cdn.builder.io/api/v1/image/assets%2F18b71006d6404cecbe90ad5e2b850e0e%2Fddda0f3562a44039b6d43252060fbae0?format=webp&width=800',
    weakness: 'algorithms',
  },
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
    id: 'react-reconciliation-glitch',
    name: 'React Reconciliation Glitch',
    type: 'technology',
    difficulty: 'hard',
    stats: {
      health: 200,
      attack: 40,
      defense: 30,
    },
    description:
      'Un error en la actualización del DOM virtual que causa re-renders infinitos. Se derrota con optimización de componentes y memoization.',
    avatar_url:
      'https://cdn.builder.io/api/v1/image/assets%2F18b71006d6404cecbe90ad5e2b850e0e%2F61990cd3666442f1a167c3906283431b?format=webp&width=800',
    weakness: 'memoization',
  },
  {
    id: 'bundle-blocker',
    name: 'Bundle Blocker',
    type: 'tooling',
    difficulty: 'hard',
    stats: {
      health: 220,
      attack: 42,
      defense: 32,
    },
    description:
      'Un enemigo que ralentiza el proceso de bundling con dependencias innecesarias. Se derrota con tree-shaking y lazy loading.',
    avatar_url: null,
    weakness: 'tree-shaking',
  },
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

/**
 * Obtiene la configuración de niveles por dificultad
 * Cada dificultad tiene su propio conjunto de niveles y progreso
 */
export const getLevelsByDifficulty = () => {
  return {
    easy: {
      title: 'Nivel 1: Fundamentos',
      description: 'Errores básicos de desarrollo web',
      enemies: getEnemiesByDifficultyLevel('easy'),
      levelRange: [1, 2], // Niveles de personaje recomendados
      rewards: {
        baseExperience: 50,
        multiplier: 1.0,
      },
    },
    medium: {
      title: 'Nivel 2: Desafíos Intermedios',
      description: 'Problemas de arquitectura y lógica',
      enemies: getEnemiesByDifficultyLevel('medium'),
      levelRange: [3, 5],
      rewards: {
        baseExperience: 100,
        multiplier: 1.5,
      },
    },
    hard: {
      title: 'Nivel 3: Amenazas Críticas',
      description: 'Problemas complejos de rendimiento y escalabilidad',
      enemies: getEnemiesByDifficultyLevel('hard'),
      levelRange: [6, 8],
      rewards: {
        baseExperience: 200,
        multiplier: 2.0,
      },
    },
    boss: {
      title: 'Nivel 4: El Jefe Final',
      description: 'La IA que amenaza con absorber a todos los desarrolladores',
      enemies: getEnemiesByDifficultyLevel('boss'),
      levelRange: [9, 10],
      rewards: {
        baseExperience: 500,
        multiplier: 3.0,
      },
    },
  };
};

/**
 * Obtiene el siguiente nivel de dificultad basado en el progreso
 */
export const getNextDifficultyLevel = (
  currentDifficulty: IEnemy['difficulty'],
  defeatedEnemies: string[],
): IEnemy['difficulty'] | null => {
  const difficulties: IEnemy['difficulty'][] = [
    'easy',
    'medium',
    'hard',
    'boss',
  ];
  const currentIndex = difficulties.indexOf(currentDifficulty);

  // Verificar si se han completado todos los enemigos del nivel actual
  const currentLevelEnemies = getEnemiesByDifficultyLevel(currentDifficulty);
  const defeatedInCurrentLevel = currentLevelEnemies.filter((enemy) =>
    defeatedEnemies.includes(enemy.id),
  ).length;

  // Si se completó el nivel actual y hay un siguiente nivel
  if (
    defeatedInCurrentLevel === currentLevelEnemies.length &&
    currentIndex < difficulties.length - 1
  ) {
    return difficulties[currentIndex + 1];
  }

  return null;
};

/**
 * Calcula el progreso total del jugador por nivel de dificultad
 */
export const getProgressByDifficulty = (defeatedEnemies: string[]) => {
  const difficulties: IEnemy['difficulty'][] = [
    'easy',
    'medium',
    'hard',
    'boss',
  ];

  return difficulties.reduce(
    (progress, difficulty) => {
      const levelEnemies = getEnemiesByDifficultyLevel(difficulty);
      const defeated = levelEnemies.filter((enemy) =>
        defeatedEnemies.includes(enemy.id),
      ).length;

      progress[difficulty] = {
        defeated,
        total: levelEnemies.length,
        completed: defeated === levelEnemies.length,
        percentage:
          levelEnemies.length > 0
            ? Math.round((defeated / levelEnemies.length) * 100)
            : 0,
      };

      return progress;
    },
    {} as Record<
      IEnemy['difficulty'],
      {
        defeated: number;
        total: number;
        completed: boolean;
        percentage: number;
      }
    >,
  );
};

// Ejemplo de uso: ENEMY_DATA.easy, ENEMY_DATA.medium, etc.
