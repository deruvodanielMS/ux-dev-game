import { SkeletonProps } from '../../../types';

import styles from './Skeleton.module.css';

export const Skeleton = ({
  width = '100%',
  height = 16,
  className = '',
  circle = false,
}: SkeletonProps) => {
  const style = { width, height } as const;
  return (
    <div
      className={`${styles.skeleton} ${circle ? styles.circle : ''} ${className}`}
      style={style}
    />
  );
};
