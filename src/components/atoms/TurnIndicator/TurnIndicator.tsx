import React from 'react';
import styles from './TurnIndicator.module.css';

export default function TurnIndicator({ turn }: { turn: 'player' | 'enemy' }){
  return (
    <div className={styles.indicator} data-turn={turn}>
      {turn === 'player' ? 'Tu turno' : 'Turno enemigo'}
    </div>
  );
}
