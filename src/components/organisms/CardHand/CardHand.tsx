import React from 'react';

import type { CardHandProps } from '../../../types/components/card-hand';

import { Card } from '../../molecules/Card/Card';

import styles from './CardHand.module.css';

export const CardHand: React.FC<CardHandProps> = ({ cards, onPlay }) => (
  <div className={styles.hand}>
    {cards.map((c) => (
      <Card key={c} id={c} onPlay={() => onPlay(c)} />
    ))}
  </div>
);
