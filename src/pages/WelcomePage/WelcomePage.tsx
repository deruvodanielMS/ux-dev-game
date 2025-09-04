import React, { useState } from 'react';
import styles from './WelcomePage.module.css';
import Button from '../../components/atoms/Button/Button';
import CharacterList from '../../components/organisms/CharacterList/CharacterList';
import AbsorbedCharactersSection from '../../components/organisms/AbsorbedCharactersSection/AbsorbedCharactersSection';
import { usePlayer } from '../../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage(){
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [step, setStep] = useState<'hero'|'select'>('hero');
  const { dispatch } = usePlayer();
  const navigate = useNavigate();

  const handleStart = () => {
    if (!selectedId){
      alert('Selecciona un personaje para continuar.');
      return;
    }

    dispatch({ type: 'SET_SELECTED_CHARACTER', payload: selectedId });
    navigate('/profile');
  };

  return (
    <div className={styles.page}>
      <main className={styles.container}>

        {step === 'hero' && (
          <section className={`${styles.intro} ${styles.hero}`}> 
            <div className={styles.heroLeft}>
              <h1 className={styles.title}>Duelo de Código</h1>
              <p className={styles.mission}>
                La IA está absorbiendo a quienes no se mantienen actualizados y no colaboran. Tu misión: unirte al equipo y luchar por el código.
              </p>

              <div className={styles.heroActions}>
                <Button onClick={() => setStep('select')} className={styles.primaryLarge} ariaLabel="Siguiente">Siguiente</Button>
                <Button onClick={() => navigate('/progress')} variant="ghost" className={styles.ghostLarge} ariaLabel="Mapa">Mapa</Button>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.finalMonsterWrap}>
                <img className={styles.finalMonster} src="https://i.pinimg.com/736x/ab/25/f6/ab25f694780cc113fd8fd7814857afe3.jpg" alt="Monstruo IA Final" />
              </div>
            </div>
          </section>
        )}

        {step === 'select' && (
          <section className={`${styles.formArea} ${styles.selectScreen}`}>
            <div className={styles.headerRow}>
              <div>
                <div className={styles.characterListTitle}>Elige tu personaje</div>
                <div className={styles.helperText}>Los personajes absorbidos se muestran abajo y no están disponibles.</div>
              </div>
              <div className={styles.navigationRow}>
                <Button onClick={() => setStep('hero')} variant="ghost" className={styles.navButton} ariaLabel="Atrás">Atrás</Button>
                <Button onClick={handleStart} className={styles.primaryLarge} ariaLabel="Iniciar Aventura">Iniciar Aventura</Button>
              </div>
            </div>

            <CharacterList selectedId={selectedId} onSelect={(id) => setSelectedId(id)} />

            <AbsorbedCharactersSection />
          </section>
        )}

      </main>
    </div>
  );
}
