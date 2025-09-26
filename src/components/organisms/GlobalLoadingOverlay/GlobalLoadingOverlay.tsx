import React from 'react';

import { useNetworkActivity } from '@/context/NetworkActivityContext';

import styles from './GlobalLoadingOverlay.module.css';

export const GlobalLoadingOverlay: React.FC = () => {
  const { busy, count } = useNetworkActivity();
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (busy) {
      const t = setTimeout(() => setVisible(true), 300);
      return () => clearTimeout(t);
    } else {
      setVisible(false);
    }
  }, [busy]);
  if (!busy || !visible) return null;
  return (
    <div className={styles.overlay} role="alert" aria-busy="true">
      <div className={styles.box}>
        <div className={styles.spinner} />
        <div className={styles.text}>Sincronizando datos… ({count})</div>
      </div>
    </div>
  );
};
