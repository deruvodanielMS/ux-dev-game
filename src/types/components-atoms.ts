// Shared atom component prop types
import type { CSSProperties, ReactNode } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  className?: string;
  ariaLabel?: string;
  loading?: boolean;
}

export interface StatusBarProps {
  label?: string;
  current: number;
  max: number;
  color?: string;
  className?: string;
}

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  circle?: boolean;
  style?: CSSProperties;
}

export interface Stats {
  soft_skills: number;
  tech_skills: number;
  core_values: number;
  creativity: number;
  ai_level: number;
}
