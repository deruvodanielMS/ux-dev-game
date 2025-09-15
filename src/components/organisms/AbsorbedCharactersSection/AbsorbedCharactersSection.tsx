import React from 'react';

import styles from './AbsorbedCharactersSection.module.css';

const ABSORBED = [
  {
    id: 'zeta',
    name: 'Zeta',
    avatarUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F18b71006d6404cecbe90ad5e2b850e0e%2Fd1244335b60b450d934feb75c64c702b?format=webp&width=800',
  },
  {
    id: 'joaco',
    name: 'Joaco',
    avatarUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F18b71006d6404cecbe90ad5e2b850e0e%2Ffae91380183c4796994e68926c174423?format=webp&width=800',
  },
  {
    id: 'emily',
    name: 'Emily',
    avatarUrl:
      'https://cdn.builder.io/api/v1/image/assets%2F18b71006d6404cecbe90ad5e2b850e0e%2F25673ac105d6433386143d09101f4834?format=webp&width=800',
  },
];

export const AbsorbedCharactersSection: React.FC = () => (
  <section className={styles.section} aria-hidden>
    <h3 className={styles.title}>Absorbidos por la IA</h3>
    <p className={styles.subtitle}>
      Estos personajes ya no están disponibles. La IA los absorbió.
    </p>

    <div className={styles.row}>
      {ABSORBED.map((c) => (
        <div key={c.id} className={styles.card}>
          <div className={styles.avatar} aria-hidden>
            {c.avatarUrl ? (
              <img
                className={styles.avatarImg}
                src={c.avatarUrl}
                alt={`${c.name} avatar`}
              />
            ) : (
              <div className={styles.initials}>
                {c.name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>
          <div className={styles.name}>{c.name}</div>
        </div>
      ))}
    </div>
  </section>
);
