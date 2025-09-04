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
  absorbed?: boolean;
};

export default function CharacterCard({ character, selected = false, onSelect, absorbed = false }: Props) {
  const initials = character.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <button
      type="button"
      className={`${styles.card} ${selected ? styles.selected : ''} ${absorbed ? styles.absorbed : ''}`}
      onClick={() => !absorbed && onSelect && onSelect(character.id)}
      aria-pressed={selected}
      aria-disabled={absorbed}
      disabled={absorbed}
    >
      <div className={styles.avatar} aria-hidden>
        <div className={styles.avatarInner}>{initials}</div>
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{character.name}</div>
        <div className={styles.meta}>Nivel {character.level ?? 1}</div>
      </div>
    </button>
  );
}
