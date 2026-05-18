import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { config } from '@/config/env';
import { visibleCategories } from '@/config/projects';
import { LangToggle } from '@/components/controls/LangToggle';
import { ThemeToggle } from '@/components/controls/ThemeToggle';
import { ColorblindToggle } from '@/components/controls/ColorblindToggle';
import { MusicToggle } from '@/components/controls/MusicToggle';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface Props {
  mode: 'light' | 'dark';
  onThemeToggle: () => void;
  colorblind: boolean;
  onColorblindToggle: () => void;
}

const links = [
  { href: '#about', key: 'about' },
  { href: '#projects', key: 'projects' },
  { href: '#contact', key: 'contact' },
] as const;

const emitFilter = (id: string | 'all') => {
  window.dispatchEvent(new CustomEvent('mimir:filter', { detail: id }));
};

export const Navbar = ({ mode, onThemeToggle, colorblind, onColorblindToggle }: Props) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const projectsRef = useRef<HTMLAnchorElement | null>(null);
  const [anchor, setAnchor] = useState<{ top: number; left: number } | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const openDropdown = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setDropdownOpen(true);
  };

  const scheduleClose = () => {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setDropdownOpen(false);
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
    if (!dropdownOpen) return;
    const update = () => {
      const el = projectsRef.current;
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
  }, [dropdownOpen]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDropdownOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [dropdownOpen]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goToProjects = (id: string | 'all') => {
    setDropdownOpen(false);
    emitFilter(id);
    requestAnimationFrame(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' });
    });
  };

  const cats = visibleCategories(lang);

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
            const isProjects = l.key === 'projects';
            return (
              <li key={l.key}>
                <div
                  className="inline-flex"
                  onMouseEnter={isProjects ? openDropdown : undefined}
                  onMouseLeave={isProjects ? scheduleClose : undefined}
                  onFocus={isProjects ? openDropdown : undefined}
                  onBlur={isProjects ? scheduleClose : undefined}
                >
                  <LiquidGlass
                    as="a"
                    href={l.href}
                    ref={isProjects ? (projectsRef as unknown as React.Ref<HTMLElement>) : undefined}
                    radius={999}
                    refractionHeight={14}
                    refractionAmount={20}
                    chromaticAberration={6}
                    blur={1}
                    className={`is-press inline-flex items-center px-4 py-1.5 text-text-soft hover:text-text ${
                      isProjects && dropdownOpen ? 'is-active text-text' : ''
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

      {dropdownOpen && anchor && createPortal(
        <ul
          data-nav-dropdown
          onMouseEnter={openDropdown}
          onMouseLeave={scheduleClose}
          style={{
            position: 'fixed',
            top: anchor.top,
            left: anchor.left,
            transform: 'translateX(-50%)',
            zIndex: 60,
            paddingTop: 24,
          }}
          className="flex flex-wrap items-center justify-center gap-2"
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
              onClick={() => goToProjects('all')}
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
                onClick={() => goToProjects(c.id)}
                className="is-press inline-flex items-center px-4 py-1.5 text-sm font-medium text-text-soft hover:text-text"
              >
                {c.label}
              </LiquidGlass>
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </header>
  );
};
