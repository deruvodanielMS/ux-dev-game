import { type ChangeEvent, useState } from 'react';

import type { AvatarUploaderProps } from '@/types/components-avatar-uploader';

import styles from './AvatarUploader.module.css';

export const AvatarUploader = ({
  onFileSelected,
  initialAvatar,
  initialLevel,
  onValidationError,
  onError,
  maxSizeMB = 2,
  acceptedTypes = ['image/png', 'image/jpeg', 'image/webp'],
}: AvatarUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  // dispatch ya no requerido para actualizar avatar inmediatamente

  // user id now derived from props or GameContext (Auth0 seeded)

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    // Validaciones
    try {
      if (f.size > maxSizeMB * 1024 * 1024) {
        const msg = `La imagen excede ${maxSizeMB}MB.`;
        onValidationError?.(msg);
        return;
      }
      if (acceptedTypes.length && !acceptedTypes.includes(f.type)) {
        const msg = 'Tipo de archivo no permitido.';
        onValidationError?.(msg);
        return;
      }
    } catch (err) {
      onError?.(err);
      return;
    }
    const url = URL.createObjectURL(f);
    setPreview(url);
    onFileSelected?.(f);
  };

  // Subida eliminada de este componente.

  return (
    <div className={styles.uploader}>
      <div className={styles.left}>
        <div className={styles.hint}>Sube tu avatar</div>
        <div className={styles.preview} aria-hidden>
          {preview ? (
            <>
              <img src={preview} alt="avatar preview" />
              {initialLevel && (
                <div className={styles.levelBadge}>Lv {initialLevel}</div>
              )}
            </>
          ) : initialAvatar ? (
            <>
              <img src={initialAvatar} alt="avatar current" />
              {initialLevel && (
                <div className={styles.levelBadge}>Lv {initialLevel}</div>
              )}
            </>
          ) : (
            <div className={styles.placeholder}>Sin avatar</div>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <input
          type="file"
          accept="image/*"
          id="avatarFile"
          onChange={onFileChange}
          className={styles.fileInput}
        />
        <label htmlFor="avatarFile" className={styles.choose}>
          Elegir imagen
        </label>
      </div>
    </div>
  );
};
