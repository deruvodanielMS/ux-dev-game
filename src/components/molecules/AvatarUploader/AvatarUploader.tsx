import React, { useState, ChangeEvent, useEffect } from 'react';
import styles from './AvatarUploader.module.css';
import Button from '../../atoms/Button/Button';
import { uploadAvatar } from '../../../services/avatars';
import { updatePlayerAvatar } from '../../../services/players';
import { useToast } from '../../../context/ToastContext';
import supabase from '../../../services/supabase';
import Skeleton from '../../atoms/Skeleton/Skeleton';

type Props = {
  userId?: string;
  onUploadSuccess?: (avatarUrl: string) => void;
};

export default function AvatarUploader({ userId: userIdProp, onUploadSuccess }: Props){
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();
  const [userId, setUserId] = useState<string | undefined>(userIdProp);
  const [resolvingUser, setResolvingUser] = useState(false);

  useEffect(() => {
    if (userIdProp) setUserId(userIdProp);
    else {
      (async () => {
        try {
          if (!supabase) return;
          const { data } = await supabase.auth.getUser();
          const u = data?.user ?? null;
          if (u) setUserId(u.id);
        } catch (e) {
          // ignore
        }
      })();
    }
  }, [userIdProp]);

  function onFileChange(e: ChangeEvent<HTMLInputElement>){
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  async function onConfirm(){
    if (!file){
      notify({ message: 'Selecciona una imagen antes de confirmar.', level: 'warning' });
      return;
    }
    if (!userId){
      notify({ message: 'Usuario no identificado.', level: 'danger' });
      return;
    }

    setLoading(true);
    try {
      const avatarUrl = await uploadAvatar(file, userId);
      // update players table and local storage
      await updatePlayerAvatar(userId, avatarUrl);
      notify({ message: 'Avatar subido correctamente.', level: 'success' });
      onUploadSuccess?.(avatarUrl);
    } catch (err: any) {
      notify({ message: err?.message || 'Error subiendo avatar.', level: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.uploader}>
      <div className={styles.left}>
        <div className={styles.hint}>Sube tu avatar</div>
        <div className={styles.preview} aria-hidden>
          {preview ? <img src={preview} alt="avatar preview" /> : <div className={styles.placeholder}>Sin avatar</div>}
        </div>
      </div>

      <div className={styles.controls}>
        <input type="file" accept="image/*" id="avatarFile" onChange={onFileChange} className={styles.fileInput} />
        <label htmlFor="avatarFile" className={styles.choose}>Elegir imagen</label>
        <Button onClick={onConfirm} ariaLabel="Confirmar avatar">{loading ? 'Subiendo...' : 'Confirmar'}</Button>
      </div>
    </div>
  );
}
