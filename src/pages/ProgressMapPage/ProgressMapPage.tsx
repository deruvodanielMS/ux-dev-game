import { useNavigate } from 'react-router-dom';

import { Button } from '../../components/atoms/Button/Button';
import { Skeleton } from '../../components/atoms/Skeleton/Skeleton';
import { ProgressMapTemplate } from '../../components/templates/ProgressMapTemplate/ProgressMapTemplate';

import { useGame } from '../../context/GameContext';

import styles from './ProgressMapPage.module.css';

export const ProgressMapPage = () => {
  const { state } = useGame();
  const { player, currentLevel, loading, error } = state;
  const navigate = useNavigate();

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
  if (!player || !currentLevel) return <div>Sin datos de juego.</div>;

  const defeated = player.defeatedEnemies || [];

  return (
    <ProgressMapTemplate
      title={<h1 className={styles.title}>Mapa de Progreso</h1>}
      subtitle={
        <p className={styles.subtitle}>
          Tu camino contra las tecnologías corrompidas. Derrota a los enemigos
          para avanzar.
        </p>
      }
      map={
        <div className={styles.map}>
          {currentLevel.enemies.map((e) => {
            const done = defeated.includes(e.id);
            return (
              <div
                key={e.id}
                className={`${styles.node} ${done ? styles.done : ''}`}
              >
                <div className={styles.nodeContent}>
                  <div className={styles.avatar}>
                    {e.avatar ? (
                      <img src={e.avatar} alt={e.name} />
                    ) : (
                      <div className={styles.placeholder}>?</div>
                    )}
                  </div>
                  <div className={styles.name}>{e.name}</div>
                  {done && <div className={styles.check}>✔</div>}
                </div>
              </div>
            );
          })}
        </div>
      }
      summary={
        <div className={styles.summary}>
          <div>
            Derrotados: {defeated.length} / {currentLevel.enemies.length}
          </div>
          {defeated.length > 0 &&
            defeated.length < currentLevel.enemies.length && (
              <div className={styles.nextWrap}>
                <Button
                  onClick={() => navigate('/battle')}
                  ariaLabel="Ir al siguiente nivel"
                >
                  Siguiente Nivel
                </Button>
              </div>
            )}
          {defeated.length === currentLevel.enemies.length && (
            <div className={styles.congrats}>
              ¡Has despejado este mapa! Prepárate para el próximo desafío.
            </div>
          )}
        </div>
      }
      playerName={player.name || 'Jugador'}
      currentLevelName={currentLevel.name}
      levelDescription={currentLevel.description}
      rewards={{ experience: currentLevel.rewards.experience }}
    />
  );
};
