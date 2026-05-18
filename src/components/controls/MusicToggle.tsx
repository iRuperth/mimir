import { useTranslation } from 'react-i18next';
import { useAudio } from '@/hooks/useAudio';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

export const MusicToggle = () => {
  const { t } = useTranslation();
  const { playing, toggle, available } = useAudio();

  if (!available) return null;

  const label = playing ? t('controls.music_off') : t('controls.music_on');

  return (
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
      title={label}
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
  );
};
