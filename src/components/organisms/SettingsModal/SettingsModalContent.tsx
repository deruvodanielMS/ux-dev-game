import React from 'react';
import { useTranslation } from 'react-i18next';

import { LanguageSelector } from '@/components/atoms/LanguageSelector/LanguageSelector';
import { SettingsSection } from '@/components/atoms/SettingsSection/SettingsSection';
import { ThemeSwitch } from '@/components/atoms/ThemeSwitch/ThemeSwitch';

import { AudioControls } from '../AudioControls/AudioControls';

export const SettingsModalContent: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Audio Settings */}
      <SettingsSection
        title={t('audio.toggle')}
        description={t('settings.audio.description')}
      >
        <AudioControls />
      </SettingsSection>

      {/* Theme Settings */}
      <SettingsSection
        title={t('theme.switch')}
        description={t('settings.theme.description')}
      >
        <ThemeSwitch size="md" showLabels={true} />
      </SettingsSection>

      {/* Language Settings */}
      <SettingsSection
        title="Idioma / Language"
        description={t('settings.language.description')}
      >
        <LanguageSelector variant="buttons" size="md" />
      </SettingsSection>
    </div>
  );
};
