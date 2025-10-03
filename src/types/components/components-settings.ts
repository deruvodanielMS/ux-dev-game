// ThemeSwitch component types
export interface ThemeSwitchProps {
  /** Tamaño del switch (opcional) */
  size?: 'sm' | 'md' | 'lg';
  /** Mostrar etiquetas de texto junto al switch */
  showLabels?: boolean;
  /** Clase CSS adicional */
  className?: string;
  /** Callback cuando cambia el tema (opcional, para casos especiales) */
  onChange?: (theme: 'light' | 'dark') => void;
}

// LanguageSelector component types
export interface Language {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export interface LanguageSelectorProps {
  /** Lista de idiomas disponibles */
  languages?: Language[];
  /** Mostrar como dropdown o botones inline */
  variant?: 'dropdown' | 'buttons';
  /** Tamaño del componente */
  size?: 'sm' | 'md' | 'lg';
  /** Clase CSS adicional */
  className?: string;
  /** Callback cuando cambia el idioma (opcional, para casos especiales) */
  onChange?: (languageCode: string) => void;
}

// SettingsSection component types
export interface SettingsSectionProps {
  /** Título de la sección */
  title: string;
  /** Descripción opcional */
  description?: string;
  /** Contenido de la sección */
  children: React.ReactNode;
  /** Clase CSS adicional */
  className?: string;
}
