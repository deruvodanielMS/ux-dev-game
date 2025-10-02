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
    <div className={styles.page}>
      <header className={styles.headerRow}>
        <div>
          <Heading level="h1" style={{ margin: 0 }}>
            {t('dashboard.title')}
          </Heading>
          <Text style={{ margin: '0.25rem 0 0', opacity: 0.75 }}>
            {t('dashboard.subtitle')}
          </Text>
        </div>
        <div className={styles.actionsRow}>
          <Button onClick={() => navigate('/battle')}>{t('nav.battle')}</Button>
          <Button onClick={() => navigate('/progress')}>
            {t('nav.progress')}
          </Button>
          <Button onClick={() => navigate('/ladder')}>{t('nav.ladder')}</Button>
          <Button onClick={() => navigate('/profile')}>
            {t('nav.profile')}
          </Button>
        </div>
      </header>

      <section className={styles.kpiGrid}>
        <div className={styles.card}>
          <Heading level="h4">{t('dashboard.level')}</Heading>
          <strong>{level}</strong>
        </div>
        <div className={styles.card}>
          <Heading level="h4">{t('dashboard.experience')}</Heading>
          <strong>{experience}</strong>
        </div>
        <div className={styles.card}>
          <Heading level="h4">{t('dashboard.enemiesDefeated')}</Heading>
          <strong>{totalDefeated}</strong>
        </div>
        <div className={styles.card}>
          <Heading level="h4">{t('dashboard.totalPlayers')}</Heading>
          <strong>{playersLoading ? '...' : players.length}</strong>
        </div>
      </section>

      <div className={styles.flexRow}>
        <div className={styles.panel} style={{ flex: '2 1 520px' }}>
          <Heading level="h3" className={styles.sectionTitle}>
            {t('dashboard.characters')}
          </Heading>
          <CharacterList selectedId={selectedId} onSelect={setSelectedId} />
          <div className={styles.actionsRow}>
            <Button
              onClick={() => navigate('/battle')}
              ariaLabel={t('dashboard.startBattle')}
            >
              {t('dashboard.startBattle')}
            </Button>
          </div>
        </div>

        <div className={styles.panel}>
          <Heading level="h3" className={styles.sectionTitle}>
            Top 5 {t('ladder.player')}
          </Heading>
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
