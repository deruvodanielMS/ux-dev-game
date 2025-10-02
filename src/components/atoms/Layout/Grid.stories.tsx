import type { Meta, StoryObj } from '@storybook/react-vite';

import { Grid } from './Grid';

const meta: Meta<typeof Grid> = {
  title: 'Atoms/Layout/Grid',
  component: Grid,
  parameters: { layout: 'centered' },
  decorators: [
    (Story) => (
      <div style={{ width: '400px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Grid>;

const GridItem = ({ children }: { children: React.ReactNode }) => (
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

export const TwoColumns: Story = {
  args: {
    cols: 2,
    gap: 4,
    children: (
      <>
        <GridItem>Item 1</GridItem>
        <GridItem>Item 2</GridItem>
        <GridItem>Item 3</GridItem>
        <GridItem>Item 4</GridItem>
      </>
    ),
  },
};

export const ThreeColumns: Story = {
  args: {
    cols: 3,
    gap: 3,
    children: (
      <>
        <GridItem>A</GridItem>
        <GridItem>B</GridItem>
        <GridItem>C</GridItem>
      </>
    ),
  },
};
