import { useTranslation } from 'react-i18next';
import { useAudio } from '@/hooks/useAudio';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ControlTooltip } from './ControlTooltip';

export const MusicToggle = () => {
  const { t } = useTranslation();
  const { playing, toggle, available, volume, setVolume } = useAudio();

  if (!available) return null;

  const label = playing ? t('controls.music_off') : t('controls.music_on');
  const volumePct = Math.round(volume * 100);

  /* Volume panel that appears below the button alongside the tooltip.
     Stays open while the cursor is inside group/control (which covers
     button + panel), so the user can drag the slider without it
     disappearing. */
  const volumePanel = (
    <LiquidGlass
      as="div"
      radius={20}
      refractionHeight={18}
      refractionAmount={28}
      chromaticAberration={7}
      blur={1.5}
      className="p-3 min-w-[180px]"
      contentClassName="flex flex-col gap-2"
    >
      <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-text-soft">
        <span>{t('controls.volume')}</span>
        <span className="text-text font-mono tabular-nums">{volumePct}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={volumePct}
        onChange={(e) => setVolume(Number(e.target.value) / 100)}
        aria-label={t('controls.volume')}
        className="w-full accent-accent"
      />
    </LiquidGlass>
  );

  return (
    <ControlTooltip label={label} extra={volumePanel} align="right" onAction={toggle}>
      <LiquidGlass
        as="button"
        type="button"
        radius={999}
        refractionHeight={12}
        refractionAmount={18}
        chromaticAberration={5}
        blur={1}
        className="is-press p-2"
        onClick={toggle}
        ariaLabel={label}
        ariaPressed={playing}
      >
        {playing ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5.14v13.72a1 1 0 0 0 1.55.83l10.4-6.86a1 1 0 0 0 0-1.66L9.55 4.31A1 1 0 0 0 8 5.14z" />
          </svg>
        )}
      </LiquidGlass>
    </ControlTooltip>
  );
};
