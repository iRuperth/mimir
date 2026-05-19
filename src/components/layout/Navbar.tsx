import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { config } from '@/config/env';
import { groupedSkills, visibleCategories } from '@/config/projects';
import { LangToggle } from '@/components/controls/LangToggle';
import { ThemeToggle } from '@/components/controls/ThemeToggle';
import { ColorblindToggle } from '@/components/controls/ColorblindToggle';
import { MusicToggle } from '@/components/controls/MusicToggle';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { scrollToElementInstant, scrollToYInstant } from '@/utils/scroll';
import { broadcastTooltipOpen, onTooltipOpen } from '@/utils/tooltipBus';

interface Props {
  mode: 'light' | 'dark';
  onThemeToggle: () => void;
  colorblind: boolean;
  onColorblindToggle: () => void;
}

const links = [
  { href: '#about', key: 'about' },
  { href: '#projects', key: 'projects' },
  { href: '#skills', key: 'skills' },
  { href: '#contact', key: 'contact' },
] as const;

const NAV_OFFSET = -80;

type DropdownKey = 'projects' | 'skills' | 'contact';

interface ContactLink {
  key: string;
  label: string;
  href: string;
}

/* Build the visible Contact dropdown entries from the socials config.
   Anything left empty in .env is filtered out, so the dropdown stays
   in sync without code changes. Email and phone get the right URL
   scheme automatically; everything else is treated as an https URL. */
const buildContactLinks = (
  socials: {
    github: string;
    linkedin: string;
    email: string;
    phone: string;
    x: string;
    instagram: string;
  },
  labels: { github: string; linkedin: string; email: string; phone: string; x: string; instagram: string },
): ContactLink[] => {
  const entries: ContactLink[] = [];
  if (socials.github) entries.push({ key: 'github', label: labels.github, href: socials.github });
  if (socials.linkedin) entries.push({ key: 'linkedin', label: labels.linkedin, href: socials.linkedin });
  if (socials.email) entries.push({ key: 'email', label: labels.email, href: `mailto:${socials.email}` });
  if (socials.phone) entries.push({ key: 'phone', label: labels.phone, href: `tel:${socials.phone.replace(/\s+/g, '')}` });
  if (socials.x) entries.push({ key: 'x', label: labels.x, href: socials.x });
  if (socials.instagram) entries.push({ key: 'instagram', label: labels.instagram, href: socials.instagram });
  return entries;
};

export const Navbar = ({ mode, onThemeToggle, colorblind, onColorblindToggle }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<DropdownKey | null>(null);
  const projectsRef = useRef<HTMLAnchorElement | null>(null);
  const skillsRef = useRef<HTMLAnchorElement | null>(null);
  const contactRef = useRef<HTMLAnchorElement | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const openDropdownFor = (which: DropdownKey) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(which);
    broadcastTooltipOpen(`nav:${which}`);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpenDropdown(null);
      closeTimerRef.current = null;
    }, 180);
  };

  useEffect(() => () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!openDropdown) return;
    const update = () => {
      const el =
        openDropdown === 'projects'
          ? projectsRef.current
          : openDropdown === 'skills'
            ? skillsRef.current
            : contactRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setAnchor({ top: rect.bottom, left: rect.left + rect.width / 2 });
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!openDropdown) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenDropdown(null);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [openDropdown]);

  /* When any other tooltip (a control button) opens, close the navbar
     dropdown immediately — same coordination rule used by the controls. */
  useEffect(
    () =>
      onTooltipOpen((openedId) => {
        if (!openedId.startsWith('nav:')) {
          if (closeTimerRef.current) {
            clearTimeout(closeTimerRef.current);
            closeTimerRef.current = null;
          }
          setOpenDropdown(null);
        }
      }),
    [],
  );

  const scrollToTop = () => scrollToYInstant(0);

  const goToCategory = (id: string | 'all') => {
    setOpenDropdown(null);
    const target = id === 'all' ? 'projects' : `category-${id}`;
    requestAnimationFrame(() => scrollToElementInstant(target, NAV_OFFSET));
  };

  const goToSkillGroup = (id: string) => {
    setOpenDropdown(null);
    requestAnimationFrame(() => {
      scrollToElementInstant('skills', NAV_OFFSET);
      window.dispatchEvent(new CustomEvent('mimir:skill-group', { detail: id }));
    });
  };

  const handleAnchor = (e: React.MouseEvent<HTMLElement>, href: string) => {
    if (!href.startsWith('#')) return;
    e.preventDefault();
    scrollToElementInstant(href.slice(1), NAV_OFFSET);
  };

  const cats = visibleCategories(lang);
  const skillNavGroups = groupedSkills(lang).map((g) => ({ id: g.id, label: g.label }));
  const contactLinks = buildContactLinks(config.socials, {
    github: t('socials.github', 'GitHub'),
    linkedin: t('socials.linkedin', 'LinkedIn'),
    email: t('socials.email', 'Email'),
    phone: t('socials.phone', 'Phone'),
    x: t('socials.x', 'X'),
    instagram: t('socials.instagram', 'Instagram'),
  });

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 flex justify-center px-4 transition-all duration-300 ${
        scrolled ? 'pt-2' : 'pt-4'
      }`}
    >
      <LiquidGlass
        as="nav"
        radius={999}
        refractionHeight={24}
        refractionAmount={32}
        chromaticAberration={8}
        depthEffect={0.3}
        blur={2}
        saturate={1.4}
        brightness={1.08}
        className={`w-full max-w-6xl px-4 md:px-6 transition-all duration-300 ${
          scrolled ? 'py-2' : 'py-3'
        }`}
        contentClassName="grid grid-cols-[1fr_auto_1fr] items-center gap-4"
        ariaLabel="Main navigation"
      >
        <div className="flex items-center justify-start">
          <button
            type="button"
            onClick={scrollToTop}
            className="font-bold text-base md:text-lg tracking-tight hover:scale-105 active:scale-95 transition-transform"
            aria-label={t('nav.home')}
          >
            {config.owner.name}
          </button>
        </div>

        <ul className="hidden md:flex items-center justify-center gap-2 text-sm font-medium">
          {links.map((l) => {
            const dropdownKey: DropdownKey | null =
              l.key === 'projects'
                ? 'projects'
                : l.key === 'skills'
                  ? 'skills'
                  : l.key === 'contact' && contactLinks.length > 0
                    ? 'contact'
                    : null;
            const hasDropdown = dropdownKey !== null;
            const isOpen = hasDropdown && openDropdown === dropdownKey;
            const ref =
              dropdownKey === 'projects'
                ? projectsRef
                : dropdownKey === 'skills'
                  ? skillsRef
                  : dropdownKey === 'contact'
                    ? contactRef
                    : null;
            return (
              <li key={l.key}>
                <div
                  className="inline-flex"
                  onMouseEnter={hasDropdown ? () => openDropdownFor(dropdownKey) : undefined}
                  onMouseLeave={hasDropdown ? scheduleClose : undefined}
                  onFocus={hasDropdown ? () => openDropdownFor(dropdownKey) : undefined}
                  onBlur={hasDropdown ? scheduleClose : undefined}
                >
                  <LiquidGlass
                    as="a"
                    href={l.href}
                    ref={ref ? (ref as unknown as React.Ref<HTMLElement>) : undefined}
                    radius={999}
                    refractionHeight={14}
                    refractionAmount={20}
                    chromaticAberration={6}
                    blur={1}
                    onClick={(e) => handleAnchor(e, l.href)}
                    className={`is-press inline-flex items-center px-4 py-1.5 text-text-soft hover:text-text ${
                      isOpen ? 'is-active text-text' : ''
                    }`}
                  >
                    {t(`nav.${l.key}`)}
                  </LiquidGlass>
                </div>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-end gap-2">
          <LangToggle />
          <ThemeToggle mode={mode} onToggle={onThemeToggle} />
          <ColorblindToggle active={colorblind} onToggle={onColorblindToggle} />
          <MusicToggle />
        </div>
      </LiquidGlass>

      {openDropdown === 'projects' && anchor && createPortal(
        <ul
          data-nav-dropdown
          onMouseEnter={() => openDropdownFor('projects')}
          onMouseLeave={scheduleClose}
          style={{
            position: 'fixed',
            top: anchor.top,
            left: anchor.left,
            transform: 'translateX(-50%)',
            zIndex: 60,
            paddingTop: 24,
          }}
          className="flex flex-nowrap items-center gap-2 whitespace-nowrap"
        >
          <li>
            <LiquidGlass
              as="button"
              type="button"
              radius={999}
              refractionHeight={14}
              refractionAmount={20}
              chromaticAberration={6}
              blur={1}
              onClick={() => goToCategory('all')}
              className="is-press inline-flex items-center px-4 py-1.5 text-sm font-medium text-text-soft hover:text-text"
            >
              {t('projects.all')}
            </LiquidGlass>
          </li>
          {cats.map((c) => (
            <li key={c.id}>
              <LiquidGlass
                as="button"
                type="button"
                radius={999}
                refractionHeight={14}
                refractionAmount={20}
                chromaticAberration={6}
                blur={1}
                onClick={() => goToCategory(c.id)}
                className="is-press inline-flex items-center px-4 py-1.5 text-sm font-medium text-text-soft hover:text-text"
              >
                {c.label}
              </LiquidGlass>
            </li>
          ))}
        </ul>,
        document.body,
      )}

      {openDropdown === 'skills' && anchor && createPortal(
        <ul
          data-nav-dropdown
          onMouseEnter={() => openDropdownFor('skills')}
          onMouseLeave={scheduleClose}
          style={{
            position: 'fixed',
            top: anchor.top,
            left: anchor.left,
            transform: 'translateX(-50%)',
            zIndex: 60,
            paddingTop: 24,
          }}
          className="flex flex-nowrap items-center gap-2 whitespace-nowrap"
        >
          {skillNavGroups.map((g) => (
            <li key={g.id}>
              <LiquidGlass
                as="button"
                type="button"
                radius={999}
                refractionHeight={14}
                refractionAmount={20}
                chromaticAberration={6}
                blur={1}
                onClick={() => goToSkillGroup(g.id)}
                className="is-press inline-flex items-center px-4 py-1.5 text-sm font-medium text-text-soft hover:text-text"
              >
                {g.label}
              </LiquidGlass>
            </li>
          ))}
        </ul>,
        document.body,
      )}

      {openDropdown === 'contact' && anchor && createPortal(
        <ul
          data-nav-dropdown
          onMouseEnter={() => openDropdownFor('contact')}
          onMouseLeave={scheduleClose}
          style={{
            position: 'fixed',
            top: anchor.top,
            left: anchor.left,
            transform: 'translateX(-50%)',
            zIndex: 60,
            paddingTop: 24,
          }}
          className="flex flex-nowrap items-center gap-2 whitespace-nowrap"
        >
          {contactLinks.map((c) => {
            const isExternal = c.href.startsWith('http');
            return (
              <li key={c.key}>
                <LiquidGlass
                  as="a"
                  href={c.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  radius={999}
                  refractionHeight={14}
                  refractionAmount={20}
                  chromaticAberration={6}
                  blur={1}
                  onClick={() => setOpenDropdown(null)}
                  className="is-press inline-flex items-center px-4 py-1.5 text-sm font-medium text-text-soft hover:text-text"
                >
                  {c.label}
                </LiquidGlass>
              </li>
            );
          })}
        </ul>,
        document.body,
      )}
    </header>
  );
};
