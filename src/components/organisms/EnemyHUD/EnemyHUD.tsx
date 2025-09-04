import React from 'react';
import styles from './EnemyHUD.module.css';

export default function EnemyHUD({ name, avatarUrl, health }: { name: string; avatarUrl?: string | null; health: number }){
  return (
    <div className={styles.hud}>
      <div className={styles.top}>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.health}>HP: {health}</div>
        </div>
        <div className={styles.avatar}>
          {avatarUrl ? <img src={avatarUrl} alt={`${name} avatar`} /> : <div className={styles.placeholder}>EN</div>}
        </div>
      </div>
    </div>
  );
}
