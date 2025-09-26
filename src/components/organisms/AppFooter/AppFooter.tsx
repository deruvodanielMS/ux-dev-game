import React from 'react';

import { Button } from '@/components/atoms/Button/Button';

import { useModal } from '@/context/ModalContext';

import styles from './AppFooter.module.css';

const FooterLogo: React.FC<{ size?: number }> = ({ size = 28 }) => (
  <img
    src="/reshot-icon-robot-hand-LD4YZBQN36.svg"
    width={size}
    height={size}
    alt="Robot Slayer logo"
    loading="lazy"
    style={{ display: 'block' }}
  />
);

export const AppFooter: React.FC = () => {
  const { showModal } = useModal();

  const openRules = () => {
    showModal({
      title: 'Reglas del juego',
      body: (
        <div>
          <p>Bienvenido a Duelo de Código. Reglas básicas:</p>
          <ol>
            <li>Cada jugador tiene Salud y Stamina.</li>
            <li>
              Jugar cartas consume Stamina y produce efectos (daño o curación).
            </li>
            <li>
              Cuando la Salud del enemigo llega a 0, lo derrotas y avanzas en el
              mapa.
            </li>
            <li>Administra tu Stamina para no quedar sin acciones.</li>
            <li>Los recursos y nivel se almacenan en tu perfil.</li>
          </ol>
          <p>¡Suerte!</p>
        </div>
      ),
      actions: [{ label: 'Cerrar', variant: 'ghost' }],
      allowClose: true,
    });
  };

  return (
    <footer className={styles.footerWrap}>
      <div className={styles.container}>
        <p className={styles.copy}>
          <FooterLogo size={20} /> 2025 UX Dev Team — Making sense
        </p>
        <div className={styles.actions}>
          <Button onClick={openRules} variant="ghost" ariaLabel="Info">
            Info
          </Button>
        </div>
      </div>
    </footer>
  );
};
