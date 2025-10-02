import type { Meta, StoryObj } from '@storybook/react-vite';

import { LevelNode } from './LevelNode';

const meta: Meta<typeof LevelNode> = {
  title: 'Atoms/LevelNode',
  component: LevelNode,
  parameters: { layout: 'centered' },
  args: { id: 'lvl-3', index: 2, label: 'Level 3', stars: 2, state: 'current' },
};

export default meta;
type Story = StoryObj<typeof LevelNode>;

export const Base: Story = {};
export const Completed: Story = { args: { state: 'completed' } };
