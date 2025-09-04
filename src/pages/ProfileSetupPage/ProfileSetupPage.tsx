import React from 'react';
import styles from './ProfileSetupPage.module.css';
import AvatarUploader from '../../components/molecules/AvatarUploader/AvatarUploader';
import { usePlayer } from '../../context/PlayerContext';
import Button from '../../components/atoms/Button/Button';
import { useNavigate } from 'react-router-dom';

export default function ProfileSetupPage(){
  const { state, dispatch } = usePlayer();
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <h2 className={styles.title}>Configuración de Perfil</h2>
        <p className={styles.subtitle}>Sube tu avatar para comenzar a ganar reputación en código.</p>

        <div className={styles.row}>
          <label className={styles.label}>Nombre</label>
          <input value={state.playerName} onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })} className={styles.input} />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Avatar</label>
          <AvatarUploader />
        </div>

        <div className={styles.actions}>
          <Button onClick={() => navigate('/battle')} ariaLabel="Ir a batalla">Ir a batalla</Button>
        </div>
      </main>
    </div>
  );
}
