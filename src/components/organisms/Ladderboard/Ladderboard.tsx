import React from 'react';
import styles from './Ladderboard.module.css';
import { usePlayers } from '../../../hooks/usePlayers';

type Props = { className?: string };

export function Ladderboard({ className }: Props){
  const { ladder, loading, error } = usePlayers();

  return (
    <section className={`${styles.board} ${className ?? ''}`} aria-label="Ranking Semanal">
      <header className={styles.headerRow}>
        <h2 className={styles.title}>Ranking Semanal</h2>
      </header>

      {loading && <div className={styles.state}>Cargando...</div>}
      {error && !loading && <div className={styles.state}>No se pudo cargar el ranking.</div>}

      {!loading && !error && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Nivel</th>
                <th>Coins</th>
              </tr>
            </thead>
            <tbody>
              {ladder.map((p, idx) => (
                <tr key={p.id} className={`${styles.row} ${idx === 0 ? styles.topRow : ''}`}>
                  <td className={styles.rank}>{idx + 1}</td>
                  <td>
                    <div className={styles.playerBox}>
                      <div className={styles.avatarWrap}>
                        {p.avatarUrl ? (
                          <img className={styles.avatar} src={p.avatarUrl} alt={`Avatar de ${p.name}`} />
                        ) : (
                          <div className={styles.placeholder}>{p.name.slice(0,2).toUpperCase()}</div>
                        )}
                      </div>
                      <div className={styles.identity}>
                        <div className={styles.name}>{p.name}</div>
                        <div className={styles.meta}>Nivel {p.level} • {p.exp} EXP</div>
                      </div>
                    </div>
                  </td>
                  <td className={styles.levelBox}>Nivel {p.level}</td>
                  <td className={styles.coinsBox}><span className={styles.coinIcon}>◈</span><span className={styles.coins}>{p.coins}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Ladderboard;
