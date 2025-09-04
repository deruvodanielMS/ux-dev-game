import React from 'react';
import styles from './Button.module.css';

export type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  className?: string;
  ariaLabel?: string;
  loading?: boolean;
};

export default function Button({ children, onClick, variant = 'primary', className = '', ariaLabel, loading = false }: ButtonProps) {
  const classNames = [styles.button, variant === 'primary' ? styles.primary : styles.ghost, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} onClick={onClick} aria-label={ariaLabel} disabled={loading}>
      {loading ? <span className={styles.spinner} aria-hidden /> : null}
      <span className={styles.label}>{children}</span>
    </button>
  );
}
