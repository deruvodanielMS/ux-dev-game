import { PlayerCardProps } from '../../../types/components-player-card';

import { StatusBar } from '../../atoms/StatusBar/StatusBar';

import styles from './PlayerCard.module.css';

export const PlayerCard = ({
  name,
  avatarUrl,
  level = 1,
  health = 100,
  stamina = 100,
  isActive = false,
  variant = 'player',
}: PlayerCardProps) => {
  return (
    <div
      className={`${styles.card} ${isActive ? styles.active : ''} ${variant === 'enemy' ? styles.enemy : ''}`}
    >
      <div className={styles.top}>
        <div className={styles.avatar}>
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${name} avatar`} />
          ) : (
            <div className={styles.placeholder}>
              {name
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')
                .toUpperCase()}
            </div>
          )}
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
};
