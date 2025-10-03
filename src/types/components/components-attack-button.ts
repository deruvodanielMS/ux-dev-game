// AttackButton component types
import type { ReactNode } from 'react';

export interface AttackButtonProps {
  children: ReactNode;
  onClick?: () => void;
  ariaLabel?: string;
}
