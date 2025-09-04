import React from 'react';
import styles from './AppFooter.module.css';

export default function AppFooter(){
  return (
    <footer className={styles.footer}>
      <p className={styles.copy}>© Duelo de Código - Team 2025</p>
    </footer>
  );
}
