import React from 'react';
import styles from './Skeleton.module.css';

type Props = {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
};

export default function Skeleton({ width = '100%', height = 16, className = '', circle = false }: Props){
  const style: React.CSSProperties = { width, height };
  return <div className={`${styles.skeleton} ${circle ? styles.circle : ''} ${className}`} style={style} />;
}
