import React from 'react';
import Button from '../Button/Button';

export default function AttackButton({ children, onClick, ariaLabel }: { children: React.ReactNode; onClick?: () => void; ariaLabel?: string }){
  return <Button onClick={onClick} ariaLabel={ariaLabel}>{children}</Button>;
}
