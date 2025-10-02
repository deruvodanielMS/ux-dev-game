import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  args: {
    children: 'Button',
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Ghost: Story = {
  args: {
    variant: 'ghost',
  },
};

export const Plain: Story = {
  args: {
    variant: 'plain',
  },
};

export const Loading: Story = {
  args: {
    loading: true,
  },
};
