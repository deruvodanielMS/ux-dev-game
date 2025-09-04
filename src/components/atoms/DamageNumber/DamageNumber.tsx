import React, { useEffect } from 'react';
import styles from './DamageNumber.module.css';

export default function DamageNumber({ id, value, onDone, top = 0, left = 0 }: { id: string; value: number; onDone: (id: string) => void; top?: number; left?: number }){
  useEffect(() => {
    const t = setTimeout(() => onDone(id), 900);
    return () => clearTimeout(t);
  }, [id, onDone]);

  return (
    <div className={styles.damage} style={{ top, left }}>
      {value}
    </div>
  );
}
