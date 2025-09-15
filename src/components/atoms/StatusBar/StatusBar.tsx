import { StatusBarProps } from '../../../types';

import styles from './StatusBar.module.css';

export const StatusBar = ({
  label,
  value,
  max = 100,
  color = 'green',
}: StatusBarProps) => {
  const pct = Math.max(0, Math.min(100, Math.round((value / max) * 100)));
  return (
    <div className={styles.wrapper} aria-hidden>
      {label && <div className={styles.label}>{label}</div>}
      <div className={styles.track}>
        <div
          className={`${styles.fill} ${styles[color]}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
