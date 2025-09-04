import React from 'react';
import styles from './StatusBar.module.css';

type Props = {
  label?: string;
  value: number; // current value
  max?: number; // max value
  color?: 'green' | 'blue' | 'red' | 'orange';
};

export default function StatusBar({ label, value, max = 100, color = 'green' }: Props){
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className={styles.wrapper} aria-hidden>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.track}>
        <div className={`${styles.fill} ${styles[color]}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
