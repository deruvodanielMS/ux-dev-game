import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { usePlayer } from '../../../context/PlayerContext';
import { useModal } from '../../../context/ModalContext';
import EmailLogin from '../EmailLogin/EmailLogin';
import { useAudio } from '../../../context/AudioContext';
import supabase from '../../../services/supabase';

export default function Header(){
  const { state, dispatch } = usePlayer();
  const navigate = useNavigate();
  const { showModal, hideModal } = useModal();
  const audio = useAudio();
  const [open, setOpen] = React.useState(false);
  const [profile, setProfile] = React.useState<any | null>(null);

  const wasLoggedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    const was = wasLoggedRef.current;
    if (!was && state.isLoggedIn) {
      try { hideModal(); } catch (e) {}
      if (window.location.pathname !== '/profile') navigate('/profile');
    }
    wasLoggedRef.current = state.isLoggedIn;
  }, [state.isLoggedIn, navigate, hideModal]);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        if (!supabase) return;
        const { data } = await supabase.auth.getUser();
        const user = data?.user ?? null;
        if (!user) return;
        // try fetch player by id or slug
        const { data: p } = await supabase.from('players').select('*').or(`id.eq.${user.id},slug.eq.${user.id}`).limit(1).single();
        if (!mounted) return;
        if (p) {
          setProfile(p);
          // sync to context
          dispatch({ type: 'SET_NAME', payload: p.name ?? state.playerName });
          dispatch({ type: 'SET_AVATAR', payload: p.avatar_url ?? state.avatarUrl });
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.isLoggedIn]);

  const toggleDropdown = () => setOpen((s) => !s);

  const handleLogout = async () => {
    try {
      if (!supabase) return;
      await supabase.auth.signOut();
      // clear local state
      dispatch({ type: 'SET_NAME', payload: '' });
      dispatch({ type: 'SET_AVATAR', payload: null });
      setProfile(null);
      setOpen(false);
    } catch (e) {
      // ignore
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.brand} onClick={() => navigate('/')}>UXDevsia</div>

      <div className={styles.right}>
        <div className={styles.controlsRow}>
          <button className={styles.playBtn} onClick={() => audio.isPlaying ? audio.pause() : audio.play()} aria-label="Toggle music">{audio.isPlaying ? '⏸' : '⏵'}</button>
          <label className={styles.volumeLabel}>Vol</label>
          <input className={styles.volume} type="range" min={0} max={1} step={0.01} value={audio.volume} onChange={(e) => audio.setVolume(Number(e.target.value))} />
        </div>

        {/* Login and Map moved out of header - use profile dropdown and page navigation */}

        <div className={styles.avatarWrap}>
          <div className={styles.avatar} onClick={toggleDropdown} aria-haspopup="true" aria-expanded={open}>
            {state.avatarUrl ? <img src={state.avatarUrl} alt="avatar" /> : <div className={styles.placeholder}>{(state.playerName || 'U').slice(0,2).toUpperCase()}</div>}
            <div className={styles.avatarBadge}>Lv {profile?.level ?? state.level ?? 1}</div>
          </div>

          {open && (
            <div className={styles.dropdown} role="menu">
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
                <button className={styles.dropBtn} onClick={() => { setOpen(false); showModal({ title: 'Ajustes', body: <div>Configuraciones</div>, allowClose: true }); }}>Settings</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
