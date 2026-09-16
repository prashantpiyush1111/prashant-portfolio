import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);
const OPTIONS = ['light', 'dark', 'system'];

function getSystemDark() {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false;
}

function getStoredTheme() {
  const stored = localStorage.getItem('theme');
  return OPTIONS.includes(stored) ? stored : 'system';
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(getStoredTheme);
  const [systemDark, setSystemDark] = useState(getSystemDark);
  const dark = theme === 'dark' || (theme === 'system' && systemDark);

  useEffect(() => {
    const media = window.matchMedia?.('(prefers-color-scheme: dark)');
    const onChange = (event) => setSystemDark(event.matches);
    media?.addEventListener?.('change', onChange);
    return () => media?.removeEventListener?.('change', onChange);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }, [dark, theme]);

  const value = useMemo(() => ({
    theme,
    dark,
    setTheme,
    cycleTheme: () => setTheme((current) => OPTIONS[(OPTIONS.indexOf(current) + 1) % OPTIONS.length]),
    toggleTheme: () => setTheme((current) => current === 'dark' ? 'light' : current === 'light' ? 'system' : 'dark'),
    options: OPTIONS,
  }), [dark, theme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used inside ThemeProvider');
  return context;
}
