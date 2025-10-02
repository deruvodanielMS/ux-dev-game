import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type ThemeName = 'light' | 'dark';

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

const getInitialTheme = (): ThemeName => {
  if (typeof window === 'undefined') return 'light';

  try {
    const stored = localStorage.getItem('theme');
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // ignore localStorage errors
  }

  // Check system preference
  if (
    window.matchMedia &&
    window.matchMedia('(prefers-color-scheme: dark)').matches
  ) {
    return 'dark';
  }

  return 'light';
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeName>(getInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem('theme', theme);
    } catch {
      // ignore localStorage errors
    }
  }, [theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <div data-theme={theme}>{children}</div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
};
