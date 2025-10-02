import type { Meta, StoryObj } from '@storybook/react-vite';

import { PlayerCard } from './PlayerCard';

const meta: Meta<typeof PlayerCard> = {
  title: 'Molecules/PlayerCard',
  component: PlayerCard,
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof PlayerCard>;

export const Player: Story = {
  args: {
    name: 'Sarah Coder',
    level: 8,
    health: 85,
    stamina: 70,
    avatarUrl: 'https://via.placeholder.com/64x64/6366f1/ffffff?text=SC',
    variant: 'player',
  },
};

export const Enemy: Story = {
  args: {
    name: 'Bug Monster',
    level: 6,
    health: 45,
    stamina: 90,
    variant: 'enemy',
  },
};

export const Active: Story = {
  args: {
    name: 'Active Player',
    level: 3,
    health: 100,
    stamina: 100,
    isActive: true,
    avatarUrl: 'https://via.placeholder.com/64x64/22c55e/ffffff?text=AP',
  },
};

export const Syncing: Story = {
  args: {
    name: 'Loading Player',
    level: 1,
    health: 100,
    stamina: 100,
    syncing: true,
  },
};
