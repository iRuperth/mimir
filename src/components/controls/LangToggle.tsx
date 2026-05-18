import { useTranslation } from 'react-i18next';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

export const LangToggle = () => {
  const { i18n, t } = useTranslation();
  const current = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const next = current === 'en' ? 'es' : 'en';

  return (
    <LiquidGlass
      as="button"
      type="button"
      radius={999}
      refractionHeight={12}
      refractionAmount={18}
      chromaticAberration={5}
      blur={1}
      className="is-press px-3 py-2 text-xs font-semibold uppercase tracking-wider"
      onClick={() => i18n.changeLanguage(next)}
      ariaLabel={t('controls.language')}
      title={t('controls.language')}
    >
      {current}
    </LiquidGlass>
  );
};
