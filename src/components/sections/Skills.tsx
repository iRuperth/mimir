import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { groupedSkills, projects, type SkillEntry } from '@/config/projects';
import { scrollToElementInstant } from '@/utils/scroll';

const headerVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const buttonContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.04, delayChildren: 0.05 } },
};

const buttonVariants = {
  hidden: { opacity: 0, y: 14, filter: 'blur(6px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] },
  },
};

interface SkillPillProps {
  skill: SkillEntry;
  isActive: boolean;
  onSelect: (name: string) => void;
}

const SkillPill = ({ skill, isActive, onSelect }: SkillPillProps) => (
  <motion.li
    initial={{ opacity: 0, y: 8, filter: 'blur(4px)' }}
    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
  >
    <LiquidGlass
      as="button"
      type="button"
      ariaPressed={isActive}
      radius={999}
      refractionHeight={12}
      refractionAmount={18}
      chromaticAberration={5}
      blur={1}
      onClick={() => onSelect(skill.name)}
      className={`is-press inline-flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? 'is-active text-text' : 'text-text-soft hover:text-text'
      }`}
    >
      {skill.icon && (
        <img
          src={skill.icon}
          alt=""
          aria-hidden="true"
          className="w-4 h-4 object-contain"
        />
      )}
      <span>{skill.name}</span>
    </LiquidGlass>
  </motion.li>
);

export const Skills = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const groups = groupedSkills(lang);
  const [activeId, setActiveId] = useState<string | null>(groups[0]?.id ?? null);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  const projectsBySkill = useMemo(() => {
    const map = new Map<string, { id: string; title: string; category: string }[]>();
    for (const p of projects) {
      const title = lang === 'es' ? p.title_es : p.title_en;
      for (const t of p.tools) {
        const arr = map.get(t) ?? [];
        arr.push({ id: p.id, title, category: p.category });
        map.set(t, arr);
      }
    }
    return map;
  }, [lang]);

  /* Allow the Navbar (or anything else) to switch the active group
     by dispatching a CustomEvent. The Navbar's Skills dropdown fires
     this after scrolling here so the right tab opens for the user. */
  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<string>;
      if (typeof ce.detail !== 'string') return;
      if (groups.some((g) => g.id === ce.detail)) {
        setActiveId(ce.detail);
        setSelectedSkill(null);
      }
    };
    window.addEventListener('mimir:skill-group', handler);
    return () => window.removeEventListener('mimir:skill-group', handler);
  }, [groups]);

  if (groups.length === 0) return null;

  const activeGroup = groups.find((g) => g.id === activeId) ?? groups[0];
  const relatedProjects = selectedSkill
    ? projectsBySkill.get(selectedSkill) ?? []
    : [];

  const handleSkillSelect = (name: string) => {
    setSelectedSkill((prev) => (prev === name ? null : name));
  };

  /* Reset the selected skill whenever the active group changes, because
     otherwise a stale pill from a hidden group stays "active" in
     state but isn't visible to clear it. */
  const handleGroupChange = (id: string) => {
    setActiveId(id);
    setSelectedSkill(null);
  };

  return (
    <div className="flex flex-col gap-12">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
        className="flex flex-col gap-5 max-w-3xl"
      >
        <motion.h2
          variants={headerVariants}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          {t('skills.title')}
        </motion.h2>
        <motion.p
          variants={headerVariants}
          className="text-lg md:text-xl text-text-soft leading-relaxed"
        >
          {t('skills.subtitle')}
        </motion.p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
        variants={buttonContainerVariants}
        className="flex flex-wrap gap-3"
        role="tablist"
        aria-label={t('skills.title')}
      >
        {groups.map((g) => {
          const isActive = activeGroup.id === g.id;
          return (
            <motion.div
              key={g.id}
              variants={buttonVariants}
              onMouseEnter={() => handleGroupChange(g.id)}
              onFocus={() => handleGroupChange(g.id)}
            >
              <LiquidGlass
                as="button"
                type="button"
                role="tab"
                ariaSelected={isActive}
                radius={999}
                refractionHeight={16}
                refractionAmount={28}
                chromaticAberration={8}
                blur={1.5}
                onClick={() => handleGroupChange(g.id)}
                className={`is-press inline-flex items-center px-5 py-3 text-base font-semibold transition-colors ${
                  isActive ? 'is-active text-text' : 'text-text-soft hover:text-text'
                }`}
              >
                {g.label}
              </LiquidGlass>
            </motion.div>
          );
        })}
      </motion.div>

      <div
        className="flex flex-col gap-6 min-h-[120px]"
        role="tabpanel"
        aria-label={activeGroup.label}
      >
        <AnimatePresence mode="wait">
          <motion.ul
            key={activeGroup.id}
            initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-wrap gap-2.5"
          >
            {activeGroup.skills.map((s) => (
              <SkillPill
                key={s.name}
                skill={s}
                isActive={selectedSkill === s.name}
                onSelect={handleSkillSelect}
              />
            ))}
          </motion.ul>
        </AnimatePresence>

        <AnimatePresence>
          {selectedSkill && relatedProjects.length > 0 && (
            <motion.div
              key={selectedSkill}
              initial={{ opacity: 0, y: 8, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-3"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-text-soft">
                {t('skills.usedIn')}{' '}
                <span className="text-text normal-case tracking-normal">
                  {selectedSkill}
                </span>
              </span>
              <ul className="flex flex-wrap gap-2">
                {relatedProjects.map((p) => (
                  <li key={p.id}>
                    <LiquidGlass
                      as="button"
                      type="button"
                      radius={999}
                      refractionHeight={10}
                      refractionAmount={14}
                      chromaticAberration={4}
                      blur={1}
                      onClick={() =>
                        scrollToElementInstant(`category-${p.category}`, -80)
                      }
                      className="is-press inline-flex items-center px-3 py-1.5 text-xs font-medium text-text-soft hover:text-text"
                      ariaLabel={`Go to project ${p.title}`}
                    >
                      {p.title}
                    </LiquidGlass>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
