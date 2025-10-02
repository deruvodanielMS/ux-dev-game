import type { EnemyMap, IEnemy } from '@/types/enemy';

import {
  getAllEnemies,
  getLevelsByDifficulty,
  getProgressByDifficulty,
} from '@/data/enemies';

/**
 * Servicio para manejar operaciones relacionadas con enemigos
 */
export class EnemyService {
  private static enemies: IEnemy[] = getAllEnemies();

  /**
   * Obtiene todos los enemigos
   */
  static getAllEnemies(): IEnemy[] {
    return this.enemies;
  }

  /**
   * Obtiene un enemigo por su ID
   */
  static getEnemyById(id: string): IEnemy | undefined {
    return this.enemies.find((enemy) => enemy.id === id);
  }

  /**
   * Agrupa los enemigos por dificultad
   */
  static getEnemiesByDifficulty(): EnemyMap {
    return this.enemies.reduce((acc, enemy) => {
      if (!acc[enemy.difficulty]) {
        acc[enemy.difficulty] = [];
      }
      acc[enemy.difficulty].push(enemy);
      return acc;
    }, {} as EnemyMap);
  }

  /**
   * Obtiene enemigos por nivel de dificultad específico
   */
  static getEnemiesByDifficultyLevel(
    difficulty: IEnemy['difficulty'],
  ): IEnemy[] {
    return this.enemies.filter((enemy) => enemy.difficulty === difficulty);
  }

  /**
   * Obtiene un enemigo aleatorio de una dificultad específica
   */
  static getRandomEnemyByDifficulty(
    difficulty: IEnemy['difficulty'],
  ): IEnemy | null {
    const enemies = this.getEnemiesByDifficultyLevel(difficulty);
    if (enemies.length === 0) return null;
    return enemies[Math.floor(Math.random() * enemies.length)];
  }

  /**
   * Obtiene estadísticas agregadas por dificultad
   */
  static getStatsByDifficulty(): Record<
    IEnemy['difficulty'],
    {
      count: number;
      avgHealth: number;
      avgAttack: number;
      avgDefense: number;
    }
  > {
    const enemiesByDifficulty = this.getEnemiesByDifficulty();
    const result = {} as Record<
      IEnemy['difficulty'],
      {
        count: number;
        avgHealth: number;
        avgAttack: number;
        avgDefense: number;
      }
    >;

    Object.entries(enemiesByDifficulty).forEach(([difficulty, enemies]) => {
      const count = enemies.length;
      const totalHealth = enemies.reduce((sum, e) => sum + e.stats.health, 0);
      const totalAttack = enemies.reduce((sum, e) => sum + e.stats.attack, 0);
      const totalDefense = enemies.reduce((sum, e) => sum + e.stats.defense, 0);

      result[difficulty as IEnemy['difficulty']] = {
        count,
        avgHealth: Math.round(totalHealth / count),
        avgAttack: Math.round(totalAttack / count),
        avgDefense: Math.round(totalDefense / count),
      };
    });

    return result;
  }

  /**
   * Busca enemigos por nombre o descripción
   */
  static searchEnemies(query: string): IEnemy[] {
    const lowerQuery = query.toLowerCase();
    return this.enemies.filter(
      (enemy) =>
        enemy.name.toLowerCase().includes(lowerQuery) ||
        enemy.description.toLowerCase().includes(lowerQuery) ||
        enemy.type.toLowerCase().includes(lowerQuery),
    );
  }

  /**
   * Filtra enemigos por tipo
   */
  static getEnemiesByType(type: IEnemy['type']): IEnemy[] {
    return this.enemies.filter((enemy) => enemy.type === type);
  }

  /**
   * Obtiene el progreso del jugador contra enemigos
   */
  static getPlayerProgress(defeatedEnemies: string[]): {
    totalEnemies: number;
    defeated: number;
    remaining: number;
    progressPercentage: number;
    defeatedByDifficulty: Record<IEnemy['difficulty'], number>;
  } {
    const totalEnemies = this.enemies.length;
    const defeated = defeatedEnemies.length;
    const remaining = totalEnemies - defeated;
    const progressPercentage = Math.round((defeated / totalEnemies) * 100);

    // Contar derrotados por dificultad
    const defeatedByDifficulty = {} as Record<IEnemy['difficulty'], number>;
    const difficulties: IEnemy['difficulty'][] = [
      'easy',
      'medium',
      'hard',
      'boss',
    ];

    difficulties.forEach((diff) => {
      defeatedByDifficulty[diff] = 0;
    });

    defeatedEnemies.forEach((enemyId) => {
      const enemy = this.getEnemyById(enemyId);
      if (enemy) {
        defeatedByDifficulty[enemy.difficulty]++;
      }
    });

    return {
      totalEnemies,
      defeated,
      remaining,
      progressPercentage,
      defeatedByDifficulty,
    };
  }

  /**
   * Obtiene información de niveles por dificultad
   */
  static getLevelsInfo() {
    return getLevelsByDifficulty();
  }

  /**
   * Obtiene progreso detallado por dificultad
   */
  static getDetailedProgress(defeatedEnemies: string[]) {
    return getProgressByDifficulty(defeatedEnemies);
  }

  /**
   * Verifica si un jugador puede acceder a una dificultad específica
   */
  static canAccessDifficulty(
    difficulty: IEnemy['difficulty'],
    defeatedEnemies: string[],
  ): boolean {
    if (difficulty === 'easy') return true;

    const difficulties: IEnemy['difficulty'][] = [
      'easy',
      'medium',
      'hard',
      'boss',
    ];
    const difficultyIndex = difficulties.indexOf(difficulty);

    if (difficultyIndex === -1) return false;

    // Verificar que se hayan completado todos los niveles anteriores
    for (let i = 0; i < difficultyIndex; i++) {
      const prevDifficulty = difficulties[i];
      const prevEnemies = this.getEnemiesByDifficultyLevel(prevDifficulty);
      const defeatedPrev = prevEnemies.filter((enemy) =>
        defeatedEnemies.includes(enemy.id),
      ).length;

      if (defeatedPrev < prevEnemies.length) return false;
    }

    return true;
  }
}
