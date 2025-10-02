import type { Meta, StoryObj } from '@storybook/react-vite';

import { Flex } from './Flex';

const meta: Meta<typeof Flex> = {
  title: 'Atoms/Layout/Flex',
  component: Flex,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: '400px', height: '200px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Flex>;

const FlexItem = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      background: 'var(--color-surface)',
      padding: 'var(--space-3)',
      borderRadius: 'var(--radius-sm)',
    }}
  >
    {children}
  </div>
);

export const Row: Story = {
  args: {
    direction: 'row',
    gap: 4,
    children: (
      <>
        <FlexItem>Item 1</FlexItem>
        <FlexItem>Item 2</FlexItem>
        <FlexItem>Item 3</FlexItem>
      </>
    ),
  },
};

export const Column: Story = {
  args: {
    direction: 'column',
    gap: 3,
    children: (
      <>
        <FlexItem>Item A</FlexItem>
        <FlexItem>Item B</FlexItem>
      </>
    ),
  },
};

export const CenterAligned: Story = {
  args: {
    justify: 'center',
    align: 'center',
    gap: 4,
    children: <FlexItem>Centered</FlexItem>,
  },
};
