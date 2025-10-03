export interface LevelNodeProps {
  id: string;
  index: number;
  label: string;
  stars: number; // 0-3
  state: 'locked' | 'current' | 'completed';
  onClick?: (id: string) => void;
}

export interface ProgressPathNode extends Omit<LevelNodeProps, 'onClick'> {
  x: number; // percentage or px depending on container
  y: number;
}
