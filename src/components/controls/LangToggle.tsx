import { useTranslation } from 'react-i18next';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { ControlTooltip } from './ControlTooltip';

export const LangToggle = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const next = current === 'en' ? 'es' : 'en';

  const swap = () => i18n.changeLanguage(next);

  return (
    <ControlTooltip label={t('controls.language')} onAction={swap}>
      <LiquidGlass
        as="button"
        type="button"
        radius={999}
        refractionHeight={12}
        refractionAmount={18}
        chromaticAberration={5}
        blur={1}
        className="is-press px-3 py-2 text-xs font-semibold uppercase tracking-wider"
        onClick={swap}
        ariaLabel={t('controls.language')}
      >
        {current}
      </LiquidGlass>
    </ControlTooltip>
  );
};
