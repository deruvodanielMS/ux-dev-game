import React from 'react';
import { useTranslation } from 'react-i18next';

import type { ThemeSwitchProps } from '@/types/components-settings';

import { useTheme } from '@/context/ThemeContext';

import styles from './ThemeSwitch.module.css';

export const ThemeSwitch = React.forwardRef<
  HTMLButtonElement,
  ThemeSwitchProps
>(({ size = 'md', showLabels = true, className = '', onChange }, ref) => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useTranslation();

  const handleToggle = () => {
    toggleTheme();
    onChange?.(theme === 'light' ? 'dark' : 'light');
  };

  const isDark = theme === 'dark';
  const switchClasses = [styles.switch, styles[size], className]
    .filter(Boolean)
    .join(' ');

  const toggleClasses = [styles.toggle, isDark ? styles.active : '']
    .filter(Boolean)
    .join(' ');

  const knobClasses = [styles.knob, isDark ? styles.active : '']
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type="button"
      className={switchClasses}
      onClick={handleToggle}
      aria-label={t('theme.switch')}
      aria-checked={isDark}
      role="switch"
    >
      <div className={toggleClasses}>
        <div className={knobClasses}>{isDark ? '🌙' : '☀️'}</div>
      </div>
      {showLabels && (
        <div className={styles.labels}>
          <span className={styles.currentLabel}>
            {t(isDark ? 'theme.dark' : 'theme.light')}
          </span>
          <span className={styles.description}>{t('theme.switch')}</span>
        </div>
      )}
    </button>
  );
});

ThemeSwitch.displayName = 'ThemeSwitch';
