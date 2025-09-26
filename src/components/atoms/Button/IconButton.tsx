import React from 'react';

import styles from './IconButton.module.css';

import type { IconButtonProps } from '@/types';

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      ariaLabel,
      onClick,
      className = '',
      size = 'md',
      variant = 'ghost',
      disabled = false,
      title,
      type = 'button',
    },
    ref,
  ) => {
    const classNames = [
      styles.iconButton,
      styles[`size-${size}`],
      variant === 'primary'
        ? styles.primary
        : variant === 'ghost'
          ? styles.ghost
          : styles.plain,
      disabled ? styles.disabled : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        className={classNames}
        onClick={onClick}
        title={title}
        disabled={disabled}
      >
        {icon}
      </button>
    );
  },
);
IconButton.displayName = 'IconButton';
