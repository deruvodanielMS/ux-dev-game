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
        <ul className={styles.list}>
          {ladder.map((p, idx) => (
            <li key={p.id} className={`${styles.row} ${idx === 0 ? styles.topRow : ''}`}> 
              <div className={styles.rank}>{idx + 1}</div>

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

              <div className={styles.levelBox}>Nivel {p.level}</div>
              <div className={styles.coinsBox}>
                <span className={styles.coinIcon}>◈</span>
                <span className={styles.coins}>{p.coins}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Ladderboard;
