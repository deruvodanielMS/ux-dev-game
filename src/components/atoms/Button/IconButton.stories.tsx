import type { Meta, StoryObj } from '@storybook/react-vite';

import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
  args: {
    ariaLabel: 'Settings',
    icon: <span>⚙️</span>,
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Plain: Story = { args: { variant: 'plain' } };
export const Disabled: Story = { args: { disabled: true } };
