import type { Meta, StoryObj } from '@storybook/react-vite';

import { AvatarUploader } from './AvatarUploader';

const meta: Meta<typeof AvatarUploader> = {
  title: 'Molecules/AvatarUploader',
  component: AvatarUploader,
  parameters: { layout: 'centered' },
  args: {
    onFileSelected: (file) => console.log('File selected:', file.name),
    onValidationError: (msg) => console.log('Validation error:', msg),
    onError: (err) => console.log('Error:', err),
  },
};

export default meta;
type Story = StoryObj<typeof AvatarUploader>;

export const Base: Story = {};

export const WithInitialAvatar: Story = {
  args: {
    initialAvatar:
      'https://via.placeholder.com/120x120/6366f1/ffffff?text=Avatar',
    initialLevel: 5,
  },
};

export const WithLevel: Story = {
  args: {
    initialLevel: 12,
  },
};
