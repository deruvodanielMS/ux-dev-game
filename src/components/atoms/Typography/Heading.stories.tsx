import type { Meta, StoryObj } from '@storybook/react-vite';

import { Heading } from './Heading';

const meta: Meta<typeof Heading> = {
  title: 'Atoms/Typography/Heading',
  component: Heading,
  parameters: { layout: 'centered' },
  args: { children: 'Sample Heading' },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const H1: Story = { args: { level: 'h1' } };
export const H2: Story = { args: { level: 'h2' } };
export const H3: Story = { args: { level: 'h3' } };
export const CustomSize: Story = { args: { level: 'h3', size: 'xl' } };
export const CustomWeight: Story = { args: { level: 'h2', weight: 'normal' } };
