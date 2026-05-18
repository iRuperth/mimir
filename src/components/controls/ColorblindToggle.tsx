import { useTranslation } from 'react-i18next';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface Props {
  active: boolean;
  onToggle: () => void;
}

export const ColorblindToggle = ({ active, onToggle }: Props) => {
  const { t } = useTranslation();
  return (
    <LiquidGlass
      as="button"
      type="button"
      radius={999}
      refractionHeight={12}
      refractionAmount={18}
      chromaticAberration={5}
      blur={1}
      className={`is-press p-2 ${active ? 'is-active' : ''}`}
      onClick={onToggle}
      ariaPressed={active}
      ariaLabel={t('controls.colorblind')}
      title={t('controls.colorblind')}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 0 0 20z" fill="currentColor" />
      </svg>
    </LiquidGlass>
  );
};
