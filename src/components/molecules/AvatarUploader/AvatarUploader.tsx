import React, { useState, ChangeEvent } from 'react';
import styles from './AvatarUploader.module.css';
import Button from '../../atoms/Button/Button';
import { usePlayer } from '../../../context/PlayerContext';

export default function AvatarUploader(){
  const { state, dispatch } = usePlayer();
  const [preview, setPreview] = useState<string | null>(state.avatarUrl);
  const [file, setFile] = useState<File | null>(null);

  function onFileChange(e: ChangeEvent<HTMLInputElement>){
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFile(f);
    const url = URL.createObjectURL(f);
    setPreview(url);
  }

  function onConfirm(){
    if (preview) dispatch({ type: 'SET_AVATAR', payload: preview });
    alert('Avatar guardado en estado local. (Simulado)');
  }

  return (
    <div className={styles.uploader}>
      <div className={styles.preview} aria-hidden>
        {preview ? <img src={preview} alt="avatar preview" /> : <div className={styles.placeholder}>Sin avatar</div>}
      </div>

      <div className={styles.controls}>
        <input type="file" accept="image/*" id="avatarFile" onChange={onFileChange} className={styles.fileInput} />
        <label htmlFor="avatarFile" className={styles.choose}>Elegir imagen</label>
        <Button onClick={onConfirm} ariaLabel="Confirmar avatar">Confirmar</Button>
      </div>
    </div>
  );
}
