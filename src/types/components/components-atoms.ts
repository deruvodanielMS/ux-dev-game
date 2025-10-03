// Shared atom component prop types
import type { CSSProperties, ReactNode } from 'react';

export interface ButtonProps {
  children?: ReactNode;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'ghost' | 'plain';
  className?: string;
  ariaLabel?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

// Icon-only button (circular or square) for toolbar / header small actions
export interface IconButtonProps {
  icon: ReactNode; // required visual icon element (svg, span, etc.)
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  ariaLabel: string; // accessibility label required since no text
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'ghost' | 'plain';
  disabled?: boolean;
  title?: string; // optional tooltip
  type?: 'button' | 'submit' | 'reset';
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
