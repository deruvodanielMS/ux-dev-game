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
        <h1 className={styles.title}>Configura tu Identidad Digital</h1>
        <p className={styles.subtitle}>Tu identidad digital representa tu presencia en la red y tu reputación técnica. Sube un avatar para personalizarla.</p>

        <div className={styles.row}>
          <label className={styles.label} htmlFor="name">Nombre</label>
          <input id="name" value={state.playerName} onChange={(e) => dispatch({ type: 'SET_NAME', payload: e.target.value })} className={styles.input} placeholder="Tu nombre" />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Identidad Digital</label>
          <AvatarUploader />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Estadísticas iniciales</label>
          <div className={styles.statsWrap}>
            {/* StatDisplay molecule */}
            <StatDisplay stats={state.stats} />
          </div>
        </div>

        <div className={styles.actions}>
          <Button onClick={() => navigate('/battle')} ariaLabel="Guardar y Continuar">Guardar y Continuar</Button>
        </div>
      </main>
    </div>
  );
}
