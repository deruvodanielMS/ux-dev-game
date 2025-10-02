import React from 'react';

import type { SettingsSectionProps } from '@/types/components-settings';

import { Heading } from '@/components/atoms/Typography/Heading';
import { Text } from '@/components/atoms/Typography/Text';

import styles from './SettingsSection.module.css';

export const SettingsSection = React.forwardRef<
  HTMLDivElement,
  SettingsSectionProps
>(({ title, description, children, className = '' }, ref) => {
  const sectionClasses = [styles.section, className].filter(Boolean).join(' ');

  return (
    <div ref={ref} className={sectionClasses}>
      <div className={styles.header}>
        <Heading level="h3" className={styles.title}>
          {title}
        </Heading>
        {description && (
          <Text className={styles.description}>{description}</Text>
        )}
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  );
});

SettingsSection.displayName = 'SettingsSection';
