import type { Meta, StoryObj } from '@storybook/react-vite';

import { Skeleton } from './Skeleton';

const meta: Meta<typeof Skeleton> = {
  title: 'Atoms/Skeleton',
  component: Skeleton,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const Base: Story = {};
export const Circle: Story = { args: { circle: true, width: 48, height: 48 } };
