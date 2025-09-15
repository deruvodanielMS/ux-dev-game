import { useState } from 'react';

import {
  BattleCardInfo,
  BattleCardProps,
} from '../../../types/components-card';

import styles from './Card.module.css';

const CARD_INFO: Record<string, BattleCardInfo> = {
  'code-review': { title: 'Code Review', desc: 'Recupera HP revisando PRs.' },
  'bug-fix': { title: 'Bug Fix', desc: 'Arregla un bug: daño directo.' },
  refactor: {
    title: 'Refactor',
    desc: 'Mejora el código y causa daño estable.',
  },
};

export const Card = ({ id, onPlay }: BattleCardProps) => {
  const info = CARD_INFO[id] ?? { title: id, desc: '' };
  const [anim, setAnim] = useState(false);

  const handleClick = () => {
    setAnim(true);
    setTimeout(() => {
      onPlay();
      setAnim(false);
    }, 180);
  };

  return (
    <button
      className={`${styles.card} ${anim ? styles.anim : ''}`}
      onClick={handleClick}
      aria-label={`Jugar ${info.title}`}
    >
      <div className={styles.title}>{info.title}</div>
      <div className={styles.desc}>{info.desc}</div>
    </button>
  );
};
