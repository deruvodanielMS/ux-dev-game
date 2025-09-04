import React, { useState } from 'react';
import styles from './WelcomePage.module.css';
import Button from '../../components/atoms/Button/Button';
import CharacterCard, { Character } from '../../components/molecules/CharacterCard/CharacterCard';
import charactersData from '../../data/characters.json';
import { usePlayer } from '../../context/PlayerContext';
import { useNavigate } from 'react-router-dom';

export default function WelcomePage(){
  const [playerName, setPlayerName] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { dispatch } = usePlayer();
  const navigate = useNavigate();

  const characters: Character[] = charactersData as Character[];

  const handleStart = () => {
    if (!playerName.trim()){
      alert('Por favor ingresa tu nombre para continuar.');
      return;
    }
    if (!selectedId){
      alert('Selecciona un personaje para continuar.');
      return;
    }

    // Save to global state and go to profile setup
    dispatch({ type: 'SET_NAME', payload: playerName });
    dispatch({ type: 'SET_SELECTED_CHARACTER', payload: selectedId });

    navigate('/profile');
  };

  return (
    <div className={styles.page}>
      <main className={styles.container}>
        <section className={styles.intro}>
          <h1 className={styles.title}>Duelo de Código</h1>
          <p className={styles.mission}>
            La IA está absorbiendo a quienes no se mantienen actualizados y no colaboran. Tu misión: unirte al equipo y luchar por el código.
          </p>

          <div className={styles.finalMonsterWrap}>
            <img className={styles.finalMonster} src="https://i.pinimg.com/736x/ab/25/f6/ab25f694780cc113fd8fd7814857afe3.jpg" alt="Monstruo IA Final" />
          </div>
        </section>

        <section className={styles.formArea}>
          <label className={styles.label} htmlFor="playerName">Tu nombre</label>
          <input
            id="playerName"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className={styles.input}
            placeholder="Ingresa tu nombre"
          />

          <div className={styles.characterListTitle}>Elige tu personaje</div>
          <div className={styles.characterGrid} role="list">
            {characters.map((c) => (
              <div key={c.id} role="listitem" className={styles.gridItem}>
                <CharacterCard
                  character={c}
                  selected={selectedId === c.id}
                  onSelect={(id) => setSelectedId(id)}
                />
              </div>
            ))}
          </div>

          <div className={styles.ctaRow}>
            <Button onClick={handleStart} ariaLabel="Iniciar Aventura">Iniciar Aventura</Button>
          </div>
        </section>
      </main>
    </div>
  );
}
