import { useState } from 'react';
import { useGlassTuning } from '@/hooks/useGlassTuning';
import { GLASS_PARAM_RANGES, type GlassParams } from '@/config/glassTuning';

interface FieldDef {
  key: keyof GlassParams;
  label: string;
}

const FIELDS: FieldDef[] = [
  { key: 'radius', label: 'Corner radius' },
  { key: 'blur', label: 'Blur radius' },
  { key: 'refractionHeight', label: 'Refraction height' },
  { key: 'refractionAmount', label: 'Refraction amount' },
  { key: 'chromaticAberration', label: 'Chromatic aberration' },
  { key: 'saturate', label: 'Saturation' },
  { key: 'brightness', label: 'Brightness' },
];

const formatValue = (v: number, step: number): string =>
  step >= 1 ? Math.round(v).toString() : v.toFixed(2);

export const GlassTuner = () => {
  const { tuning, mode, setParam, resetMode } = useGlassTuning();
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState<'light' | 'dark'>(mode);

  const params = tuning[editMode];

  return (
    <div className="glass-tuner-root fixed bottom-4 right-4 z-[70] pointer-events-auto">
      {!open ? (
        <button
          type="button"
          onClick={() => {
            setEditMode(mode);
            setOpen(true);
          }}
          className="liquid-glass is-press inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full text-text"
          style={{ borderRadius: 999 }}
          aria-label="Open liquid glass tuner"
        >
          <span aria-hidden="true">◐</span>
          <span>Tune glass</span>
        </button>
      ) : (
        <div
          role="dialog"
          aria-label="Liquid glass tuner"
          className="liquid-glass w-[280px] max-h-[80vh] overflow-y-auto p-4 text-text"
          style={{ borderRadius: 20 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold tracking-tight">Liquid glass</h2>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-text-soft hover:text-text text-base leading-none px-1"
              aria-label="Close tuner"
            >
              ×
            </button>
          </div>

          <div
            role="tablist"
            aria-label="Theme to tune"
            className="grid grid-cols-2 gap-1 p-1 mb-4 rounded-full"
            style={{ background: 'rgb(0 0 0 / 0.15)' }}
          >
            {(['light', 'dark'] as const).map((m) => (
              <button
                key={m}
                role="tab"
                aria-selected={editMode === m}
                onClick={() => setEditMode(m)}
                className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                  editMode === m ? 'bg-accent text-white' : 'text-text-soft hover:text-text'
                }`}
              >
                {m === 'light' ? 'Light' : 'Dark'}
                {mode === m ? ' ●' : ''}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            {FIELDS.map(({ key, label }) => {
              const range = GLASS_PARAM_RANGES[key];
              const value = params[key];
              return (
                <label key={key} className="flex flex-col gap-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-text-soft">{label}</span>
                    <span className="font-mono tabular-nums">
                      {formatValue(value, range.step)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={range.min}
                    max={range.max}
                    step={range.step}
                    value={value}
                    onChange={(e) => setParam(editMode, key, Number(e.target.value))}
                    className="w-full accent-accent"
                    aria-label={`${label} for ${editMode} mode`}
                  />
                </label>
              );
            })}
          </div>

          <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => resetMode(editMode)}
              className="text-xs text-text-soft hover:text-text underline-offset-2 hover:underline"
            >
              Reset {editMode}
            </button>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(JSON.stringify(tuning, null, 2));
              }}
              className="text-xs text-text-soft hover:text-text underline-offset-2 hover:underline"
              title="Copy current tuning JSON"
            >
              Copy JSON
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
