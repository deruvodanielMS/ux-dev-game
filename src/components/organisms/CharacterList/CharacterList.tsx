import { useEffect, useMemo, useState } from 'react';

import type { CharacterListProps } from '@/types/components-character-list';
import type { Player } from '@/types/player';

import { CharacterCard } from '@/components/molecules/CharacterCard/CharacterCard';

import { usePlayers } from '@/hooks/usePlayers';
import { sortPlayers } from '@/services/players';

import styles from './CharacterList.module.css';

export const CharacterList = ({ selectedId, onSelect }: CharacterListProps) => {
  const { players, loading, error, refresh } = usePlayers();
  // (notify not needed after refactor) keep hook call if future toasts desired
  const [local, setLocal] = useState<Player[]>([]);

  // sync players into local sorted copy
  useEffect(() => {
    setLocal(sortPlayers(players));
  }, [players]);

  // optional auto refresh if list empty
  useEffect(() => {
    if (players.length === 0) void refresh();
  }, [players.length, refresh]);

  const active = useMemo(
    () =>
      local.map((p) => ({
        id: p.id,
        name: p.name,
        level: p.level,
        stats: p.stats,
        avatarUrl: p.avatarUrl || undefined,
      })),
    [local],
  );

  if (loading)
    return (
      <div className={styles.list} data-testid="character-list-loading">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className={styles.item}
            data-testid={`character-loading-item-${i}`}
          >
            <div className={styles.skelRow}>
              <div className={styles.skelAvatar} />
              <div className={styles.skelText} />
            </div>
          </div>
        ))}
      </div>
    );
  if (error) {
    return (
      <div className={styles.list} data-testid="character-list-error">
        {error}
      </div>
    );
  }
  if (active.length === 0)
    return (
      <div className={styles.list} data-testid="character-list-empty">
        No hay jugadores disponibles.
      </div>
    );

  return (
    <div className={styles.list} role="list" data-testid="character-list">
      {active.map((c, index) => (
        <div
          key={c.id}
          className={styles.item}
          data-testid={`character-item-${index}`}
        >
          <CharacterCard
            character={c}
            selected={selectedId === c.id}
            interactive={true}
            onSelect={onSelect}
          />
        </div>
      ))}
    </div>
  );
};
