import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Header.module.css';
import { usePlayer } from '../../../context/PlayerContext';
import GithubLogin from '../GithubLogin/GithubLogin';

export default function Header(){
  const { state } = usePlayer();
  const navigate = useNavigate();

  return (
    <header className={styles.header}>
      <div className={styles.brand} onClick={() => navigate('/')}>UXDevsia</div>
      <div className={styles.right}>
        <div className={styles.loginWrap}><GithubLogin /></div>
        <button className={styles.mapBtn} onClick={() => navigate('/progress')}>Mapa</button>
        <div className={styles.avatar} onClick={() => navigate('/profile')}>
          {state.avatarUrl ? <img src={state.avatarUrl} alt="avatar" /> : <div className={styles.placeholder}>{(state.playerName || 'U').slice(0,2).toUpperCase()}</div>}
        </div>
      </div>
    </header>
  );
}
