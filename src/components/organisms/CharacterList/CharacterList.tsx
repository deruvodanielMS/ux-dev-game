import React, { useEffect, useState } from 'react';
import styles from './CharacterList.module.css';
import CharacterCard, { Character } from '../../molecules/CharacterCard/CharacterCard';
import { fetchCharacters } from '../../../services/characters';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const ABSORBED_NAMES = new Set(['Zeta', 'Joaco', 'Emily']);

export default function CharacterList({ selectedId, onSelect }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const list = await fetchCharacters();
        if (!mounted) return;
        setCharacters(list);
      } catch (err: any) {
        console.warn('Error loading characters', err);
        if (!mounted) return;
        setError(err?.message ?? 'Error cargando personajes');
        setCharacters([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const active = characters.filter((c) => !ABSORBED_NAMES.has(c.name));

  if (loading) return <div className={styles.list}>Cargando personajes...</div>;
  if (error) return <div className={styles.list}>{error}</div>;
  if (active.length === 0) return <div className={styles.list}>No hay personajes disponibles.</div>;

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
