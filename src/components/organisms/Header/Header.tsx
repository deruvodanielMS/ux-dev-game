import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

import type { PlayerProfile } from '@/types/components/header';

import { AuthButton } from '@/components/organisms/AuthButton/AuthButton';

import { useAudio } from '@/context/AudioContext';
import { useGame } from '@/context/GameContext';
import { useModal } from '@/context/ModalContext';
import { supabase } from '@/services/supabase';

import styles from './Header.module.css';

// Settings modal body
const SettingsBody: React.FC = () => {
  const audio = useAudio();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button
          className={styles.playBtn}
          onClick={() => (audio.isPlaying ? audio.pause() : audio.play())}
          aria-label="Toggle music"
        >
          {audio.isPlaying ? '⏸' : '⏵'}
        </button>
        <label className={styles.volumeLabel} htmlFor="volume-slider">
          Vol
        </label>
        <input
          id="volume-slider"
          className={styles.volume}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={audio.volume}
          onChange={(e) => audio.setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
};

export const Header: React.FC = () => {
  const { state, dispatch } = useGame();
  const player = state.player;
  const navigate = useNavigate();
  const { showModal, hideModal } = useModal();
  const audio = useAudio();
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<PlayerProfile | null>(null);
  const [hamburgerOpen, setHamburgerOpen] = React.useState(false);
  const wasLoggedRef = React.useRef<boolean>(false);

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

  // auth0 integration
  const {
    isAuthenticated,
    getAccessTokenSilently,
    logout: auth0Logout,
    user: auth0User,
  } = useAuth0();

  React.useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        console.log(isAuthenticated);
        if (!isAuthenticated || !getAccessTokenSilently) return;
        const token = await getAccessTokenSilently();
        if (!token) return;

        if (!supabase) return;
        const email = auth0User?.email ?? null;
        if (!email) return;
        const { data: p } = await supabase
          // .schema('private')
          .from('players')
          .select('*')
          .eq(`email`, email)
          .limit(1)
          .single();
        console.log('Fetched player profile from Supabase:', p);
        if (!p) {
          console.error('No player profile found');
          await supabase
            .from('players')
            .insert({ email, name: auth0User?.name ?? email });
        }
        if (!mounted) return;
        if (p) {
          setProfile(p);
          dispatch({
            type: 'UPDATE_PLAYER_DATA',
            payload: { name: p.name ?? player?.name ?? '' },
          });
          (async () => {
            try {
              let avatarVal =
                p.avatar_url ?? p.avatarUrl ?? player?.avatarUrl ?? null;
              if (
                avatarVal &&
                !(
                  avatarVal.startsWith('http://') ||
                  avatarVal.startsWith('https://')
                )
              ) {
                const { resolveAvatarUrl } = await import('@/services/avatars');
                const resolved = await resolveAvatarUrl(avatarVal);
                if (resolved) avatarVal = resolved;
              }
              dispatch({ type: 'SET_AVATAR', payload: avatarVal });
            } catch {
              dispatch({
                type: 'SET_AVATAR',
                payload: p.avatar_url ?? player?.avatarUrl ?? null,
              });
            }
          })();
        }
      } catch {
        /* ignore */
      }
    })();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, getAccessTokenSilently, auth0User]);

  const avatarRef = React.useRef<HTMLDivElement | null>(null);
  const mobileNavRef = React.useRef<HTMLElement | null>(null);
  const hamburgerRef = React.useRef<HTMLButtonElement | null>(null);

  const toggleDropdown = () => setOpen((s) => !s);
  const toggleHamburger = () => setHamburgerOpen((s) => !s);

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
      if (
        hamburgerOpen &&
        mobileNavRef.current &&
        target &&
        !mobileNavRef.current.contains(target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target)
      ) {
        setHamburgerOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [open, hamburgerOpen]);

  const handleLogout = async () => {
    try {
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } catch {
      /* ignore */
    }
    dispatch({ type: 'UPDATE_PLAYER_DATA', payload: { name: '' } });
    dispatch({ type: 'SET_AVATAR', payload: null });
    setProfile(null);
    setOpen(false);
    setHamburgerOpen(false);
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
          <button
            className={styles.playBtn}
            onClick={() => (audio.isPlaying ? audio.pause() : audio.play())}
            aria-label="Toggle music"
          >
            {audio.isPlaying ? '⏸' : '⏵'}
          </button>
          <AuthButton />
        </div>
        <button
          ref={hamburgerRef}
          className={styles.hamburger}
          aria-label="Abrir menu"
          onClick={toggleHamburger}
          aria-expanded={hamburgerOpen}
        >
          {hamburgerOpen ? '✕' : '☰'}
        </button>
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
                <button
                  className={styles.dropBtn}
                  onClick={() => {
                    navigate('/profile');
                    setOpen(false);
                  }}
                >
                  Editar perfil
                </button>
                <button className={styles.dropBtnGhost} onClick={handleLogout}>
                  Cerrar sesión
                </button>
                <button
                  className={styles.dropBtn}
                  onClick={() => {
                    setOpen(false);
                    showModal({
                      title: 'Ajustes',
                      body: <SettingsBody />,
                      allowClose: true,
                    });
                  }}
                >
                  Settings
                </button>
              </div>
            </div>
          )}
        </div>
        {hamburgerOpen && (
          <nav
            className={styles.mobileNav}
            role="navigation"
            ref={mobileNavRef}
          >
            <button
              className={styles.mobileItem}
              onClick={() => {
                navigate('/profile');
                setHamburgerOpen(false);
              }}
            >
              Perfil
            </button>
            <button
              className={styles.mobileItem}
              onClick={() => {
                setHamburgerOpen(false);
                showModal({
                  title: 'Ajustes',
                  body: <SettingsBody />,
                  allowClose: true,
                });
              }}
            >
              Ajustes
            </button>
            <button className={styles.mobileItemGhost} onClick={handleLogout}>
              Cerrar sesión
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
