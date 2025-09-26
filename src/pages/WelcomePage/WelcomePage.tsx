import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { AbsorbedCharactersSection } from '@/components/organisms/AbsorbedCharactersSection/AbsorbedCharactersSection';
import { AuthButton } from '@/components/organisms/AuthButton/AuthButton';
import { CharacterList } from '@/components/organisms/CharacterList/CharacterList';

import { useGame } from '@/context/GameContext';
import { useModal } from '@/context/ModalContext';
import { useToast } from '@/context/ToastContext';

import styles from './WelcomePage.module.css';

export const WelcomePage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState<'hero' | 'select'>('hero');
  const { state: gameState, dispatch: gameDispatch } = useGame();
  const player = gameState.player;
  const navigate = useNavigate();
  const { showModal } = useModal();
  const { notify } = useToast();

  const handleStart = () => {
    if (!selectedId) {
      showModal({
        title: 'Selecciona un personaje',
        body: 'Selecciona un personaje para continuar.',
        actions: [{ label: 'Entendido', variant: 'ghost' }],
      });
      return;
    }

    gameDispatch({
      type: 'UPDATE_PLAYER_DATA',
      payload: { selectedCharacter: selectedId },
    });
    notify({
      title: '¡Listo!',
      message: 'Personaje seleccionado. Preparando perfil...',
      level: 'success',
    });
    navigate('/profile');
  };

  const isLoggedIn = !!player || gameState.isLoggedIn;

  return (
    <div className={styles.page}>
      <main
        className={`${styles.container} ${step === 'select' ? styles.containerSingle : ''}`}
      >
        {step === 'hero' && (
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
                La IA está absorbiendo a quienes no se mantienen actualizados y
                no colaboran. Tu misión: unirte al equipo y luchar por el
                código.
              </p>

              <div className={styles.heroActions}>
                <div className={styles.heroButtonsRight}>
                  <Button
                    onClick={() => setStep('select')}
                    className={styles.primaryLarge}
                    ariaLabel="Siguiente"
                  >
                    Siguiente
                  </Button>
                  {isLoggedIn ? (
                    <Button
                      onClick={() => navigate('/progress')}
                      variant="ghost"
                      className={styles.ghostLarge}
                      ariaLabel="Mapa"
                    >
                      Mapa
                    </Button>
                  ) : (
                    <AuthButton />
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {step === 'select' && (
          <section className={`${styles.formArea} ${styles.selectScreen}`}>
            <div className={styles.headerRow}>
              <div>
                <div className={styles.characterListTitle}>
                  Elige tu personaje
                </div>
                <div className={styles.helperText}>
                  Los personajes absorbidos se muestran abajo y no están
                  disponibles.
                </div>
              </div>
              <div className={styles.navigationRow}>
                <Button
                  onClick={() => setStep('hero')}
                  variant="ghost"
                  className={styles.navButton}
                  ariaLabel="Atrás"
                >
                  Atrás
                </Button>
                <Button
                  onClick={handleStart}
                  className={styles.primaryLarge}
                  ariaLabel="Iniciar Aventura"
                >
                  Iniciar Aventura
                </Button>
              </div>
            </div>

            <CharacterList
              selectedId={selectedId}
              onSelect={(id: string) => setSelectedId(id)}
            />

            <AbsorbedCharactersSection />
          </section>
        )}
      </main>
    </div>
  );
};
