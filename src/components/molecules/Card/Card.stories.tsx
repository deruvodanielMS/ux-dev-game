import type { Meta, StoryObj } from '@storybook/react-vite';

import { Card } from './Card';

const meta: Meta<typeof Card> = {
  title: 'Molecules/Card',
  component: Card,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const CodeReview: Story = {
  args: {
    id: 'code-review',
    onPlay: () => {},
  },
};

export const BugFix: Story = {
  args: {
    id: 'bug-fix',
    onPlay: () => {},
  },
};

export const Refactor: Story = {
  args: {
    id: 'refactor',
    onPlay: () => {},
  },
};
