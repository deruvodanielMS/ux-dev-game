import React from 'react';
import styles from './PlayerCard.module.css';
import StatusBar from '../../atoms/StatusBar/StatusBar';

export default function PlayerCard({
  name,
  avatarUrl,
  level = 1,
  health = 100,
  stamina = 100,
  isActive = false,
  variant = 'player',
}: {
  name: string;
  avatarUrl?: string | null;
  level?: number;
  health?: number;
  stamina?: number;
  isActive?: boolean;
  variant?: 'player' | 'enemy';
}){
  return (
    <div className={`${styles.card} ${isActive ? styles.active : ''} ${variant === 'enemy' ? styles.enemy : ''}`}>
      <div className={styles.top}>
        <div className={styles.avatar}>
          {avatarUrl ? <img src={avatarUrl} alt={`${name} avatar`} /> : <div className={styles.placeholder}>{name.split(' ').map(n=>n[0]).slice(0,2).join('').toUpperCase()}</div>}
        </div>
        <div className={styles.info}>
          <div className={styles.name}>{name}</div>
          <div className={styles.level}>Nivel {level}</div>
        </div>
      </div>

      <div className={styles.bars}>
        <StatusBar label="Salud" value={health} color="green" />
        <StatusBar label="Stamina" value={stamina} color="blue" />
      </div>
    </div>
  );
}
