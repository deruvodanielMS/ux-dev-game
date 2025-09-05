import React, { useState } from 'react';
import { supabase } from '../../../services/supabase';
import styles from './EmailLogin.module.css';
import { useToast } from '../../../context/ToastContext';

export const EmailLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [message, setMessage] = useState('');
  const { notify } = useToast();

  const handleAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setMessage('');
    try {
      if (!supabase) throw new Error('Supabase no configurado');
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        setMessage('¡Sesión iniciada con éxito!');
        notify({ message: 'Sesión iniciada', level: 'success' });
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        setMessage('¡Revisa tu correo para confirmar tu registro y luego inicia sesión!');
        notify({ message: 'Registro creado. Revisa tu correo.', level: 'info' });
      }
    } catch (err: any) {
      const msg = err?.message ?? String(err);
      setMessage(msg);
      notify({ message: msg, level: 'danger' });
    }
  };

  return (
    <form onSubmit={handleAuth} className={styles.form}>
      <h4 className={styles.title}>{isLogin ? 'Iniciar Sesión' : 'Registrarse'}</h4>
      <input
        className={styles.input}
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        className={styles.input}
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <div className={styles.row}>
        <button type="submit" className={styles.submit}>{isLogin ? 'Login' : 'Registrar'}</button>
        <button type="button" className={styles.toggle} onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'No tengo una cuenta' : 'Ya tengo una cuenta'}
        </button>
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </form>
  );
};

export default EmailLogin;
