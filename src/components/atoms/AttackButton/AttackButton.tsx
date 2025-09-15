import type { AttackButtonProps } from '@/types/components-attack-button';

import { Button } from '@/components/atoms/Button/Button';

export const AttackButton = ({
  children,
  onClick,
  ariaLabel,
}: AttackButtonProps) => {
  return (
    <Button onClick={onClick} ariaLabel={ariaLabel}>
      {children}
    </Button>
  );
};
