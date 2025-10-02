import React from 'react';

import type { TextProps } from '@/types/components-typography';

import styles from './Typography.module.css';

export const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      children,
      as = 'p',
      size = 'base',
      weight,
      color,
      className = '',
      ...props
    },
    ref,
  ) => {
    const Component = as as React.ElementType;
    const sizeClass = styles[`size-${size}`];
    const weightClass = weight ? styles[`weight-${weight}`] : '';
    const colorClass = color ? styles[`color-${color}`] : '';

    const classNames = [
      styles.text,
      sizeClass,
      weightClass,
      colorClass,
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classNames} {...props}>
        {children}
      </Component>
    );
  },
);

Text.displayName = 'Text';
