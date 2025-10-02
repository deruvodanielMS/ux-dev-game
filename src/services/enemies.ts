import type { EnemyMap, IEnemy } from '@/types/enemy';

import enemiesData from '@/data/enemies.json';

/**
 * Servicio para manejar operaciones relacionadas con enemigos
 */
export class EnemyService {
  private static enemies: IEnemy[] = enemiesData as IEnemy[];

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
}
