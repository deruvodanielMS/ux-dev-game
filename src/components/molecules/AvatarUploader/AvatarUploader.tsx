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
    notify({ message: 'Iniciando subida...', level: 'info', duration: 2000 });
    try {
      const avatarUrl = await uploadAvatar(file, userId);
      // update players table and local storage
      try {
        await updatePlayerAvatar(userId, avatarUrl);
      } catch (dbErr: any) {
        // surface db errors as actionable toasts
        const msg = dbErr?.message ?? String(dbErr);
        if (msg.toLowerCase().includes('row-level')) {
          notify({ title: 'Permisos insuficientes', message: 'No se pudo actualizar la base de datos por las políticas RLS. Contacta al administrador o revisa auth_uid en la tabla.', level: 'danger', duration: 8000 });
        } else {
          notify({ message: msg, level: 'danger', duration: 6000 });
        }
        // still call onUploadSuccess with url so UI can reflect uploaded image if needed
        onUploadSuccess?.(avatarUrl);
        setLoading(false);
        return;
      }

      notify({ message: 'Avatar subido y guardado correctamente.', level: 'success' });
      onUploadSuccess?.(avatarUrl);
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      if (msg.toLowerCase().includes('row-level') || msg.toLowerCase().includes('unauthorized')) {
        notify({ title: 'Error de permisos', message: 'No autorizado: la subida o actualización fue bloqueada por las políticas del servidor (RLS). Revisa auth_uid o ajusta políticas.', level: 'danger', duration: 8000 });
      } else {
        notify({ message: msg || 'Error subiendo avatar.', level: 'danger' });
      }
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
