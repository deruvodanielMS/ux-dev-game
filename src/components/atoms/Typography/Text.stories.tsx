import type { Meta, StoryObj } from '@storybook/react-vite';

import { Text } from './Text';

const meta: Meta<typeof Text> = {
  title: 'Atoms/Typography/Text',
  component: Text,
  parameters: { layout: 'centered' },
  args: { children: 'Sample text content' },
};

export default meta;
type Story = StoryObj<typeof Text>;

export const Base: Story = {};
export const Small: Story = { args: { size: 'sm' } };
export const Large: Story = { args: { size: 'lg' } };
export const Muted: Story = { args: { color: 'muted' } };
export const Primary: Story = { args: { color: 'primary' } };
export const Bold: Story = { args: { weight: 'bold' } };
export const AsSpan: Story = { args: { as: 'span' } };
