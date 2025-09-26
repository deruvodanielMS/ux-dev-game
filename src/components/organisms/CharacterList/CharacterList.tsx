import { useCallback, useEffect, useState } from 'react';

import type { CharacterListProps } from '@/types/components-character-list';

import { Button } from '@/components/atoms/Button/Button';
import { CharacterCard } from '@/components/molecules/CharacterCard/CharacterCard';

import { useGame } from '@/context/GameContext';
import { useToast } from '@/context/ToastContext';
import { getCharacters } from '@/services/characters';

import styles from './CharacterList.module.css';

import type { Character } from '@/types';

const ABSORBED_NAMES = new Set(['Zeta', 'Joaco', 'Emily']);

export const CharacterList = ({ selectedId, onSelect }: CharacterListProps) => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getCharacters();
      setCharacters(list);
    } catch (err: unknown) {
      const error = err as Error;
      console.warn('Error loading characters', error);
      setError(error?.message ?? 'Error cargando personajes');
      setCharacters([]);
      notify({
        title: 'Error',
        message: error?.message ?? 'Error cargando personajes',
        level: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [notify]);

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

  const { state } = useGame();

  // If user is logged in, restrict list to their own characters only
  let visible = characters;
  if (state.isLoggedIn && state.player?.id) {
    visible = characters.filter((c) => c.id === state.player?.id);
  }

  const active = visible
    .filter((c) => !ABSORBED_NAMES.has(c.name))
    .sort((a, b) => (b.level ?? 0) - (a.level ?? 0));

  if (loading)
    return (
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
  if (active.length === 0)
    return <div className={styles.list}>No hay personajes disponibles.</div>;

  return (
    <div className={styles.list} role="list">
      {active.map((c) => (
        <Button
          key={c.id}
          variant="plain"
          className={styles.item}
          onClick={() => onSelect?.(c.id)}
          ariaLabel={`Seleccionar ${c.name}`}
        >
          <CharacterCard character={c} selected={selectedId === c.id} />
        </Button>
      ))}
    </div>
  );
};
