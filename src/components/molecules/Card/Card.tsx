import React from 'react';
import styles from './Card.module.css';

const CARD_INFO: Record<string, { title: string; desc: string }>= {
  'code-review': { title: 'Code Review', desc: 'Recupera HP revisando PRs.' },
  'bug-fix': { title: 'Bug Fix', desc: 'Arregla un bug: daño directo.' },
  'refactor': { title: 'Refactor', desc: 'Mejora el código y causa daño estable.' },
};

export default function Card({ id, onPlay }: { id: string; onPlay: () => void }){
  const info = CARD_INFO[id] ?? { title: id, desc: '' };
  return (
    <button className={styles.card} onClick={onPlay} aria-label={`Jugar ${info.title}`}>
      <div className={styles.title}>{info.title}</div>
      <div className={styles.desc}>{info.desc}</div>
    </button>
  );
}
