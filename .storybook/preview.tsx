import React from 'react';
import type { Preview } from '@storybook/react-vite';

import { ThemeProvider } from '../src/context/ThemeContext';

import '../src/theme/tokens.css';

// Basic light theme background to align with app base
export const parameters: Preview['parameters'] = {
  backgrounds: {
    default: 'light',
    values: [
      { name: 'light', value: '#ffffff' },
      { name: 'dim', value: '#f4f6f8' },
      { name: 'dark', value: '#111827' },
    ],
  },
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default preview;
