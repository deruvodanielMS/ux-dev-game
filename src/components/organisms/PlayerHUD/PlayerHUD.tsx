import React from 'react';
import styles from './PlayerHUD.module.css';

export default function PlayerHUD({ name, avatarUrl, health }: { name: string; avatarUrl?: string | null; health: number }){
  return (
    <div className={styles.hud}>
      <div className={styles.top}>
        <div className={styles.avatar}>
          {avatarUrl ? <img src={avatarUrl} alt={`${name} avatar`} /> : <div className={styles.placeholder}>{name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.health}>HP: {health}</div>
        </div>
      </div>
    </div>
  );
}
