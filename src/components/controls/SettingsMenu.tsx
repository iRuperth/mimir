import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { LangToggle } from './LangToggle';
import { ThemeToggle } from './ThemeToggle';
import { ColorblindToggle } from './ColorblindToggle';
import { MusicToggle } from './MusicToggle';
import { broadcastTooltipOpen, onTooltipOpen } from '@/utils/tooltipBus';

interface Props {
  mode: 'light' | 'dark';
  onThemeToggle: () => void;
  colorblind: boolean;
  onColorblindToggle: () => void;
}

/* Single gear button that collapses every control (language, theme,
   colorblind, music) into one popover. Rendered through a portal so it
   escapes the navbar's clipping box, and wired into the shared tooltipBus
   so opening it closes the navbar dropdowns and vice versa. The controls
   inside keep their own ControlTooltip behaviour untouched. */
export const SettingsMenu = ({ mode, onThemeToggle, colorblind, onColorblindToggle }: Props) => {
  const { t } = useTranslation();
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<{ top: number; right: number } | null>(null);
  const closeTimer = useRef<number | null>(null);
  /* True while the cursor is over the gear or its open popover. Lets the
     tooltipBus listener tell apart a foreign dropdown opening (close us)
     from one of our own child controls broadcasting on hover (keep open). */
  const insideRef = useRef(false);

  const id = 'settings-menu';

  const cancelClose = () => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  };

  const measure = () => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setAnchor({ top: rect.bottom, right: window.innerWidth - rect.right });
  };

  const handleOpen = () => {
    cancelClose();
    insideRef.current = true;
    measure();
    setOpen(true);
    broadcastTooltipOpen(id);
  };

  const scheduleClose = () => {
    cancelClose();
    insideRef.current = false;
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 180);
  };

  useEffect(() => () => cancelClose(), []);

  /* A foreign dropdown opening closes this menu — but our own child
     controls (LangToggle, etc.) also broadcast on hover; those fire while
     the cursor is inside us, so ignore the bus in that case. */
  useEffect(
    () =>
      onTooltipOpen((openedId) => {
        if (openedId !== id && !insideRef.current) {
          cancelClose();
          setOpen(false);
        }
      }),
    [],
  );

  useEffect(() => {
    if (!open) return;
    const update = () => measure();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={handleOpen}
      onMouseLeave={scheduleClose}
      onFocus={handleOpen}
      onBlur={scheduleClose}
    >
      <LiquidGlass
        as="button"
        type="button"
        ref={triggerRef as unknown as React.Ref<HTMLElement>}
        radius={999}
        refractionHeight={12}
        refractionAmount={18}
        chromaticAberration={5}
        blur={1}
        className={`is-press p-2 ${open ? 'is-active' : ''}`}
        onClick={() => (open ? setOpen(false) : handleOpen())}
        ariaLabel={t('controls.settings')}
        ariaPressed={open}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      </LiquidGlass>

      {open && anchor && typeof document !== 'undefined' &&
        createPortal(
          <div
            onMouseEnter={handleOpen}
            onMouseLeave={scheduleClose}
            style={{
              position: 'fixed',
              top: anchor.top,
              right: anchor.right,
              zIndex: 60,
              paddingTop: 24,
            }}
          >
            <LiquidGlass
              as="div"
              radius={28}
              refractionHeight={18}
              refractionAmount={28}
              chromaticAberration={7}
              blur={1.5}
              className="p-2"
              contentClassName="flex items-center gap-2"
            >
              <LangToggle />
              <ThemeToggle mode={mode} onToggle={onThemeToggle} />
              <ColorblindToggle active={colorblind} onToggle={onColorblindToggle} />
              <MusicToggle />
            </LiquidGlass>
          </div>,
          document.body,
        )}
    </div>
  );
};
