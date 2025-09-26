import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import { Button } from '@/components/atoms/Button/Button';

import styles from './AuthButton.module.css';

export const AuthButton: React.FC = () => {
  const {
    loginWithPopup,
    loginWithRedirect,
    logout,
    user,
    getAccessTokenSilently,
    isAuthenticated,
  } = useAuth0();

  const handleLogin = async () => {
    console.log('AuthButton: handleLogin clicked');
    try {
      if (loginWithPopup) {
        console.log('Attempting loginWithPopup');
        await loginWithPopup();
      } else {
        console.log('loginWithPopup not available, using redirect');
        await loginWithRedirect();
        return;
      }

      try {
        const token = getAccessTokenSilently
          ? await getAccessTokenSilently()
          : null;
        console.log('Access token obtained:', token);
      } catch (innerErr) {
        console.error('Failed to get access token silently', innerErr);
      }
    } catch (err) {
      console.error('loginWithPopup failed, falling back to redirect', err);
      try {
        await loginWithRedirect();
      } catch (redirectErr) {
        console.error('loginWithRedirect also failed', redirectErr);
        alert('Login failed — revisa la consola para más detalles');
      }
    }
  };

  const handleLogout = async () => {
    try {
      // auth0-react v2 expects logout with logoutParams
      logout({ logoutParams: { returnTo: window.location.origin } });
    } catch (e) {
      console.error('logout error', e);
    }
  };

  return (
    <div className={styles.authWrapper}>
      {isAuthenticated ? (
        <>
          <img
            className={styles.avatar}
            src={user?.picture}
            alt={user?.name || 'avatar'}
          />
          <Button
            className={styles.button}
            onClick={handleLogout}
            ariaLabel="Cerrar sesión"
            variant="ghost"
            title="Cerrar sesión"
          >
            Cerrar
          </Button>
        </>
      ) : (
        <Button
          className={styles.button}
          onClick={handleLogin}
          ariaLabel="Iniciar sesión"
          variant="primary"
          title="Iniciar sesión"
        >
          Login
        </Button>
      )}
    </div>
  );
};
