import React, { useState, ChangeEvent } from 'react';
import styles from './AvatarUploader.module.css';
import Button from '../../atoms/Button/Button';
import { usePlayer } from '../../../context/PlayerContext';
import { uploadAvatar } from '../../../services/avatars';
import { updatePlayerAvatar } from '../../../services/players';
import { useToast } from '../../../context/ToastContext';

export default function AvatarUploader(){
  const { state, dispatch } = usePlayer();
  const [preview, setPreview] = useState<string | null>(state.avatarUrl);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();

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

    setLoading(true);
    try {
      const userId = state.playerName?.trim() || 'guest';
      const avatarUrl = await uploadAvatar(file, userId);
      // update local state
      dispatch({ type: 'SET_AVATAR', payload: avatarUrl });
      // update players storage / supabase
      await updatePlayerAvatar(userId, avatarUrl);
      notify({ message: 'Avatar subido correctamente.', level: 'success' });
    } catch (err: any) {
      notify({ message: err?.message || 'Error subiendo avatar.', level: 'danger' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.uploader}>
      <div className={styles.left}>
        <div className={styles.hint}>Sube tu avatar (generado por IA)</div>
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
