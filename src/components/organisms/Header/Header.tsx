import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { usePlayer } from '../../../context/PlayerContext';
import { useModal } from '../../../context/ModalContext';
import { useAudio } from '../../../context/AudioContext';
import supabase from '../../../services/supabase';
import { useAuth0 } from '@auth0/auth0-react';
import { syncAuth0User } from '../../../services/auth';
import AuthButton from '../AuthButton/AuthButton';

function SettingsBody(){
  const audio = useAudio();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <button className={styles.playBtn} onClick={() => audio.isPlaying ? audio.pause() : audio.play()} aria-label="Toggle music">{audio.isPlaying ? '⏸' : '⏵'}</button>
        <label className={styles.volumeLabel}>Vol</label>
        <input className={styles.volume} type="range" min={0} max={1} step={0.01} value={audio.volume} onChange={(e) => audio.setVolume(Number(e.target.value))} />
      </div>
    </div>
  );
}

export default function Header(){
  const { state, dispatch } = usePlayer();
  const navigate = useNavigate();
  const { showModal, hideModal } = useModal();
  const audio = useAudio();
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<any | null>(null);
  const [hamburgerOpen, setHamburgerOpen] = React.useState(false);

  const wasLoggedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    const was = wasLoggedRef.current;
    if (!was && state.isLoggedIn) {
      try { hideModal(); } catch (e) {}
      if (window.location.pathname !== '/profile') navigate('/profile');
    }
    wasLoggedRef.current = state.isLoggedIn;
  }, [state.isLoggedIn, navigate, hideModal]);

  // Auth0 integration: when authenticated, sync user with Supabase and load profile
  const { isAuthenticated, getAccessTokenSilently, logout: auth0Logout, user: auth0User } = useAuth0();

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!isAuthenticated) return;
        if (!getAccessTokenSilently) return;
        const token = await getAccessTokenSilently();
        if (!token) return;
        // sync user to supabase (serverless endpoint will upsert using service role)
        await syncAuth0User(token);

        // now fetch player record from Supabase (using anon client)
        if (!supabase) return;
        // auth0 sub is the id we used when upserting
        const auth0Id = auth0User?.sub ?? null;
        if (!auth0Id) return;
        const { data: p } = await supabase.from('players').select('*').or(`id.eq.${auth0Id},slug.eq.${auth0Id}`).limit(1).single();
        if (!mounted) return;
        if (p) {
          setProfile(p);
          dispatch({ type: 'SET_NAME', payload: p.name ?? state.playerName });
          // resolve avatar path to signed url if needed
          (async () => {
            try {
              let avatarVal = p.avatar_url ?? p.avatarUrl ?? state.avatarUrl ?? null;
              if (avatarVal && !(avatarVal.startsWith('http://') || avatarVal.startsWith('https://'))) {
                const { resolveAvatarUrl } = await import('../../../services/avatars');
                const resolved = await resolveAvatarUrl(avatarVal);
                if (resolved) avatarVal = resolved;
              }
              dispatch({ type: 'SET_AVATAR', payload: avatarVal });
            } catch (e) {
              dispatch({ type: 'SET_AVATAR', payload: p.avatar_url ?? state.avatarUrl });
            }
          })();
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
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
      if (open && avatarRef.current && target && !avatarRef.current.contains(target)) {
        setOpen(false);
      }
      if (hamburgerOpen && mobileNavRef.current && target && !mobileNavRef.current.contains(target) && hamburgerRef.current && !hamburgerRef.current.contains(target)) {
        setHamburgerOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocDown);
    return () => document.removeEventListener('mousedown', onDocDown);
  }, [open, hamburgerOpen]);

  const handleLogout = async () => {
    try {
      // auth0-react v2 expects logout with logoutParams
      auth0Logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (e) {
      // ignore
    }

    // clear local state and navigate home
    dispatch({ type: 'SET_NAME', payload: '' });
    dispatch({ type: 'SET_AVATAR', payload: null });
    setProfile(null);
    setOpen(false);
    setHamburgerOpen(false);
    navigate('/');
  };

  return (
    <header className={styles.header}>
      <div className={styles.brandRow}>
        <div className={styles.brand} onClick={() => navigate('/')}>UXDevsia</div>
      </div>

      <div className={styles.right}>
        <div className={styles.controlsRow}>
          <button className={styles.playBtn} onClick={() => audio.isPlaying ? audio.pause() : audio.play()} aria-label="Toggle music">{audio.isPlaying ? '⏸' : '⏵'}</button>
          <AuthButton />
        </div>

        {/* hamburger for small screens */}
        <button ref={hamburgerRef} className={styles.hamburger} aria-label="Abrir menu" onClick={toggleHamburger} aria-expanded={hamburgerOpen}>{hamburgerOpen ? '✕' : '☰'}</button>

        <div className={styles.avatarWrap} ref={avatarRef}>
          <div className={styles.avatar} ref={avatarRef} onClick={toggleDropdown} aria-haspopup="true" aria-expanded={open}>
            {state.avatarUrl ? <img src={state.avatarUrl} alt="avatar" /> : <div className={styles.placeholder}>{(state.playerName || 'U').slice(0,2).toUpperCase()}</div>}
            <div className={styles.avatarBadge}>Lv {profile?.level ?? state.level ?? 1}</div>
          </div>

          {open && (
            <div className={styles.dropdown} role="menu" ref={avatarRef}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropAvatar}>{state.avatarUrl ? <img src={state.avatarUrl} alt="avatar" /> : <div className={styles.placeholder}>{(state.playerName || 'U').slice(0,2).toUpperCase()}</div>}</div>
                <div>
                  <div className={styles.dropName}>{profile?.name ?? state.playerName ?? 'Sin nombre'}</div>
                  <div className={styles.dropMeta}>Nivel {profile?.level ?? state.level ?? 1}</div>
                </div>
              </div>

              <div className={styles.dropActions}>
                <button className={styles.dropBtn} onClick={() => { navigate('/profile'); setOpen(false); }}>Editar perfil</button>
                <button className={styles.dropBtnGhost} onClick={handleLogout}>Cerrar sesión</button>
                <button className={styles.dropBtn} onClick={() => { setOpen(false); showModal({ title: 'Ajustes', body: <SettingsBody />, allowClose: true }); }}>Settings</button>
              </div>
            </div>
          )}
        </div>

        {/* mobile nav drawer */}
        {hamburgerOpen && (
          <nav className={styles.mobileNav} role="navigation" ref={mobileNavRef}>
            <button className={styles.mobileItem} onClick={() => { navigate('/profile'); setHamburgerOpen(false); }}>Perfil</button>
            <button className={styles.mobileItem} onClick={() => { setHamburgerOpen(false); showModal({ title: 'Ajustes', body: <SettingsBody />, allowClose: true }); }}>Ajustes</button>
            <button className={styles.mobileItemGhost} onClick={handleLogout}>Cerrar sesión</button>
          </nav>
        )}
      </div>
    </header>
  );
}
