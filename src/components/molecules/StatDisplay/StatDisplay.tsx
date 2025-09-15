import { Stats } from '../../../types';
import { StatDisplayProps } from '../../../types/components-stat-display';

import styles from './StatDisplay.module.css';

export const StatDisplay = ({ stats }: StatDisplayProps) => {
  const entries = Object.entries(stats) as [keyof Stats, number][];
  return (
    <div className={styles.stats}>
      {entries.map(([k, v]) => (
        <div key={k} className={styles.row}>
          <div className={styles.key}>{k.replace('_', ' ')}</div>
          <div className={styles.value}>{v}</div>
        </div>
      ))}
    </div>
  );
};
