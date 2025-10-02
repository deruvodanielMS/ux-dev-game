import React from 'react';

import type { HeadingProps } from '@/types/components-typography';

import styles from './Typography.module.css';

export const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ children, level = 'h2', size, weight, className = '', ...props }, ref) => {
    const Component = level;
    const sizeClass = size
      ? styles[`size-${size}`]
      : styles[`default-${level}`];
    const weightClass = weight ? styles[`weight-${weight}`] : '';

    const classNames = [styles.heading, sizeClass, weightClass, className]
      .filter(Boolean)
      .join(' ');

    return (
      <Component ref={ref} className={classNames} {...props}>
        {children}
      </Component>
    );
  },
);

Heading.displayName = 'Heading';
