import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { LevelNode } from '@/components/atoms/LevelNode/LevelNode';
import { Skeleton } from '@/components/atoms/Skeleton/Skeleton';
import { ProgressMapTemplate } from '@/components/templates/ProgressMapTemplate/ProgressMapTemplate';

import { useGame } from '@/context/GameContext';
import enemiesData from '@/data/enemies.json';

import styles from './ProgressMapPage.module.css';

// Simple derived grouping of enemies into pseudo-levels by difficulty for visualization
type EnemyData = {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard' | string;
  avatar_url?: string;
  description?: string;
  stats?: {
    health: number;
    attack: number;
    defense: number;
  };
};
interface GroupedLevel {
  id: string;
  title: string;
  enemies: EnemyData[];
}
function groupEnemies(all: EnemyData[]): GroupedLevel[] {
  const groups: Record<string, EnemyData[]> = {
    easy: [],
    medium: [],
    hard: [],
  };
  all.forEach((e) => {
    if (e.difficulty in groups) groups[e.difficulty].push(e);
    else groups.easy.push(e);
  });
  return [
    { id: 'easy', title: 'Nivel 1: Fundamentos', enemies: groups.easy },
    {
      id: 'medium',
      title: 'Nivel 2: Desafíos Intermedios',
      enemies: groups.medium,
    },
    { id: 'hard', title: 'Nivel 3: Amenazas Críticas', enemies: groups.hard },
  ].filter((g) => g.enemies.length > 0);
}

export const ProgressMapPage = () => {
  const { state } = useGame();
  const { player, loading, error } = state;
  const navigate = useNavigate();

  const levels = useMemo(() => groupEnemies(enemiesData as EnemyData[]), []);

  if (loading) {
    return (
      <div style={{ padding: '2rem' }}>
        <Skeleton height={40} width="30%" />
        <Skeleton height={20} width="50%" />
        <Skeleton height={200} />
      </div>
    );
  }

  if (error) return <div>Error: {error.message}</div>;
  if (!player) return <div>Sin datos de jugador.</div>;

  const defeated = player.defeatedEnemies || [];
  const goBattle = (enemyId: string) => {
    navigate(`/battle?enemy=${encodeURIComponent(enemyId)}`);
  };
  const totalEnemies = (enemiesData as EnemyData[]).length;

  // Construimos una serie lineal de "niveles" (enemies) para representar nodos
  const allEnemies = levels.flatMap((g) => g.enemies);
  const nodes = allEnemies.map((e, idx) => {
    const done = defeated.includes(e.id);
    const prev = allEnemies[idx - 1];
    const unlocked = idx === 0 || (prev && defeated.includes(prev.id));
    const current = !done && unlocked;
    const state: 'locked' | 'current' | 'completed' = done
      ? 'completed'
      : current
        ? 'current'
        : 'locked';
    return { id: e.id, index: idx, label: e.name, state, stars: done ? 3 : 0 };
  });

  // Posicionamiento simple serpenteante (zig-zag) calculado como porcentajes
  const positioned = nodes.map((n, i) => {
    const row = Math.floor(i / 5); // 5 nodos por fila virtual
    const posInRow = i % 5;
    const directionLeftToRight = row % 2 === 0;
    const xSlot = directionLeftToRight ? posInRow : 4 - posInRow;
    const x = 12 + xSlot * 18; // 12%, 30%, 48%, 66%, 84%
    const y = 18 + row * 28; // escalonado vertical
    return { ...n, x, y };
  });

  // Construir path SVG siguiendo los puntos
  const pathD = positioned
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
    .join(' ');

  return (
    <ProgressMapTemplate
      title={<h1 className="title">Mapa de Progreso</h1>}
      subtitle={
        <p className="subtitle">
          Tu camino contra las tecnologías corrompidas. Derrota a los enemigos
          para avanzar.
        </p>
      }
      map={
        <div className={styles.map}>
          <svg
            className={styles.pathLayer}
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              className={styles.dottedPath}
              d={pathD.replace(
                /(\d+\.?\d*) (\d+\.?\d*)/g,
                (_, x, y) => `${x} ${y}`,
              )}
            />
          </svg>
          <div className={styles.nodesLayer}>
            <div className={styles.nodesLayerInner}>
              {positioned.map((n) => (
                <div
                  key={n.id}
                  className={styles.nodeWrap}
                  style={{ left: `${n.x}%`, top: `${n.y}%` }}
                >
                  <LevelNode
                    id={n.id}
                    index={n.index}
                    label={n.label}
                    stars={n.stars}
                    state={n.state}
                    onClick={(id) => goBattle(id)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      }
      summary={
        <div className="summary">
          <div>
            Derrotados: {defeated.length} / {totalEnemies}
          </div>
          {defeated.length < totalEnemies && (
            <div className="nextWrap">
              <Button onClick={() => navigate('/battle')} ariaLabel="Batalla">
                Continuar Batalla
              </Button>
            </div>
          )}
          {defeated.length === totalEnemies && (
            <div className="congrats">
              ¡Has derrotado a todos los enemigos disponibles! Más pronto...
            </div>
          )}
        </div>
      }
    />
  );
};
