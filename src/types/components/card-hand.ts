// CardHand component types
export interface CardHandProps {
  cards: string[];
  onPlay: (id: string) => void;
}
