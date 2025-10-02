import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import type {
  Language,
  LanguageSelectorProps,
} from '@/types/components-settings';

import styles from './LanguageSelector.module.css';

const DEFAULT_LANGUAGES: Language[] = [
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
];

export const LanguageSelector = React.forwardRef<
  HTMLDivElement,
  LanguageSelectorProps
>(
  (
    {
      languages = DEFAULT_LANGUAGES,
      variant = 'dropdown',
      size = 'md',
      className = '',
      onChange,
    },
    ref,
  ) => {
    const { i18n } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLanguage =
      languages.find((lang) => lang.code === i18n.language) || languages[0];

    const handleLanguageChange = (languageCode: string) => {
      i18n.changeLanguage(languageCode);
      onChange?.(languageCode);
      setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current &&
          !dropdownRef.current.contains(event.target as Node)
        ) {
          setIsOpen(false);
        }
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        return () =>
          document.removeEventListener('mousedown', handleClickOutside);
      }
    }, [isOpen]);

    // Handle keyboard navigation
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (!isOpen) return;

        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isOpen]);

    const selectorClasses = [styles.selector, styles[size], className]
      .filter(Boolean)
      .join(' ');

    if (variant === 'buttons') {
      return (
        <div ref={ref} className={selectorClasses}>
          <div className={styles.buttons}>
            {languages.map((language) => (
              <button
                key={language.code}
                type="button"
                className={`${styles.button} ${currentLanguage.code === language.code ? styles.active : ''}`}
                onClick={() => handleLanguageChange(language.code)}
                aria-label={`Switch to ${language.name}`}
              >
                <span
                  className={styles.flag}
                  role="img"
                  aria-label={language.name}
                >
                  {language.flag}
                </span>
                <span>{language.nativeName}</span>
              </button>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div ref={ref} className={selectorClasses}>
        <div className={styles.dropdown} ref={dropdownRef}>
          <button
            type="button"
            className={styles.trigger}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-label="Select language"
          >
            <span
              className={styles.flag}
              role="img"
              aria-label={currentLanguage.name}
            >
              {currentLanguage.flag}
            </span>
            <span className={styles.languageName}>
              {currentLanguage.nativeName}
            </span>
            <span className={`${styles.chevron} ${isOpen ? styles.open : ''}`}>
              ▼
            </span>
          </button>

          {isOpen && (
            <div
              className={styles.menu}
              role="listbox"
              aria-label="Language options"
            >
              {languages.map((language) => (
                <button
                  key={language.code}
                  type="button"
                  className={`${styles.menuItem} ${currentLanguage.code === language.code ? styles.active : ''}`}
                  onClick={() => handleLanguageChange(language.code)}
                  role="option"
                  aria-selected={currentLanguage.code === language.code}
                >
                  <span
                    className={styles.flag}
                    role="img"
                    aria-label={language.name}
                  >
                    {language.flag}
                  </span>
                  <div className={styles.languageDetails}>
                    <span className={styles.nativeName}>
                      {language.nativeName}
                    </span>
                    <span className={styles.englishName}>{language.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  },
);

LanguageSelector.displayName = 'LanguageSelector';
