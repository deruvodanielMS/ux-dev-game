import React from 'react';

import type { LevelNodeProps } from '@/types/components-progress-map';

import styles from './LevelNode.module.css';

export const LevelNode: React.FC<LevelNodeProps> = ({
  id,
  index,
  label,
  stars,
  state,
  onClick,
}) => {
  const starIcons = Array.from({ length: 3 }, (_, i) => (
    <span
      key={i}
      className={`${styles.star} ${i < stars ? styles.filled : ''}`}
      aria-hidden
    >
      ★
    </span>
  ));

  return (
    <button
      type="button"
      data-id={id}
      className={`${styles.node} ${styles[state]}`}
      disabled={state === 'locked'}
      onClick={() => state !== 'locked' && onClick?.(id)}
      aria-label={`${label} ${state}`}
    >
      <div className={styles.inner}>
        <div className={styles.badge}>{index + 1}</div>
        <div className={styles.label}>{label}</div>
        <div className={styles.stars} aria-label={`${stars} estrellas`}>
          {starIcons}
        </div>
        {state === 'current' && <div className={styles.pulse} aria-hidden />}
      </div>
    </button>
  );
};
