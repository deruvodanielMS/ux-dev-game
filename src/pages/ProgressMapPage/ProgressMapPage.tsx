import React from 'react';
import styles from './ProgressMapPage.module.css';
import enemies from '../../data/enemies.json';
import { usePlayer } from '../../context/PlayerContext';

export default function ProgressMapPage(){
  const { state } = usePlayer();
  const defeated = state.defeatedEnemies || [];

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <h1 className={styles.title}>Mapa de Progreso</h1>
        <p className={styles.subtitle}>Tu camino contra las tecnologías corrompidas. Derrota a los enemigos para avanzar.</p>

        <div className={styles.map}>
          { (enemies as any[]).map((e) => {
            const done = defeated.includes(e.id);
            return (
              <div key={e.id} className={`${styles.node} ${done ? styles.done : ''}`}>
                <div className={styles.nodeContent}>
                  <div className={styles.avatar}>
                    {e.avatar_url ? <img src={e.avatar_url} alt={e.name} /> : <div className={styles.placeholder}>?</div>}
                  </div>
                  <div className={styles.name}>{e.name}</div>
                  {done && <div className={styles.check}>✔</div>}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.summary}>
          <div>Derrotados: {defeated.length} / {(enemies as any[]).length}</div>
        </div>
      </main>
    </div>
  );
}
