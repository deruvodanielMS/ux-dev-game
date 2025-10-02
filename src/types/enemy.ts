/**
 * Define la estructura de un enemigo dentro del juego "Duelo de Código".
 * @interface IEnemy
 */
export interface IEnemy {
  id: string;
  name: string;
  type: 'technology' | 'tooling' | 'architecture' | 'ai';
  difficulty: 'easy' | 'medium' | 'hard' | 'boss';
  stats: {
    health: number;
    attack: number;
    defense: number;
  };
  description: string;
  avatar_url: string | null;
  // Propiedad para posibles debilidades/fortalezas contra cartas del jugador
  weakness?: string;
}

/**
 * Agrupa los enemigos por nivel de dificultad para la selección de batalla.
 * @type {Record<'easy' | 'medium' | 'hard' | 'boss', IEnemy[]>}
 */
export type EnemyMap = Record<IEnemy['difficulty'], IEnemy[]>;

/**
 * Props para componentes que necesitan información de enemigos
 */
export interface EnemyComponentProps {
  enemy: IEnemy;
  selected?: boolean;
  onSelect?: (enemyId: string) => void;
}

/**
 * Props para listas de enemigos
 */
export interface EnemyListProps {
  difficulty?: IEnemy['difficulty'];
  enemies: IEnemy[];
  selectedId?: string | null;
  onSelect?: (enemyId: string) => void;
}
