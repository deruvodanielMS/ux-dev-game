import type { Meta, StoryObj } from '@storybook/react-vite';

import { CharacterList } from './CharacterList';

const meta: Meta<typeof CharacterList> = {
  title: 'Organisms/CharacterList',
  component: CharacterList,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'List of character cards for selection. Requires PlayersContext and usePlayers hook.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', maxHeight: '500px', overflow: 'auto' }}>
        <Story />
      </div>
    ),
  ],
  args: {
    onSelect: (id) => console.log('Selected character:', id),
  },
};

export default meta;
type Story = StoryObj<typeof CharacterList>;

export const Base: Story = {};

export const WithSelection: Story = {
  args: {
    selectedId: '1',
  },
};
