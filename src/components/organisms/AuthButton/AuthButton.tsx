import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import styles from './AuthButton.module.css';
import { syncAuth0User } from '../../../services/auth';

export default function AuthButton() {
  const { loginWithPopup, loginWithRedirect, logout, user, getAccessTokenSilently, isAuthenticated } = useAuth0();

  const handleLogin = async () => {
    try {
      await loginWithPopup();
      const token = await getAccessTokenSilently();
      await syncAuth0User(token);
    } catch (err) {
      // fallback to redirect if popup blocked
      await loginWithRedirect();
    }
  };

  const handleLogout = async () => {
    logout({ returnTo: window.location.origin });
  };

  return (
    <div className={styles.authWrapper}>
      {isAuthenticated ? (
        <>
          <img className={styles.avatar} src={user?.picture} alt={user?.name || 'avatar'} />
          <button className={styles.button} onClick={handleLogout} aria-label="Cerrar sesión">Cerrar</button>
        </>
      ) : (
        <button className={styles.button} onClick={handleLogin} aria-label="Iniciar sesión">Login</button>
      )}
    </div>
  );
}
