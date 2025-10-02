import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatDisplay } from './StatDisplay';

const meta: Meta<typeof StatDisplay> = {
  title: 'Molecules/StatDisplay',
  component: StatDisplay,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof StatDisplay>;

export const Base: Story = {
  args: {
    stats: {
      soft_skills: 80,
      tech_skills: 90,
      core_values: 75,
      creativity: 65,
      ai_level: 50,
    },
  },
};
