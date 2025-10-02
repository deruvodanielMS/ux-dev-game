import type { Meta, StoryObj } from '@storybook/react-vite';

import { UserMenu } from './UserMenu';

const meta: Meta<typeof UserMenu> = {
  title: 'Organisms/UserMenu',
  component: UserMenu,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'User dropdown/drawer menu with profile info and actions. Requires multiple context providers.',
      },
    },
  },
  args: {
    open: true,
    onClose: () => console.log('Menu closed'),
    level: 8,
    name: 'Sarah Developer',
    avatarUrl: 'https://via.placeholder.com/64x64/6366f1/ffffff?text=SD',
  },
};

export default meta;
type Story = StoryObj<typeof UserMenu>;

export const Open: Story = {
  args: {
    triggerRef: { current: null },
  },
};

export const WithoutAvatar: Story = {
  args: {
    triggerRef: { current: null },
    avatarUrl: null,
    name: 'John Coder',
  },
};
