import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { Heading } from '@/components/atoms/Typography/Heading';
import { Text } from '@/components/atoms/Typography/Text';
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
  const { t } = useTranslation();

  const goToDashboard = () => {
    if (!auth.isAuthenticated) {
      notify({
        title: t('welcome.login'),
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
            <Heading level="h1" className={styles.title}>
              {t('welcome.title')}
            </Heading>
            <Text className={styles.mission}>{t('welcome.subtitle')}</Text>

            <div className={styles.heroActions}>
              <div className={styles.heroButtonsRight}>
                {isLoggedIn ? (
                  <Button
                    onClick={goToDashboard}
                    className={styles.primaryLarge}
                    ariaLabel={t('welcome.getStarted')}
                  >
                    {t('welcome.getStarted')}
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
