import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { Skeleton } from '@/components/atoms/Skeleton/Skeleton';
import { ProgressMapTemplate } from '@/components/templates/ProgressMapTemplate/ProgressMapTemplate';

import { useGame } from '@/context/GameContext';
import enemiesData from '@/data/enemies.json';

import './ProgressMapPage.module.css';

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
  const goBattle = () => {
    // Placeholder: podríamos pasar enemyId por query param si luego la batalla admite targeting específico
    navigate('/battle');
  };
  const totalEnemies = (enemiesData as EnemyData[]).length;

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
        <div className="map">
          {levels.map((lvl) => (
            <div key={lvl.id} className="levelBlock">
              <h2 className="levelTitle">{lvl.title}</h2>
              <div className="levelRow">
                {lvl.enemies.map((e) => {
                  const done = defeated.includes(e.id);
                  const diffLabel =
                    e.difficulty === 'easy'
                      ? 'Fácil'
                      : e.difficulty === 'medium'
                        ? 'Media'
                        : e.difficulty === 'hard'
                          ? 'Difícil'
                          : e.difficulty;
                  return (
                    <button
                      key={e.id}
                      type="button"
                      className={`node enemyCard ${done ? 'done' : ''}`}
                      onClick={() => goBattle()}
                      aria-label={`Enemigo ${e.name} ${done ? 'derrotado' : ''}`}
                    >
                      <div className="nodeContent">
                        <div className="avatar">
                          {e.avatar_url ? (
                            <img src={e.avatar_url} alt={e.name} />
                          ) : (
                            <div className="placeholder">?</div>
                          )}
                        </div>
                        <div className="infoBlock">
                          <div className="nameRow">
                            <span className="name">{e.name}</span>
                            <span className={`badge diff-${e.difficulty}`}>
                              {diffLabel}
                            </span>
                            {done && (
                              <span className="check" title="Derrotado">
                                ✔
                              </span>
                            )}
                          </div>
                          {e.stats && (
                            <ul className="statLine" aria-label="Estadísticas">
                              <li title="Salud">❤ {e.stats.health}</li>
                              <li title="Ataque">⚔ {e.stats.attack}</li>
                              <li title="Defensa">🛡 {e.stats.defense}</li>
                            </ul>
                          )}
                          {e.description && (
                            <p className="desc" title={e.description}>
                              {e.description.length > 60
                                ? e.description.slice(0, 57) + '…'
                                : e.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
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
