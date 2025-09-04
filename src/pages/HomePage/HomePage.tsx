import React from 'react';
import styles from './HomePage.module.css';
import Button from '../../components/atoms/Button/Button';
import AppFooter from '../../components/organisms/AppFooter/AppFooter';

export default function HomePage(){
  const handleStart = () => {
    // Placeholder behavior — the app can hook this into routing or game state
    // No inline styles used; behavior is simple for now
    alert('Misión iniciada — ¡Buena suerte!');
  };

  return (
    <div className={styles.pageContainer}>
      <main className={styles.heroSection}>
        <div className={styles.heroCard}>
          <h1 className={styles.title}>Duelo de Código</h1>
          <p className={styles.description}>La IA está absorbiendo a quienes no colaboran. Tu misión: Unirte al equipo y luchar por el código.</p>
          <div className={styles.ctaArea}>
            <Button onClick={handleStart} ariaLabel="Iniciar Misión">Iniciar Misión</Button>
          </div>
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
