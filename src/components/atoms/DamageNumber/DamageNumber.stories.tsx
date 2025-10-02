import type { Meta, StoryObj } from '@storybook/react-vite';

import { DamageNumber } from './DamageNumber';

const meta: Meta<typeof DamageNumber> = {
  title: 'Atoms/DamageNumber',
  component: DamageNumber,
  parameters: { layout: 'centered' },
  args: { id: '1', value: 25, top: 0, left: 0, onDone: () => {} },
};

export default meta;
type Story = StoryObj<typeof DamageNumber>;

export const Base: Story = {};
