// PlayerCard component prop types
export interface PlayerCardProps {
  name: string;
  avatarUrl?: string | null;
  level?: number;
  health?: number;
  stamina?: number;
  isActive?: boolean;
  variant?: 'player' | 'enemy';
}
