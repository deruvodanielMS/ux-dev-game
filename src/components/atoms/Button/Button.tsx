import styles from './Button.module.css';

import type { ButtonProps } from '@/types';

export const Button = ({
  children,
  onClick,
  variant = 'primary',
  className = '',
  ariaLabel,
  loading = false,
}: ButtonProps) => {
  const classNames = [
    styles.button,
    variant === 'primary' ? styles.primary : styles.ghost,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classNames}
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={loading}
    >
      {loading ? <span className={styles.spinner} aria-hidden /> : null}
      <span className={styles.label}>{children}</span>
    </button>
  );
};
