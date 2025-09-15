import styles from './Skeleton.module.css';

import type { SkeletonProps } from '@/types';

export const Skeleton = ({
  width = 80,
  height = 16,
  circle = false,
  className = '',
}: SkeletonProps) => {
  return (
    <div
      className={[styles.skeleton, circle ? styles.circle : '', className].join(
        ' ',
      )}
      style={{ width, height }}
      aria-hidden
    />
  );
};
