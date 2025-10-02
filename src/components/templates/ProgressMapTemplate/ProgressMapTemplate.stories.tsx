import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProgressMapTemplate } from './ProgressMapTemplate';
import { Heading } from '../../atoms/Typography/Heading';
import { Text } from '../../atoms/Typography/Text';

const meta: Meta<typeof ProgressMapTemplate> = {
  title: 'Templates/ProgressMapTemplate',
  component: ProgressMapTemplate,
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj<typeof ProgressMapTemplate>;

const mockMap = (
  <div
    style={{
      height: '200px',
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'var(--color-muted)',
    }}
  >
    [Progress Map Component]
  </div>
);

const mockSummary = (
  <div
    style={{
      padding: 'var(--space-4)',
      background: 'var(--color-surface)',
      borderRadius: 'var(--radius-md)',
    }}
  >
    <Text size="sm" color="muted">
      Progress summary and stats would go here
    </Text>
  </div>
);

export const Base: Story = {
  args: {
    title: <Heading level="h1">Progress Map</Heading>,
    subtitle: <Text color="muted">Track your coding journey</Text>,
    map: mockMap,
    summary: mockSummary,
  },
};
