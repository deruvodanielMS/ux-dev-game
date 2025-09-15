import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Player, Stats } from '../../types';

import { Button } from '../../components/atoms/Button/Button';
import { AvatarUploader } from '../../components/molecules/AvatarUploader/AvatarUploader';
import { StatDisplay } from '../../components/molecules/StatDisplay/StatDisplay';

import { useGame } from '../../context/GameContext';
import { useToast } from '../../context/ToastContext';
import { savePlayer, updatePlayerProfile } from '../../services/players';
import { supabase } from '../../services/supabase';

import styles from './ProfileSetupPage.module.css';

export const ProfileSetupPage = () => {
  const { state: gameState, dispatch: gameDispatch } = useGame();
  const player = gameState.player;
  const navigate = useNavigate();
  const { notify } = useToast();
  const [userId, setUserId] = useState<string | null>(player?.id ?? null);
  const [email, setEmail] = useState<string>(player?.email ?? '');
  const [pendingAvatarPath, setPendingAvatarPath] = useState<string | null>(
    null,
  );

  useEffect(() => {
    setEmail(player?.email ?? '');
  }, [player?.email]);

  async function saveProfile() {
    try {
      if (!userId || !player) {
        notify({ message: 'Usuario no identificado.', level: 'danger' });
        return;
      }
      await updatePlayerProfile(userId, {
        name: player.name,
        email: email || null,
      });
      if (pendingAvatarPath) {
        try {
          await import('../../services/players').then((m) =>
            m.updatePlayerAvatar(userId!, pendingAvatarPath!),
          );
          setPendingAvatarPath(null);
        } catch (avatarErr: unknown) {
          const msg = (avatarErr as Error)?.message ?? String(avatarErr);
          notify({
            message: `No se pudo guardar el avatar: ${msg}`,
            level: 'warning',
          });
        }
      }
      gameDispatch({
        type: 'UPDATE_PLAYER_DATA',
        payload: { name: player.name || '', email: email || null },
      });
      try {
        const ladderPlayer: Player = {
          id: userId,
          name: player.name || email || userId || 'Player',
          avatarUrl: player.avatarUrl ?? null,
          level: player.level ?? 1,
          experience: player.experience ?? 0,
          characters: player.characters ?? [],
          inventory: player.inventory ?? { items: [], cards: [] },
          progress: player.progress ?? {
            currentLevelId: '1',
            completedLevels: [],
          },
          email: email || null,
        } as Player;
        await savePlayer(ladderPlayer);
      } catch {
        /* ignore */
      }
      notify({
        message: 'Perfil actualizado correctamente.',
        level: 'success',
      });
      navigate('/battle');
    } catch (err: unknown) {
      const msg = (err as Error)?.message ?? String(err);
      notify({ message: msg || 'Error actualizando perfil.', level: 'danger' });
    }
  }

  useEffect(() => {
    (async () => {
      try {
        if (!supabase) return;
        const { data } = await supabase.auth.getUser();
        const u = data?.user ?? null;
        if (u && !userId) setUserId(u.id);
      } catch {
        /* ignore */
      }
    })();
  }, [userId]);

  const handleUploadSuccess = (url: string, storagePath?: string) => {
    gameDispatch({ type: 'SET_AVATAR', payload: url });
    if (storagePath) setPendingAvatarPath(storagePath);
  };

  return (
    <div className={styles.page}>
      <main className={styles.card}>
        <h1 className={styles.title}>Configura tu Identidad Digital</h1>
        <p className={styles.subtitle}>
          Tu identidad digital representa tu presencia en la red y tu reputación
          técnica. Sube un avatar para personalizarla.
        </p>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="name">
            Nombre
          </label>
          <input
            id="name"
            value={player?.name || ''}
            onChange={(e) =>
              gameDispatch({
                type: 'UPDATE_PLAYER_DATA',
                payload: { name: e.target.value },
              })
            }
            className={styles.input}
            placeholder="Tu nombre"
          />
        </div>
        <div className={styles.row}>
          <label className={styles.label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
            placeholder="Tu email"
          />
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Identidad Digital</div>
          <AvatarUploader
            userId={userId ?? undefined}
            initialAvatar={player?.avatarUrl ?? null}
            initialLevel={player?.level || 1}
            onUploadSuccess={handleUploadSuccess}
          />
        </div>
        <div className={styles.row}>
          <div className={styles.label}>Estadísticas iniciales</div>
          <div className={styles.statsWrap}>
            <StatDisplay
              stats={
                (player?.stats as unknown as Stats) || {
                  soft_skills: 10,
                  tech_skills: 10,
                  core_values: 10,
                  creativity: 10,
                  ai_level: 1,
                }
              }
            />
          </div>
        </div>
        <div className={styles.actions}>
          <Button onClick={saveProfile} ariaLabel="Guardar y Continuar">
            Guardar y Continuar
          </Button>
        </div>
      </main>
    </div>
  );
};
