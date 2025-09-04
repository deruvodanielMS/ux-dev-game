import React from 'react';
import styles from './CharacterCard.module.css';

export type Character = {
  id: string;
  name: string;
  level?: number;
  stats?: Record<string, number>;
};

type Props = {
  character: Character;
  selected?: boolean;
  onSelect?: (id: string) => void;
};

export default function CharacterCard({ character, selected = false, onSelect }: Props) {
  const initials = character.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''}`}
      onClick={() => onSelect && onSelect(character.id)}
      aria-pressed={selected}
    >
      <div className={styles.avatar} aria-hidden>
        {initials}
      </div>
      <div className={styles.info}>
        <div className={styles.name}>{character.name}</div>
        <div className={styles.meta}>Nivel {character.level ?? 1}</div>
      </div>
    </button>
  );
}
