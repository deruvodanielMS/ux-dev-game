import styles from './StatusBar.module.css';

import type { StatusBarProps } from '@/types';

export const StatusBar = ({
  label,
  current,
  max,
  color = 'var(--green)',
  className = '',
}: StatusBarProps) => {
  const percentage = (current / max) * 100;
  return (
    <div className={[styles.wrapper, className].join(' ')}>
      <div className={styles.top}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>
          {current} / {max}
        </span>
      </div>
      <div className={styles.outer}>
        <div
          className={styles.inner}
          style={{ width: `${percentage}%`, background: color }}
        />
      </div>
    </div>
  );
};
