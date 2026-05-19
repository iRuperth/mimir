export interface GlassParams {
  radius: number;
  blur: number;
  refractionHeight: number;
  refractionAmount: number;
  chromaticAberration: number;
  saturate: number;
  brightness: number;
}

export interface GlassTuning {
  light: GlassParams;
  dark: GlassParams;
}

export const GLASS_PARAM_RANGES = {
  radius: { min: 8, max: 64, step: 1 },
  blur: { min: 0, max: 12, step: 0.5 },
  refractionHeight: { min: 4, max: 80, step: 1 },
  refractionAmount: { min: 4, max: 160, step: 1 },
  chromaticAberration: { min: 0, max: 30, step: 0.5 },
  saturate: { min: 0.8, max: 2.4, step: 0.05 },
  brightness: { min: 0.8, max: 1.6, step: 0.02 },
} as const;

export const GLASS_DEFAULTS: GlassTuning = {
  dark: {
    radius: 28,
    blur: 0.5,
    refractionHeight: 24,
    refractionAmount: 56,
    chromaticAberration: 10,
    saturate: 1.35,
    brightness: 1.04,
  },
  light: {
    radius: 28,
    blur: 0.5,
    refractionHeight: 24,
    refractionAmount: 56,
    chromaticAberration: 8,
    saturate: 1.2,
    brightness: 1.0,
  },
};

export const GLASS_STORAGE_KEY = 'mimir-glass-tuning-v1';
