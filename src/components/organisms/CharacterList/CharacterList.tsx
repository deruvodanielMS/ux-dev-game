import React, { useEffect, useState, useCallback } from 'react';
import styles from './CharacterList.module.css';
import CharacterCard, { Character } from '../../molecules/CharacterCard/CharacterCard';
import { fetchCharacters } from '../../../services/characters';
import { useToast } from '../../../context/ToastContext';

type Props = {
  selectedId: string | null;
  onSelect: (id: string) => void;
};

const ABSORBED_NAMES = new Set(['Zeta', 'Joaco', 'Emily']);

export default function CharacterList({ selectedId, onSelect }: Props) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchCharacters();
      setCharacters(list);
    } catch (err: any) {
      console.warn('Error loading characters', err);
      setError(err?.message ?? 'Error cargando personajes');
      setCharacters([]);
      notify({ title: 'Error', message: err?.message ?? 'Error cargando personajes', level: 'danger' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await load();
    })();
    return () => {
      mounted = false;
    };
  }, [load]);

  const active = characters.filter((c) => !ABSORBED_NAMES.has(c.name));

  async function handleUploadSuccess(id: string) {
    // refresh the list after an upload so the new avatar appears
    await load();
  }

  if (loading) return (
    <div className={styles.list}>
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className={styles.item}>
          <div className={styles.skelRow}>
            <div className={styles.skelAvatar} />
            <div className={styles.skelText} />
          </div>
        </div>
      ))}
    </div>
  );
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
