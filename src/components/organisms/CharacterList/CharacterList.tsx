import React, { useEffect, useState } from 'react';
import styles from './CharacterList.module.css';
import CharacterCard, { Character } from '../../molecules/CharacterCard/CharacterCard';
import { usePlayer } from '../../../context/PlayerContext';
import { fetchCharacters } from '../../../services/characters';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const ABSORBED_NAMES = new Set(['Zeta', 'Joaco', 'Emily']);

export default function CharacterList({ selectedId, onSelect }: Props) {
  const { state } = usePlayer();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const list = await fetchCharacters();
      if (!mounted) return;
      if (list.length === 0) {
        // fallback: try importing local JSON dynamically
        try {
          const mod = await import('../../../data/characters.json');
          setCharacters((mod as any).default ?? (mod as any));
        } catch (e) {
          setCharacters([]);
        }
      } else {
        setCharacters(list);
      }
      setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const active = characters.filter((c) => !ABSORBED_NAMES.has(c.name));

  if (loading) return <div className={styles.list}>Cargando personajes...</div>;

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
