import { useEffect } from 'react';

import { DamageNumberProps } from '../../../types/components-damage-number';

import styles from './DamageNumber.module.css';

export const DamageNumber = ({
  id,
  value,
  onDone,
  top = 0,
  left = 0,
}: DamageNumberProps) => {
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 900);
    return () => clearTimeout(t);
  }, [id, onDone]);

  return (
    <div className={styles.damage} style={{ top, left }}>
      {value}
    </div>
  );
};
