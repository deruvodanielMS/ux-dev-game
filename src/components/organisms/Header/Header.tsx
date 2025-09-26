import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { PlayerProfile } from '@/types/components/header';

import { UserMenu } from '@/components/organisms/UserMenu/UserMenu';

import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { useModal } from '@/context/ModalContext';
import { useLoadPlayerProfile } from '@/hooks/useLoadPlayerProfile';
import { resolvePlayerAvatar } from '@/services/avatarResolve';

import { AuthButton } from '../AuthButton/AuthButton';

import styles from './Header.module.css';

// Settings body extracted to SettingsModalContent component

export const Header: React.FC = () => {
  const { state } = useGame();
  const auth = useAuth();
  const player = state.player;
  const navigate = useNavigate();
  const { hideModal } = useModal();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<PlayerProfile | null>(null);
  const wasLoggedRef = React.useRef<boolean>(false);
  // Using Auth0 now; Supabase auth removed. Load profile only if we have player email in state.
  const playerEmail = player?.email as string | undefined;
  const { profile: loadedProfile } = useLoadPlayerProfile(playerEmail);
  const isLoggedIn = auth.isAuthenticated && !!player;

  // redirect first login to profile
  React.useEffect(() => {
    const was = wasLoggedRef.current;
    if (!was && auth.isAuthenticated) {
      try {
        hideModal();
      } catch {
        /* ignore */
      }
      if (window.location.pathname !== '/profile') navigate('/profile');
    }
    wasLoggedRef.current = auth.isAuthenticated;
  }, [auth.isAuthenticated, navigate, hideModal]);

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
  const toggleMenu = () => setMenuOpen((s) => !s);

  // close dropdowns when clicking outside
  // no longer needed here - handled inside UserMenu

  // logout handled inside AuthButton + UserMenu component

  const effectiveAvatarUrl = React.useMemo(
    () =>
      resolvePlayerAvatar({
        avatarUrl: player?.avatarUrl || null,
        authPicture: auth.user?.picture || null,
      }),
    [player?.avatarUrl, auth.user?.picture],
  );

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

      {isLoggedIn ? (
        <div className={styles.right}>
          <div className={styles.avatarWrap} ref={avatarRef}>
            <div
              className={styles.avatar}
              onClick={toggleMenu}
              onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={menuOpen}
            >
              {effectiveAvatarUrl ? (
                <img
                  src={effectiveAvatarUrl}
                  alt="avatar"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none';
                  }}
                />
              ) : (
                <div className={styles.placeholder}>
                  {(player?.name || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div className={styles.avatarBadge}>
              Lv {profile?.level ?? player?.level ?? 1}
            </div>
            <UserMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              triggerRef={avatarRef}
              level={profile?.level ?? player?.level ?? 1}
              name={profile?.name ?? player?.name ?? 'Sin nombre'}
              avatarUrl={effectiveAvatarUrl}
            />
          </div>
        </div>
      ) : (
        <AuthButton />
      )}
    </header>
  );
};
