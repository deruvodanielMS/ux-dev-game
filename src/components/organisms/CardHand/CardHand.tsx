import React from 'react';
import styles from './CardHand.module.css';
import Card from '../../molecules/Card/Card';

export default function CardHand({ cards, onPlay }: { cards: string[]; onPlay: (id: string) => void }){
  return (
    <div className={styles.hand}>
      {cards.map((c) => (
        <Card key={c} id={c} onPlay={() => onPlay(c)} />
      ))}
    </div>
  );
}
