import type { Meta, StoryObj } from '@storybook/react-vite';

import { Ladderboard } from './Ladderboard';

const meta: Meta<typeof Ladderboard> = {
  title: 'Organisms/Ladderboard',
  component: Ladderboard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Weekly ranking leaderboard showing player stats. Requires PlayersContext and usePlayers hook.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px', maxWidth: '100vw' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Ladderboard>;

// Note: This component requires PlayersContext to work properly
// In a real Storybook setup, you'd wrap with mock providers
export const Base: Story = {};
