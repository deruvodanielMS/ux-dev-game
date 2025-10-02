import type { Meta, StoryObj } from '@storybook/react-vite';

import { TurnIndicator } from './TurnIndicator';

const meta: Meta<typeof TurnIndicator> = {
  title: 'Atoms/TurnIndicator',
  component: TurnIndicator,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof TurnIndicator>;

export const Player: Story = { args: { turn: 'player' } };
export const Enemy: Story = { args: { turn: 'enemy' } };
