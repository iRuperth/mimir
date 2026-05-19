import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  GLASS_DEFAULTS,
  GLASS_STORAGE_KEY,
  type GlassParams,
  type GlassTuning,
} from '@/config/glassTuning';

type Mode = 'light' | 'dark';

interface ContextValue {
  tuning: GlassTuning;
  mode: Mode;
  current: GlassParams;
  setParam: (mode: Mode, key: keyof GlassParams, value: number) => void;
  resetMode: (mode: Mode) => void;
  resetAll: () => void;
}

const Ctx = createContext<ContextValue | null>(null);

const readStored = (): GlassTuning => {
  if (typeof window === 'undefined') return GLASS_DEFAULTS;
  try {
    const raw = localStorage.getItem(GLASS_STORAGE_KEY);
    if (!raw) return GLASS_DEFAULTS;
    const parsed = JSON.parse(raw) as Partial<GlassTuning>;
    return {
      light: { ...GLASS_DEFAULTS.light, ...(parsed.light ?? {}) },
      dark: { ...GLASS_DEFAULTS.dark, ...(parsed.dark ?? {}) },
    };
  } catch {
    return GLASS_DEFAULTS;
  }
};

const readMode = (): Mode => {
  if (typeof document === 'undefined') return 'dark';
  return document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
};

interface ProviderProps {
  children: ReactNode;
}

export const GlassTuningProvider = ({ children }: ProviderProps) => {
  const [tuning, setTuning] = useState<GlassTuning>(readStored);
  const [mode, setMode] = useState<Mode>(readMode);

  useEffect(() => {
    const root = document.documentElement;
    const obs = new MutationObserver(() => setMode(readMode()));
    obs.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(GLASS_STORAGE_KEY, JSON.stringify(tuning));
    } catch {
      /* ignore quota */
    }
  }, [tuning]);

  const setParam = useCallback((targetMode: Mode, key: keyof GlassParams, value: number) => {
    setTuning((prev) => ({
      ...prev,
      [targetMode]: { ...prev[targetMode], [key]: value },
    }));
  }, []);

  const resetMode = useCallback((targetMode: Mode) => {
    setTuning((prev) => ({ ...prev, [targetMode]: GLASS_DEFAULTS[targetMode] }));
  }, []);

  const resetAll = useCallback(() => setTuning(GLASS_DEFAULTS), []);

  const value = useMemo<ContextValue>(
    () => ({ tuning, mode, current: tuning[mode], setParam, resetMode, resetAll }),
    [tuning, mode, setParam, resetMode, resetAll],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
};

export const useGlassTuning = (): ContextValue => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useGlassTuning must be used inside GlassTuningProvider');
  return ctx;
};

export const useGlassParams = (): GlassParams => useGlassTuning().current;
