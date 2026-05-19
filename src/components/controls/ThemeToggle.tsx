import { useTranslation } from 'react-i18next';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ControlTooltip } from './ControlTooltip';

interface Props {
  mode: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeToggle = ({ mode, onToggle }: Props) => {
  const { t } = useTranslation();
  const isDark = mode === 'dark';
  const label = isDark ? t('controls.theme_light') : t('controls.theme_dark');

  return (
    <ControlTooltip label={label} onAction={onToggle}>
      <LiquidGlass
        as="button"
        type="button"
        radius={999}
        refractionHeight={12}
        refractionAmount={18}
        chromaticAberration={5}
        blur={1}
        className="is-press p-2"
        onClick={onToggle}
        ariaLabel={label}
      >
        {isDark ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          </svg>
        )}
      </LiquidGlass>
    </ControlTooltip>
  );
};
