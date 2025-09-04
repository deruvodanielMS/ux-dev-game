import React from 'react';
import styles from './StatDisplay.module.css';
import { Stats } from '../../../context/PlayerContext';

export default function StatDisplay({ stats }: { stats: Stats }){
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
}
