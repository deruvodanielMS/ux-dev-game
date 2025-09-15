// CharacterCard component related types
export interface UICharacterCardCharacter {
  id: string;
  name: string;
  level?: number;
  stats?: Record<string, number>;
  avatarUrl?: string;
  last_pr_at?: string | null;
  ai_level?: number | null;
}

export interface CharacterCardProps {
  character: UICharacterCardCharacter;
  selected?: boolean;
  absorbed?: boolean;
}
