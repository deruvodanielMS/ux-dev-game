import type { Meta, StoryObj } from '@storybook/react-vite';

import { AuthButton } from './AuthButton';

const meta: Meta<typeof AuthButton> = {
  title: 'Organisms/AuthButton',
  component: AuthButton,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Auth button that handles login/logout with Auth0. Requires Auth0Provider context.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof AuthButton>;

// Note: This component requires Auth0Provider context to work properly
// In a real Storybook setup, you'd wrap with a mock provider
export const Base: Story = {};
