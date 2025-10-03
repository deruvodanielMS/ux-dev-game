import React from 'react';
import { useNavigate } from 'react-router-dom';

import type { PlayerProfile } from '@/types/components/header';

import { UserMenu } from '@/components/organisms/UserMenu/UserMenu';

import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { useModal } from '@/context/ModalContext';
import { useLoadPlayerProfile } from '@/hooks/useLoadPlayerProfile';
import { resolvePlayerAvatar } from '@/services/avatarResolve';

import styles from './Header.module.css';

// Settings body extracted to SettingsModalContent component

const Logo: React.FC<{ size?: number }> = ({ size = 40 }) => (
  <img
    src="/icon-robot-hand.svg"
    width={size}
    height={size}
    alt="Robot Slayer logo"
    loading="lazy"
    style={{ display: 'block' }}
  />
);

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

  // Removed automatic redirect to /profile to avoid unwanted navigation.
  React.useEffect(() => {
    // still close any open modal on first auth
    if (!wasLoggedRef.current && auth.isAuthenticated) {
      try {
        hideModal();
      } catch {
        /* ignore */
      }
    }
    wasLoggedRef.current = auth.isAuthenticated;
  }, [auth.isAuthenticated, hideModal]);

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
    <header className={styles.header} data-testid="header">
      <div className={styles.brandRow} data-testid="header-brand-row">
        <div className={styles.brandGroup}>
          <button
            className={styles.brand}
            onClick={() => navigate('/dashboard')}
            aria-label="Go to dashboard"
            data-testid="header-logo-button"
          >
            <Logo size={36} />
            <span className={styles.brandText} data-testid="header-brand-text">
              RobotSlayer
            </span>
          </button>
        </div>
      </div>

      {isLoggedIn ? (
        <div className={styles.right} data-testid="header-user-section">
          <div
            className={styles.avatarWrap}
            ref={avatarRef}
            data-testid="header-avatar-wrap"
          >
            <div
              className={styles.avatar}
              onClick={toggleMenu}
              onKeyDown={(e) => e.key === 'Enter' && toggleMenu()}
              role="button"
              tabIndex={0}
              aria-haspopup="true"
              aria-expanded={menuOpen}
              data-testid="header-avatar-button"
            >
              {effectiveAvatarUrl ? (
                <img
                  src={effectiveAvatarUrl}
                  alt="avatar"
                  data-testid="header-avatar-image"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      'none';
                  }}
                />
              ) : (
                <div
                  className={styles.placeholder}
                  data-testid="header-avatar-placeholder"
                >
                  {(player?.name || 'U').slice(0, 2).toUpperCase()}
                </div>
              )}
            </div>
            <div
              className={styles.avatarBadge}
              data-testid="header-level-badge"
            >
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
      ) : null}
    </header>
  );
};
