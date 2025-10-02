import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusBar } from './StatusBar';

const meta: Meta<typeof StatusBar> = {
  title: 'Atoms/StatusBar',
  component: StatusBar,
  parameters: { layout: 'centered' },
  args: { label: 'HP', current: 40, max: 100 },
};

export default meta;
type Story = StoryObj<typeof StatusBar>;

export const Base: Story = {};
export const CustomColor: Story = { args: { color: 'var(--red)' } };
