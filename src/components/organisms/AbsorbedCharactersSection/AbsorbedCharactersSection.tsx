import React from 'react';
import styles from './AbsorbedCharactersSection.module.css';

const ABSORBED = [
  { id: 'zeta', name: 'Zeta' },
  { id: 'joaco', name: 'Joaco' },
  { id: 'emily', name: 'Emily' },
];

export default function AbsorbedCharactersSection(){
  return (
    <section className={styles.section} aria-hidden>
      <h3 className={styles.title}>Absorbidos por la IA</h3>
      <p className={styles.subtitle}>Estos personajes ya no están disponibles. La IA los absorbió.</p>

      <div className={styles.row}>
        {ABSORBED.map((c) => (
          <div key={c.id} className={styles.card}>
            <div className={styles.avatar} aria-hidden>
              <div className={styles.initials}>{c.name.slice(0,2).toUpperCase()}</div>
            </div>
            <div className={styles.name}>{c.name}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
