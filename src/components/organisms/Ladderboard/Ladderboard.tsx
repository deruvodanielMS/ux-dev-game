import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import type { LadderboardProps } from '@/types/components/ladderboard';

import { Button } from '@/components/atoms/Button/Button';
import { Skeleton } from '@/components/atoms/Skeleton/Skeleton';

import { usePlayersContext } from '@/context/PlayersContext';
import { usePlayers } from '@/hooks/usePlayers';

import styles from './Ladderboard.module.css';

export const Ladderboard: React.FC<LadderboardProps> = ({ className }) => {
  const { ladder, loading, error } = usePlayers();
  const { syncing } = usePlayersContext();
  const navigate = useNavigate();

  // derive a compact stats summary (currently only battles_won, damage_dealt, damage_taken if present)
  const rows = useMemo(
    () =>
      ladder.map((p) => {
        const stats = p.stats || {};
        return {
          player: p,
          battles: stats.battles_won ?? 0,
          dmg: stats.damage_dealt ?? 0,
          taken: stats.damage_taken ?? 0,
          syncing: syncing(p.id),
        };
      }),
    [ladder, syncing],
  );

  return (
    <section
      className={`${styles.board} ${className ?? ''}`}
      aria-label="Ranking Semanal"
    >
      <header className={styles.headerRow}>
        <h2 className={styles.title}>Ranking Semanal</h2>
      </header>

      {loading && (
        <div className={styles.tableWrap} aria-busy>
          <table className={styles.table} aria-hidden>
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Nivel</th>
                <th>Stats</th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className={styles.row}>
                  <td className={styles.rank}>{i + 1}</td>
                  <td>
                    <div className={styles.playerBox}>
                      <div className={styles.avatarWrap}>
                        <Skeleton width={40} height={40} circle />
                      </div>
                      <div
                        className={styles.identity}
                        style={{ width: '100%' }}
                      >
                        <Skeleton width={120} height={16} />
                        <Skeleton width={80} height={12} />
                      </div>
                    </div>
                  </td>
                  <td className={styles.levelBox}>
                    <Skeleton width={60} height={14} />
                  </td>
                  <td>
                    <div className={styles.statsRow}>
                      <Skeleton width={50} height={12} />
                      <Skeleton width={50} height={12} />
                      <Skeleton width={50} height={12} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {error && !loading && (
        <div className={styles.state}>No se pudo cargar el ranking.</div>
      )}

      {!loading && !error && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Nivel</th>
                <th>Stats</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(
                ({ player: p, battles, dmg, taken, syncing: rowSync }, idx) => (
                  <tr
                    key={p.id}
                    className={`${styles.row} ${idx === 0 ? styles.topRow : ''} ${rowSync ? styles.syncing : ''}`}
                  >
                    <td className={styles.rank}>{idx + 1}</td>
                    <td>
                      <div className={styles.playerBox}>
                        <div className={styles.avatarWrap}>
                          {rowSync ? (
                            <Skeleton width={40} height={40} circle />
                          ) : p.avatarUrl ? (
                            <img
                              className={styles.avatar}
                              src={p.avatarUrl}
                              alt={`Avatar de ${p.name}`}
                            />
                          ) : (
                            <div className={styles.placeholder}>
                              {p.name.slice(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div className={styles.identity}>
                          <div className={styles.name}>{p.name}</div>
                          <div className={styles.meta}>Nivel {p.level}</div>
                        </div>
                      </div>
                    </td>
                    <td className={styles.levelBox}>
                      {rowSync ? (
                        <Skeleton width={50} height={14} />
                      ) : (
                        `Nivel ${p.level}`
                      )}
                    </td>
                    <td>
                      {rowSync ? (
                        <div className={styles.statsRow}>
                          <Skeleton width={50} height={12} />
                          <Skeleton width={50} height={12} />
                          <Skeleton width={50} height={12} />
                        </div>
                      ) : (
                        <div className={styles.statsRow}>
                          <div
                            className={styles.statItem}
                            title="Batallas ganadas"
                          >
                            <span className={styles.statLabel}>BW</span>
                            <span className={styles.statValue}>{battles}</span>
                          </div>
                          <div className={styles.statItem} title="Daño hecho">
                            <span className={styles.statLabel}>DH</span>
                            <span className={styles.statValue}>{dmg}</span>
                          </div>
                          <div
                            className={styles.statItem}
                            title="Daño recibido"
                          >
                            <span className={styles.statLabel}>DR</span>
                            <span className={styles.statValue}>{taken}</span>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>

          <Button onClick={() => navigate('/dashboard')}>
            Ir al Dashboard
          </Button>
        </div>
      )}
    </section>
  );
};
