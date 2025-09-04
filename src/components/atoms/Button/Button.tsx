import React from 'react';
import styles from './Button.module.css';

export type ButtonProps = {
  children?: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  className?: string;
  ariaLabel?: string;
};

export default function Button({ children, onClick, variant = 'primary', className = '', ariaLabel }: ButtonProps) {
  const classNames = [styles.button, variant === 'primary' ? styles.primary : styles.ghost, className]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} onClick={onClick} aria-label={ariaLabel}>
      <span className={styles.label}>{children}</span>
    </button>
  );
}
