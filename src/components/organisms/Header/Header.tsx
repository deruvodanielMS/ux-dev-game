import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { PlayerProfile } from '@/types/components/header';

import { Button } from '@/components/atoms/Button/Button';
import { AuthButton } from '@/components/organisms/AuthButton/AuthButton';
import { SettingsModalContent } from '@/components/organisms/SettingsModal/SettingsModalContent';

import { useAudio } from '@/context/AudioContext';
import { useGame } from '@/context/GameContext';
import { useModal } from '@/context/ModalContext';
import { useLoadPlayerProfile } from '@/hooks/useLoadPlayerProfile';

import styles from './Header.module.css';

// Settings body extracted to SettingsModalContent component

export const Header: React.FC = () => {
  const { state, dispatch } = useGame();
  const player = state.player;
  const navigate = useNavigate();
  const { showModal, hideModal } = useModal();
  const audio = useAudio();
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<PlayerProfile | null>(null);
  const wasLoggedRef = React.useRef<boolean>(false);
  // Using Auth0 now; Supabase auth removed. Load profile only if we have player email in state.
  const playerEmail = player?.email as string | undefined;
  const { profile: loadedProfile } = useLoadPlayerProfile(playerEmail);

  // redirect first login to profile
  React.useEffect(() => {
    const was = wasLoggedRef.current;
    if (!was && state.isLoggedIn) {
      try {
        hideModal();
      } catch {
        /* ignore */
      }
      if (window.location.pathname !== '/profile') navigate('/profile');
    }
    wasLoggedRef.current = state.isLoggedIn;
  }, [state.isLoggedIn, navigate, hideModal]);

  // sync profile from loader
  React.useEffect(() => {
    if (loadedProfile) {
      const mapped: PlayerProfile = {
        name:
          (loadedProfile as unknown as { name?: string | null }).name ??
          player?.name ??
          'Sin nombre',
        level:
          (loadedProfile as unknown as { level?: number | null }).level ??
          player?.level ??
          1,
      };
      setProfile(mapped);
    }
  }, [loadedProfile, player]);

  const avatarRef = React.useRef<HTMLDivElement | null>(null);
  const toggleDropdown = () => setOpen((s) => !s);

  // close dropdowns when clicking outside
  React.useEffect(() => {
    function onDocDown(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        open &&
        avatarRef.current &&
        target &&
        !avatarRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [open]);

  const handleLogout = async () => {
    // Auth0 logout is handled inside AuthButton; this just clears local UI state.
    dispatch({ type: 'UPDATE_PLAYER_DATA', payload: { name: '' } });
    dispatch({ type: 'SET_AVATAR', payload: null });
    setProfile(null);
    setOpen(false);
    // hamburger removed
    // hamburger removed
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        <div
          className={styles.brand}
          onClick={() => navigate('/')}
          onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
          role="button"
          tabIndex={0}
        >
          UXDevsia
        </div>
      </div>
      <div className={styles.right}>
        <div className={styles.controlsRow}>
          <Button
            variant="plain"
            className={styles.playBtn}
            onClick={() => (audio.isPlaying ? audio.pause() : audio.play())}
            ariaLabel="Toggle music"
            title="Toggle music"
          >
            {audio.isPlaying ? '⏸' : '⏵'}
          </Button>
          <AuthButton />
        </div>

        <div className={styles.avatarWrap} ref={avatarRef}>
          <div
            className={styles.avatar}
            onClick={toggleDropdown}
            onKeyDown={(e) => e.key === 'Enter' && toggleDropdown()}
            role="button"
            tabIndex={0}
            aria-haspopup="true"
            aria-expanded={open}
          >
            {player?.avatarUrl ? (
              <img src={player.avatarUrl} alt="avatar" />
            ) : (
              <div className={styles.placeholder}>
                {(player?.name || 'U').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div className={styles.avatarBadge}>
              Lv {profile?.level ?? player?.level ?? 1}
            </div>
          </div>
          {open && (
            <div className={styles.dropdown} role="menu" ref={avatarRef}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropAvatar}>
                  {player?.avatarUrl ? (
                    <img src={player.avatarUrl} alt="avatar" />
                  ) : (
                    <div className={styles.placeholder}>
                      {(player?.name || 'U').slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div>
                  <div className={styles.dropName}>
                    {profile?.name ?? player?.name ?? 'Sin nombre'}
                  </div>
                  <div className={styles.dropMeta}>
                    Nivel {profile?.level ?? player?.level ?? 1}
                  </div>
                </div>
              </div>
              <div className={styles.dropActions}>
                <Button
                  variant="ghost"
                  className={styles.dropBtn}
                  onClick={() => {
                    navigate('/profile');
                    setOpen(false);
                  }}
                  ariaLabel="Editar perfil"
                >
                  Editar perfil
                </Button>
                <Button
                  variant="ghost"
                  className={styles.dropBtnGhost}
                  onClick={handleLogout}
                  ariaLabel="Cerrar sesión"
                >
                  Cerrar sesión
                </Button>
                <Button
                  variant="ghost"
                  className={styles.dropBtn}
                  onClick={() => {
                    setOpen(false);
                    showModal({
                      title: 'Ajustes',
                      body: <SettingsModalContent />,
                      allowClose: true,
                    });
                  }}
                  ariaLabel="Ajustes"
                >
                  Settings
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
