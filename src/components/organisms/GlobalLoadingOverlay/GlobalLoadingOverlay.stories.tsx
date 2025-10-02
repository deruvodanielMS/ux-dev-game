import type { Meta, StoryObj } from '@storybook/react-vite';

import { GlobalLoadingOverlay } from './GlobalLoadingOverlay';

const meta: Meta<typeof GlobalLoadingOverlay> = {
  title: 'Organisms/GlobalLoadingOverlay',
  component: GlobalLoadingOverlay,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Global loading overlay that shows when network activity is in progress. Requires NetworkActivityProvider context.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof GlobalLoadingOverlay>;

// Note: This component requires NetworkActivityProvider context to work properly
// In a real Storybook setup, you'd wrap with a mock provider that simulates busy state
export const Base: Story = {};
