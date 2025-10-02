import type { Meta, StoryObj } from '@storybook/react-vite';

import { CharacterCard } from './CharacterCard';

const meta: Meta<typeof CharacterCard> = {
  title: 'Molecules/CharacterCard',
  component: CharacterCard,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: '300px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CharacterCard>;

const mockCharacter = {
  id: '1',
  name: 'Alex Developer',
  level: 5,
  avatarUrl: 'https://via.placeholder.com/120x120/22c55e/ffffff?text=AD',
  last_pr_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  ai_level: 3,
  stats: {
    battles_won: 12,
    battles_lost: 3,
    damage_dealt: 1250,
    damage_taken: 890,
    enemies_defeated: 15,
    ai_level: 3,
  },
};

export const Base: Story = {
  args: {
    character: mockCharacter,
  },
};

export const Selected: Story = {
  args: {
    character: mockCharacter,
    selected: true,
  },
};

export const AtRisk: Story = {
  args: {
    character: {
      ...mockCharacter,
      last_pr_at: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(), // 35 days ago
      ai_level: 8,
    },
  },
};

export const Absorbed: Story = {
  args: {
    character: mockCharacter,
    absorbed: true,
  },
};
