import React from 'react';
import styles from './CharacterList.module.css';
import charactersData from '../../../data/characters.json';
import CharacterCard, { Character } from '../../molecules/CharacterCard/CharacterCard';
import { usePlayer } from '../../../context/PlayerContext';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const ABSORBED_NAMES = new Set(['Zeta', 'Joaco', 'Emily']);

export default function CharacterList({ selectedId, onSelect }: Props) {
  const { state } = usePlayer();
  const characters: Character[] = charactersData as Character[];

  // Only show active characters (filter out those in absorbed list)
  const active = characters.filter((c) => !ABSORBED_NAMES.has(c.name));

  return (
    <div className={styles.list} role="list">
      {active.map((c) => (
        <div key={c.id} role="listitem" className={styles.item}>
          <CharacterCard character={c} selected={selectedId === c.id} onSelect={onSelect} />
        </div>
      ))}
    </div>
  );
}
