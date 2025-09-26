import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { AuthButton } from '@/components/organisms/AuthButton/AuthButton';

import { useAuth } from '@/context/AuthContext';
import { useGame } from '@/context/GameContext';
import { useToast } from '@/context/ToastContext';

import styles from './WelcomePage.module.css';

export const WelcomePage = () => {
  const { state: gameState } = useGame();
  const auth = useAuth();
  const player = gameState.player;
  const navigate = useNavigate();
  const { notify } = useToast();

  const goToDashboard = () => {
    if (!auth.isAuthenticated) {
      notify({
        title: 'Inicia sesión',
        message: 'Debes autenticarte para elegir un personaje.',
        level: 'info',
      });
    }
    navigate('/dashboard');
  };

  const isLoggedIn = auth.isAuthenticated && !!player;

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <section className={`${styles.intro} ${styles.hero}`}>
          <div className={styles.heroRight}>
            <div className={styles.finalMonsterWrap}>
              <img
                className={styles.finalMonster}
                src="https://i.pinimg.com/736x/ab/25/f6/ab25f694780cc113fd8fd7814857afe3.jpg"
                alt="Monstruo IA Final"
              />
            </div>
          </div>

          <div className={styles.heroLeft}>
            <h1 className={styles.title}>Duelo de Código</h1>
            <p className={styles.mission}>
              La IA está absorbiendo a quienes no se mantienen actualizados y no
              colaboran. Tu misión: unirte al equipo y luchar por el código.
            </p>

            <div className={styles.heroActions}>
              <div className={styles.heroButtonsRight}>
                {isLoggedIn ? (
                  <Button
                    onClick={goToDashboard}
                    className={styles.primaryLarge}
                    ariaLabel="Empezar"
                  >
                    Empezar la batalla
                  </Button>
                ) : (
                  <AuthButton />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
