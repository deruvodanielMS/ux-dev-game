import React from 'react';
import { supabase } from '../../../services/supabase';
import styles from './GithubLogin.module.css';

export const GithubLogin: React.FC = () => {
  const handleLogin = async () => {
    try {
      if (!supabase) throw new Error('Supabase client not configured');
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: { redirectTo: window.location.origin },
      });
      if (error) throw error;
    } catch (err: any) {
      console.error('Login failed:', err?.message || err);
      alert('Error iniciando sesión con GitHub.');
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleLogin} className={styles.loginButton} aria-label="Login con GitHub">
        Login con GitHub
      </button>
    </div>
  );
};

export default GithubLogin;
