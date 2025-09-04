import React, { ChangeEvent, useState } from 'react';
import styles from './CharacterCard.module.css';
import { uploadCharacterAvatar } from '../../../services/avatars';
import { updateCharacterAvatar } from '../../../services/characters';
import { useToast } from '../../../context/ToastContext';

export type Character = {
  id: string;
  name: string;
  level?: number;
  stats?: Record<string, number>;
  avatarUrl?: string;
};

type Props = {
  character: Character;
  selected?: boolean;
  onSelect?: (id: string) => void;
  absorbed?: boolean;
  onUploadSuccess?: (id: string, avatarUrl: string) => void;
};

export default function CharacterCard({ character, selected = false, onSelect, absorbed = false, onUploadSuccess }: Props) {
  const initials = character.name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

  async function onFileChange(e: ChangeEvent<HTMLInputElement>){
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setLoading(true);
    try {
      const url = await uploadCharacterAvatar(f, character.id);
      await updateCharacterAvatar(character.id, url);
      notify({ message: 'Imagen del personaje subida correctamente.', level: 'success' });
      onUploadSuccess?.(character.id, url);
    } catch (err: any) {
      notify({ message: err?.message || 'Error subiendo imagen del personaje.', level: 'danger' });
    } finally {
      setLoading(false);
    }
  }

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
        {character.avatarUrl ? (
          <img src={character.avatarUrl} alt={`${character.name} avatar`} className={styles.avatarImage} />
        ) : (
          <div className={styles.avatarInner}>{initials}</div>
        )}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{character.name}</div>
        <div className={styles.meta}>Nivel {character.level ?? 1}</div>

        <div className={styles.uploadControl}>
          <input type="file" accept="image/*" id={`char_upload_${character.id}`} onChange={onFileChange} className={styles.uploadInput} />
          <label htmlFor={`char_upload_${character.id}`} className={styles.uploadLabel}>
            {loading ? 'Subiendo...' : 'Subir imagen'}
          </label>
        </div>
      </div>
    </button>
  );
}
