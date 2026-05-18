import { useTranslation } from 'react-i18next';
import { visibleCategories } from '@/config/projects';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

type CategoryId = string | 'all';

interface Props {
  active: CategoryId;
  onChange: (id: CategoryId) => void;
}

export const Categories = ({ active, onChange }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const cats = visibleCategories(lang);

  const items: Array<{ id: CategoryId; label: string }> = [
    { id: 'all', label: t('projects.all') },
    ...cats.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <ul className="flex flex-wrap gap-2" role="tablist" aria-label={t('projects.title')}>
      {items.map((c) => {
        const isActive = c.id === active;
        return (
          <li key={c.id}>
            <LiquidGlass
              as="button"
              type="button"
              role="tab"
              radius={999}
              refractionHeight={14}
              refractionAmount={20}
              chromaticAberration={6}
              blur={1}
              ariaSelected={isActive}
              onClick={() => onChange(c.id)}
              className={`is-press px-4 py-1.5 text-sm font-medium transition-colors ${
                isActive
                  ? 'is-active text-text'
                  : 'text-text-soft hover:text-text'
              }`}
            >
              {c.label}
            </LiquidGlass>
          </li>
        );
      })}
    </ul>
  );
};
