import { useTranslation } from 'react-i18next';
import { config } from '@/config/env';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { SocialLinks } from './SocialLinks';

export const Footer = () => {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 px-6 pb-6">
      <LiquidGlass
        radius={20}
        refractionHeight={32}
        refractionAmount={40}
        chromaticAberration={10}
        depthEffect={0.3}
        blur={2}
        className="mx-auto w-full max-w-[1480px] px-6 md:px-10 py-6"
        contentClassName="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-center"
      >
        <p className="text-sm text-text-soft text-center md:text-left">
          {`\u00A9 ${year} ${config.owner.name}. ${t('footer.rights')}`}
        </p>

        <p className="text-xs text-text-soft text-center">
          {t('footer.made')}{' '}
          <span aria-hidden="true" className="text-accent">
            &#9829;
          </span>{' '}
          {t('footer.and')} React
        </p>

        <div className="flex justify-center md:justify-end">
          <SocialLinks />
        </div>
      </LiquidGlass>
    </footer>
  );
};
