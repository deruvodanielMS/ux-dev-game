// DamageNumber component types
export interface DamageNumberProps {
  id: string;
  value: number;
  onDone: (id: string) => void;
  top?: number;
  left?: number;
}
