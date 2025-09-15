// CharacterList component types
export interface CharacterListProps {
  selectedId: string | null;
  onSelect?: (id: string) => void; // optional selection handler
}
