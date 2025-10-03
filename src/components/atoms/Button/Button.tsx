import React from 'react';

import styles from './Button.module.css';

import type { ButtonProps } from '@/types';

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      onClick,
      variant = 'primary',
      className = '',
      ariaLabel,
      loading = false,
      disabled = false,
      type = 'button',
      title,
      ...rest
    },
    ref,
  ) => {
    const classNames = [
      styles.button,
      variant === 'primary'
        ? styles.primary
        : variant === 'ghost'
          ? styles.ghost
          : styles.plain,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        className={classNames}
        onClick={onClick}
        aria-label={ariaLabel}
        title={title}
        disabled={loading || disabled}
        {...rest}
      >
        {loading ? <span className={styles.spinner} aria-hidden /> : null}
        <span className={styles.label}>{children}</span>
      </button>
    );
  },
);
Button.displayName = 'Button';
