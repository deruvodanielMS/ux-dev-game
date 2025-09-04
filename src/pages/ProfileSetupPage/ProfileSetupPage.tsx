import React from 'react';
import styles from './ProfileSetupPage.module.css';
import AvatarUploader from '../../components/molecules/AvatarUploader/AvatarUploader';
import StatDisplay from '../../components/molecules/StatDisplay/StatDisplay';
import { usePlayer } from '../../context/PlayerContext';
import Button from '../../components/atoms/Button/Button';
import { useNavigate } from 'react-router-dom';
import supabase from '../../services/supabase';
import { useToast } from '../../context/ToastContext';
import { updatePlayerProfile } from '../../services/players';

export default function ProfileSetupPage(){
  const { state, dispatch } = usePlayer();
  const navigate = useNavigate();
  const [userId, setUserId] = React.useState<string | null>(null);

  React.useEffect(() => {
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
  }, []);

  const handleUploadSuccess = (url: string) => {
    // optionally update UI
    dispatch({ type: 'SET_AVATAR', payload: url });
  };

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
          <label className={styles.label} htmlFor="email">Email</label>
          <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} className={styles.input} placeholder="Tu email" />
        </div>

        <div className={styles.row}>
          <label className={styles.label}>Identidad Digital</label>
          <AvatarUploader userId={userId ?? undefined} initialAvatar={state.avatarUrl ?? null} initialLevel={state.level} onUploadSuccess={handleUploadSuccess} />
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
