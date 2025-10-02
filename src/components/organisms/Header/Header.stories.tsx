import type { Meta, StoryObj } from '@storybook/react-vite';

import { Header } from './Header';

const meta: Meta<typeof Header> = {
  title: 'Organisms/Header',
  component: Header,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Main application header with logo, navigation, and user menu. Requires multiple context providers (Auth, Game, Modal).',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Header>;

// Note: This component requires multiple context providers to work properly
// In a real Storybook setup, you'd wrap with mock providers
export const Base: Story = {};
