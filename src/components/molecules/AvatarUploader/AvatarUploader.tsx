import React, { ChangeEvent, useEffect, useState } from 'react';
import styles from './AvatarUploader.module.css';
import { uploadAvatar, resolveAvatarUrl } from '../../../services/avatars';
import { useToast } from '../../../context/ToastContext';
import supabase from '../../../services/supabase';
import Skeleton from '../../atoms/Skeleton/Skeleton';
import { usePlayer } from '../../../context/PlayerContext';

type Props = {
  userId?: string;
  onUploadSuccess?: (avatarUrl: string, storagePath?: string) => void;
  initialAvatar?: string | null;
  initialLevel?: number | null;
};

export default function AvatarUploader({ userId: userIdProp, onUploadSuccess, initialAvatar, initialLevel }: Props){
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { notify } = useToast();
  const [userId, setUserId] = useState<string | undefined>(userIdProp);
  const { dispatch } = usePlayer();

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
    const url = URL.createObjectURL(f);
    setPreview(url);
    // auto-upload selected file
    uploadFile(f);
  }

  async function uploadFile(file: File){
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
      // upload returns storage path; resolve signed url for display
      const storagePath = await uploadAvatar(file, userId);
      let displayUrl = storagePath;
      try {
        const resolved = await resolveAvatarUrl(storagePath);
        if (resolved) displayUrl = resolved;
      } catch (e) {
        // ignore - fallback to storagePath
      }

      // optimistically update UI/context with signed URL
      dispatch({ type: 'SET_AVATAR', payload: displayUrl });
      setPreview(displayUrl);

      // Inform parent about uploaded storage path so it can persist to DB on Save
      onUploadSuccess?.(displayUrl, storagePath);
      notify({ message: 'Avatar subido (pendiente de guardar).', level: 'success' });
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
          {loading ? (
            <Skeleton width={120} height={120} className={styles.skel} />
          ) : preview ? (
            <>
              <img src={preview} alt="avatar preview" />
              {initialLevel && <div className={styles.levelBadge}>Lv {initialLevel}</div>}
            </>
          ) : initialAvatar ? (
            <>
              <img src={initialAvatar} alt="avatar current" />
              {initialLevel && <div className={styles.levelBadge}>Lv {initialLevel}</div>}
            </>
          ) : (
            <div className={styles.placeholder}>Sin avatar</div>
          )}
        </div>
      </div>

      <div className={styles.controls}>
        <input disabled={loading} type="file" accept="image/*" id="avatarFile" onChange={onFileChange} className={styles.fileInput} />
        <label htmlFor="avatarFile" className={styles.choose}>{loading ? 'Cargando...' : 'Elegir imagen'}</label>
      </div>
    </div>
  );
}
