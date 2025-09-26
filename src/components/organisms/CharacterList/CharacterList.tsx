import { useCallback, useEffect, useState } from 'react';

import type { CharacterListProps } from '@/types/components-character-list';
import type { Player } from '@/types/player';

import { Button } from '@/components/atoms/Button/Button';
import { CharacterCard } from '@/components/molecules/CharacterCard/CharacterCard';

import { useToast } from '@/context/ToastContext';
import { fetchPlayers, sortPlayers } from '@/services/players';

import styles from './CharacterList.module.css';

export const CharacterList = ({ selectedId, onSelect }: CharacterListProps) => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await fetchPlayers();
      const sorted = sortPlayers(list);
      setPlayers(sorted);
    } catch (err: unknown) {
      const e = err as Error;
      console.warn('Error loading players', e);
      setError(e?.message ?? 'Error cargando jugadores');
      setPlayers([]);
      notify({
        title: 'Error',
        message: e?.message ?? 'Error cargando jugadores',
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

  const active = players.map((p) => ({
    id: p.id,
    name: p.name,
    level: p.level,
    stats: p.stats,
    avatarUrl: p.avatarUrl || undefined,
  }));

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
    return <div className={styles.list}>No hay jugadores disponibles.</div>;

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
