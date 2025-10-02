import React from 'react';

import type { FlexProps } from '@/types/components-layout';

import styles from './Layout.module.css';

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
  (
    {
      children,
      direction = 'row',
      align = 'stretch',
      justify = 'start',
      gap = 0,
      wrap = false,
      className = '',
      ...props
    },
    ref,
  ) => {
    const classNames = [
      styles.flex,
      styles[`direction-${direction}`],
      styles[`align-${align}`],
      styles[`justify-${justify}`],
      gap > 0 ? styles[`gap-${gap}`] : '',
      wrap ? styles.wrap : '',
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

Flex.displayName = 'Flex';
