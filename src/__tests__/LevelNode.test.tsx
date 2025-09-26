import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LevelNode } from '@/components/atoms/LevelNode/LevelNode';

describe('LevelNode', () => {
  it('renders label and stars', () => {
    render(
      <LevelNode
        id="lvl1"
        index={0}
        label="Nivel 1"
        stars={2}
        state="current"
        onClick={vi.fn()}
      />,
    );
    expect(screen.getByLabelText(/nivel 1 current/i)).toBeInTheDocument();
    // 2 filled stars
    const stars = screen.getAllByText('★');
    expect(stars.length).toBe(3);
  });

  it('is disabled when locked', () => {
    render(
      <LevelNode
        id="lvl2"
        index={1}
        label="Nivel 2"
        stars={0}
        state="locked"
      />,
    );
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });
});
