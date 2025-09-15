import type { TurnIndicatorProps } from '@/types/components-turn-indicator';

import styles from './TurnIndicator.module.css';

export const TurnIndicator = ({ turn }: TurnIndicatorProps) => {
  return (
    <div className={styles.indicator} data-turn={turn}>
      {turn === 'player' ? 'Tu turno' : 'Turno enemigo'}
    </div>
  );
};
