import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { Heading, Text } from '@/components/atoms/Typography';
import { CharacterList } from '@/components/organisms/CharacterList/CharacterList';

import { useGame } from '@/context/GameContext';
import { usePlayers } from '@/hooks/usePlayers';
import { getTopPlayers } from '@/services/players';

import styles from './DashboardPage.module.css';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { state } = useGame();
  const { players, loading: playersLoading, refresh } = usePlayers();
  const { t } = useTranslation();
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
    <div className={styles.page} data-testid="dashboard-page">
      <header className={styles.headerRow} data-testid="dashboard-header">
        <div>
          <Heading
            level="h1"
            style={{ margin: 0 }}
            data-testid="dashboard-title"
          >
            {t('dashboard.title')}
          </Heading>
          <Text
            style={{ margin: '0.25rem 0 0', opacity: 0.75 }}
            data-testid="dashboard-subtitle"
          >
            {t('dashboard.subtitle')}
          </Text>
        </div>
        <div className={styles.actionsRow} data-testid="dashboard-navigation">
          <Button
            onClick={() => navigate('/battle')}
            data-testid="nav-battle-button"
          >
            {t('nav.battle')}
          </Button>
          <Button
            onClick={() => navigate('/progress')}
            data-testid="nav-progress-button"
          >
            {t('nav.progress')}
          </Button>
          <Button
            onClick={() => navigate('/ladder')}
            data-testid="nav-ladder-button"
          >
            {t('nav.ladder')}
          </Button>
        </div>
      </header>

      <section className={styles.kpiGrid} data-testid="dashboard-kpis">
        <div className={styles.card} data-testid="kpi-level">
          <Heading level="h4">{t('dashboard.level')}</Heading>
          <strong data-testid="level-value">{level}</strong>
        </div>
        <div className={styles.card} data-testid="kpi-experience">
          <Heading level="h4">{t('dashboard.experience')}</Heading>
          <strong data-testid="experience-value">{experience}</strong>
        </div>
        <div className={styles.card} data-testid="kpi-enemies-defeated">
          <Heading level="h4">{t('dashboard.enemiesDefeated')}</Heading>
          <strong data-testid="enemies-defeated-value">{totalDefeated}</strong>
        </div>
        <div className={styles.card} data-testid="kpi-total-players">
          <Heading level="h4">{t('dashboard.totalPlayers')}</Heading>
          <strong data-testid="total-players-value">
            {playersLoading ? '...' : players.length}
          </strong>
        </div>
      </section>

      <div className={styles.flexRow} data-testid="dashboard-content">
        <div
          className={styles.panel}
          style={{ flex: '2 1 520px' }}
          data-testid="characters-section"
        >
          <Heading
            level="h3"
            className={styles.sectionTitle}
            data-testid="characters-title"
          >
            {t('dashboard.characters')}
          </Heading>
          <CharacterList
            selectedId={selectedId}
            onSelect={setSelectedId}
            data-testid="character-list"
          />
          <div className={styles.actionsRow} data-testid="character-actions">
            <Button
              onClick={() => navigate('/battle')}
              ariaLabel={t('dashboard.startBattle')}
              data-testid="start-battle-button"
            >
              {t('dashboard.startBattle')}
            </Button>
          </div>
        </div>

        <div className={styles.panel} data-testid="top-players-section">
          <Heading
            level="h3"
            className={styles.sectionTitle}
            data-testid="top-players-title"
          >
            Top 5 {t('ladder.player')}
          </Heading>
          <ul className={styles.topPlayersList} data-testid="top-players-list">
            {topPlayers.map((p, i) => (
              <li key={p.id} data-testid={`top-player-${i}`}>
                <span className="name" data-testid={`player-name-${i}`}>
                  {i + 1}. {p.name || 'Jugador'}
                </span>
                <span
                  className={styles.badge}
                  data-testid={`player-level-${i}`}
                >
                  Lv {p.level}
                </span>
              </li>
            ))}
            {topPlayers.length === 0 && (
              <li style={{ opacity: 0.6 }} data-testid="no-players-message">
                {playersLoading ? 'Cargando...' : 'Sin jugadores aún'}
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};
