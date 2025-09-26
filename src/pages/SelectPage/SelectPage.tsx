import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/atoms/Button/Button';
import { AbsorbedCharactersSection } from '@/components/organisms/AbsorbedCharactersSection/AbsorbedCharactersSection';
import { CharacterList } from '@/components/organisms/CharacterList/CharacterList';

// Removed direct players list (CharacterList now sources players internally)
import styles from './SelectPage.module.css';

export const SelectPage = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const navigate = useNavigate();

  // Duplicate players list removed: CharacterList already displays available players.

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <header className={styles.headerRow}>
          <div>
            <h1 className={styles.title}>Elige tu personaje</h1>
            <p className={styles.helper}>
              Los absorbidos no están disponibles.
            </p>
          </div>
          <div className={styles.actions}>
            <Button
              onClick={() => navigate('/battle')}
              ariaLabel="Confirmar selección"
            >
              Empezar Batalla
            </Button>
          </div>
        </header>
        <CharacterList selectedId={selectedId} onSelect={setSelectedId} />
        <AbsorbedCharactersSection />
      </main>
    </div>
  );
};
