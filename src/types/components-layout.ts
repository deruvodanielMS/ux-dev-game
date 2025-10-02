import type { ReactNode } from 'react';

export type GridCols = 1 | 2 | 3 | 4 | 6 | 12;
export type Gap = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
export type FlexDirection = 'row' | 'column' | 'row-reverse' | 'column-reverse';
export type AlignItems = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type JustifyContent =
  | 'start'
  | 'center'
  | 'end'
  | 'between'
  | 'around'
  | 'evenly';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  cols?: GridCols;
  gap?: Gap;
}

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  direction?: FlexDirection;
  align?: AlignItems;
  justify?: JustifyContent;
  gap?: Gap;
  wrap?: boolean;
}
