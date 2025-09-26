/* eslint-disable simple-import-sort/imports */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Player, Stats } from '@/types';

import { Button } from '@/components/atoms/Button/Button';
import { AvatarUploader } from '@/components/molecules/AvatarUploader/AvatarUploader';
import { StatDisplay } from '@/components/molecules/StatDisplay/StatDisplay';

import { useGame } from '@/context/GameContext';
import { useToast } from '@/context/ToastContext';

import { publicAvatarUrlFor, uploadAvatar } from '@/services/avatars';
import {
  savePlayer,
  updatePlayerAvatar,
  updatePlayerProfile,
} from '@/services/players';

import styles from './ProfileSetupPage.module.css';

export const ProfileSetupPage = () => {
  const { state: gameState, dispatch: gameDispatch } = useGame();
  const player = gameState.player;
  const navigate = useNavigate();
  const { notify } = useToast();
  const userId = player?.id ?? null;
  const [email, setEmail] = useState<string>(player?.email ?? '');
  const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(
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
      // Subir avatar primero si hay archivo nuevo
      let avatarFailed = false;
      if (selectedAvatarFile) {
        try {
          const storagePath = await uploadAvatar(selectedAvatarFile, userId);
          const fullUrl = publicAvatarUrlFor(storagePath) || storagePath;
          // Persist y actualizar estado con URL final (convención unificada)
          await updatePlayerAvatar(userId, fullUrl);
          gameDispatch({ type: 'SET_AVATAR', payload: fullUrl });
        } catch (upErr: unknown) {
          notify({
            message: 'Error subiendo avatar: ' + (upErr as Error)?.message,
            level: 'danger',
          });
          avatarFailed = true;
        }
      }

      await updatePlayerProfile(userId, {
        name: player.name,
        email: email || null,
        avatarUrl: gameState.player?.avatarUrl || null,
      });
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
      if (!avatarFailed) {
        notify({
          message: 'Perfil actualizado correctamente.',
          level: 'success',
        });
      } else {
        notify({
          message:
            'Perfil guardado (avatar pendiente). Puedes reintentar subirlo más tarde.',
          level: 'warning',
        });
      }
      navigate('/ladder');
    } catch (err: unknown) {
      const msg = (err as Error)?.message ?? String(err);
      notify({ message: msg || 'Error actualizando perfil.', level: 'danger' });
    }
  }

  // removed supabase auth user fetch effect

  const handleFileSelected = (file: File) => {
    setSelectedAvatarFile(file);
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
          <div className={styles.label}>Identidad Digital</div>
          <AvatarUploader
            initialAvatar={player?.avatarUrl ?? null}
            initialLevel={player?.level || 1}
            onFileSelected={handleFileSelected}
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
