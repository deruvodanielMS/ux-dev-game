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
  value: number;
  max?: number;
  color?: 'green' | 'blue' | 'red' | 'orange';
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
