import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { CharacterList } from '@/components/organisms/CharacterList/CharacterList';

import { useGame } from '@/context/GameContext';
import { usePlayers } from '@/hooks/usePlayers';
import { getTopPlayers } from '@/services/players';

import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  const { players, loading: playersLoading, refresh } = usePlayers();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const me = state.player;

  useEffect(() => {
    if (players.length === 0) void refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topPlayers = useMemo(() => getTopPlayers(players, 5), [players]);

  const totalDefeated = me?.defeatedEnemies?.length || 0;
  const level = me?.level ?? 1;
  const experience = me?.experience ?? 0;

  return (
    <div className={styles.page}>
      <header className={styles.headerRow}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: '0.25rem 0 0', opacity: 0.75 }}>
            Resumen de tu progreso y acciones rápidas.
          </p>
        </div>
        <div className={styles.actionsRow}>
          <Button onClick={() => navigate('/battle')}>Ir a Batalla</Button>
          <Button onClick={() => navigate('/progress')}>
            Mapa de Progreso
          </Button>
          <Button onClick={() => navigate('/ladder')}>Ladder</Button>
          <Button onClick={() => navigate('/profile')}>Perfil</Button>
        </div>
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.card}>
          <h4>Nivel</h4>
          <strong>{level}</strong>
        </div>
        <div className={styles.card}>
          <h4>Experiencia</h4>
          <strong>{experience}</strong>
        </div>
        <div className={styles.card}>
          <h4>Enemigos derrotados</h4>
          <strong>{totalDefeated}</strong>
        </div>
        <div className={styles.card}>
          <h4>Jugadores totales</h4>
          <strong>{playersLoading ? '...' : players.length}</strong>
        </div>
      </section>

      <div className={styles.flexRow}>
        <div className={styles.panel} style={{ flex: '2 1 520px' }}>
          <h3 className={styles.sectionTitle}>Personajes</h3>
          <CharacterList selectedId={selectedId} onSelect={setSelectedId} />
          <div className={styles.actionsRow}>
            <Button
              onClick={() => navigate('/battle')}
              ariaLabel="Confirmar selección"
            >
              Empezar Batalla
            </Button>
          </div>
        </div>

        <div className={styles.panel}>
          <h3 className={styles.sectionTitle}>Top 5 Jugadores</h3>
          <ul className={styles.topPlayersList}>
            {topPlayers.map((p, i) => (
              <li key={p.id}>
                <span className="name">
                  {i + 1}. {p.name || 'Jugador'}
                </span>
                <span className={styles.badge}>Lv {p.level}</span>
              </li>
            ))}
            {topPlayers.length === 0 && (
              <li style={{ opacity: 0.6 }}>
                {playersLoading ? 'Cargando...' : 'Sin jugadores aún'}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
