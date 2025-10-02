import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { Text } from '@/components/atoms/Typography/Text';

import { useAudio } from '@/context/AudioContext';
import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { useModal } from '@/context/ModalContext';

import { SettingsModalContent } from '../SettingsModal/SettingsModalContent';

import styles from './UserMenu.module.css';

export interface UserMenuProps {
  open: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLDivElement | null>;
  level: number;
  name: string;
  avatarUrl: string | null;
}

export const UserMenu: React.FC<UserMenuProps> = ({
  open,
  onClose,
  triggerRef,
  level,
  name,
  avatarUrl,
}) => {
  const { dispatch } = useGame();
  const auth = useAuth();
  const navigate = useNavigate();
  const { showModal } = useModal();
  const audio = useAudio();
  const { t } = useTranslation();

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // click outside for desktop dropdown
  React.useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node | null;
      if (
        triggerRef.current &&
        target &&
        !triggerRef.current.contains(target)
      ) {
        // If click is inside panel or drawer ignore; we rely on scrim for drawer
        const panel = document.querySelector('[data-user-menu-panel="true"]');
        if (panel && panel.contains(target)) return;
        onClose();
      }
    }
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [open, onClose, triggerRef]);

  const handleLogout = async () => {
    try {
      // Limpieza inmediata UI
      dispatch({ type: 'CLEAR_USER' });
      // Limpiar storage local del jugador para evitar "auto-login visual"
      try {
        localStorage.removeItem('duelo_player_state_v1');
      } catch {
        /* ignore */
      }
      onClose();
      navigate('/');
      // Llamar logout Auth0 (redirige fuera y vuelve)
      await auth.logout();
    } catch (e) {
      // fallback: intentar logout directo auth0-react si algo falla
      console.error('Logout falló', e);
    }
  };

  const launchSettings = () => {
    onClose();
    showModal({
      title: t('settings.title'),
      body: <SettingsModalContent />,
      allowClose: true,
    });
  };

  if (!open) return null;

  return (
    <>
      {/* Desktop dropdown */}
      <div
        className={styles.dropdownPanel}
        data-user-menu-panel="true"
        role="menu"
      >
        <div className={styles.headerBlock}>
          <div className={styles.avatarBox}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" />
            ) : (
              (name || 'U').slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <Text as="div" className={styles.name}>
              {name || t('user.noName')}
            </Text>
            <Text as="div" className={styles.meta}>
              {t('user.level', { level })}
            </Text>
          </div>
        </div>
        <div className={styles.controlsRow}>
          <Button
            variant="plain"
            className={styles.playBtn}
            onClick={() => (audio.isPlaying ? audio.pause() : audio.play())}
            ariaLabel={t('audio.toggle')}
            title={t('audio.toggle')}
          >
            {audio.isPlaying ? '⏸' : '⏵'}
          </Button>
        </div>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            onClick={() => {
              navigate('/profile');
              onClose();
            }}
            ariaLabel={t('user.profile')}
          >
            {t('user.profile')}
          </Button>
          <Button
            variant="ghost"
            onClick={launchSettings}
            ariaLabel={t('user.settings')}
          >
            {t('user.settings')}
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            ariaLabel={t('user.logout')}
          >
            {t('user.logout')}
          </Button>
        </div>
      </div>
      {/* Mobile drawer */}
      <div
        className={styles.drawerScrim}
        onClick={onClose}
        aria-hidden="true"
      />
      <div className={styles.drawer} role="dialog" aria-label="User menu">
        <div className={styles.drawerHeader}>
          <Text as="span" className={styles.drawerTitle}>
            {t('nav.profile')}
          </Text>
          <Button
            variant="ghost"
            onClick={onClose}
            ariaLabel={t('action.close')}
          >
            ✕
          </Button>
        </div>
        <div className={styles.headerBlock}>
          <div className={styles.avatarBox}>
            {avatarUrl ? (
              <img src={avatarUrl} alt="avatar" />
            ) : (
              (name || 'U').slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <Text as="div" className={styles.name}>
              {name || t('user.noName')}
            </Text>
            <Text as="div" className={styles.meta}>
              {t('user.level', { level })}
            </Text>
          </div>
        </div>
        <div className={styles.actions}>
          <Button
            variant="ghost"
            onClick={() => {
              navigate('/profile');
              onClose();
            }}
            ariaLabel={t('user.profile')}
          >
            {t('user.profile')}
          </Button>
          <Button
            variant="ghost"
            onClick={launchSettings}
            ariaLabel={t('user.settings')}
          >
            {t('user.settings')}
          </Button>
        </div>
        <div className={styles.drawerActions}>
          <Button
            variant="ghost"
            onClick={handleLogout}
            ariaLabel={t('user.logout')}
          >
            {t('user.logout')}
          </Button>
        </div>
      </div>
    </>
  );
};
