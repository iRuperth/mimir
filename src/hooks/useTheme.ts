import { useCallback, useEffect, useState } from 'react';
import { config } from '@/config/env';

type Mode = 'light' | 'dark';
const STORAGE_KEY = 'mimir-theme';
const CB_KEY = 'mimir-cb';

const resolveDefault = (): Mode => {
  if (typeof window === 'undefined') return 'dark';
  const stored = localStorage.getItem(STORAGE_KEY) as Mode | null;
  if (stored === 'light' || stored === 'dark') return stored;
  if (config.theme.default === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return config.theme.default;
};

export const useTheme = () => {
  const [mode, setMode] = useState<Mode>(resolveDefault);
  const [colorblind, setColorblind] = useState<boolean>(() =>
    typeof window === 'undefined' ? false : localStorage.getItem(CB_KEY) === 'true'
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', mode);
    localStorage.setItem(STORAGE_KEY, mode);
  }, [mode]);

  useEffect(() => {
    document.documentElement.setAttribute('data-cb', String(colorblind));
    localStorage.setItem(CB_KEY, String(colorblind));
  }, [colorblind]);

  const toggle = useCallback(() => setMode((m) => (m === 'dark' ? 'light' : 'dark')), []);
  const toggleColorblind = useCallback(() => setColorblind((v) => !v), []);

  return { mode, toggle, colorblind, toggleColorblind };
};
