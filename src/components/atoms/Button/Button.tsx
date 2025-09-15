import { ButtonProps } from '../../../types';

import styles from './Button.module.css';

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
