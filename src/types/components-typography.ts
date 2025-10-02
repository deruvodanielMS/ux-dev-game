import type { ReactNode } from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type FontSize =
  | 'xs'
  | 'sm'
  | 'base'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';
export type FontWeight = 'normal' | 'medium' | 'semibold' | 'bold';
export type TextColor =
  | 'text'
  | 'muted'
  | 'primary'
  | 'accent'
  | 'success'
  | 'error'
  | 'warning';

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: ReactNode;
  level?: HeadingLevel;
  size?: FontSize;
  weight?: FontWeight;
}

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  children: ReactNode;
  as?: 'p' | 'span' | 'div' | 'label' | 'strong' | 'em';
  size?: FontSize;
  weight?: FontWeight;
  color?: TextColor;
}
