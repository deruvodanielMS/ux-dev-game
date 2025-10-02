import React from 'react';

import type { GridProps } from '@/types/components-layout';

import styles from './Layout.module.css';

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(
  ({ children, cols = 1, gap = 4, className = '', ...props }, ref) => {
    const classNames = [
      styles.grid,
      styles[`cols-${cols}`],
      styles[`gap-${gap}`],
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <div ref={ref} className={classNames} {...props}>
        {children}
      </div>
    );
  },
);

Grid.displayName = 'Grid';
