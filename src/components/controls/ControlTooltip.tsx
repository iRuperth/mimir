import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { LiquidGlass } from '@/components/glass/LiquidGlass';
import { broadcastTooltipOpen, onTooltipOpen } from '@/utils/tooltipBus';

interface Props {
  label: string;
  children: ReactNode;
  extra?: ReactNode;
  align?: 'right' | 'left' | 'center';
  /* Action triggered when the label pill is clicked. If provided, the
     pill renders as a real button (just like a navbar dropdown item)
     instead of a static label. Usually mirrors the trigger button's
     action so users can act from either surface. */
  onAction?: () => void;
}

interface Anchor {
  top: number;
  left: number;
  width: number;
}

/* Hover/focus tooltip rendered through a portal so it escapes the
   navbar's overflow-hidden box (same trick the Navbar dropdowns use).
   Shares the global tooltipBus with the Navbar dropdowns: any open
   anywhere closes everything else. The pill className matches the
   navbar dropdown items verbatim so they read as the same UI family. */
export const ControlTooltip = ({ label, children, extra, align = 'center', onAction }: Props) => {
  const id = useId();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const closeTimer = useRef<number | null>(null);

  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const measureAnchor = useCallback(() => {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setAnchor({ top: rect.bottom, left: rect.left, width: rect.width });
  }, []);

  const handleEnter = useCallback(() => {
    cancelClose();
    measureAnchor();
    broadcastTooltipOpen(id);
    setOpen(true);
  }, [cancelClose, measureAnchor, id]);

  const handleLeave = useCallback(() => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => {
      setOpen(false);
      closeTimer.current = null;
    }, 180);
  }, [cancelClose]);

  useEffect(() => () => cancelClose(), [cancelClose]);

  /* Close immediately when any other tooltip opens — kills the overlap
     window where two pills are visible during a 180ms close timer. */
  useEffect(
    () =>
      onTooltipOpen((openedId) => {
        if (openedId !== id) {
          cancelClose();
          setOpen(false);
        }
      }),
    [id, cancelClose],
  );

  useEffect(() => {
    if (!open) return;
    const update = () => measureAnchor();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, measureAnchor]);

  const portalStyle: React.CSSProperties = anchor
    ? {
        position: 'fixed',
        top: anchor.top,
        left:
          align === 'right'
            ? anchor.left + anchor.width
            : align === 'left'
              ? anchor.left
              : anchor.left + anchor.width / 2,
        transform:
          align === 'right'
            ? 'translateX(-100%)'
            : align === 'left'
              ? 'none'
              : 'translateX(-50%)',
        zIndex: 60,
        paddingTop: 24,
      }
    : { display: 'none' };

  const alignItems =
    align === 'right'
      ? 'items-end'
      : align === 'left'
        ? 'items-start'
        : 'items-center';

  return (
    <div
      ref={triggerRef}
      data-tooltip-open={open || undefined}
      className="relative inline-flex"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      {children}
      {open && anchor && typeof document !== 'undefined' &&
        createPortal(
          <div
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
            style={portalStyle}
            className={`flex flex-col gap-2 ${alignItems}`}
          >
            <LiquidGlass
              as={onAction ? 'button' : 'div'}
              type={onAction ? 'button' : undefined}
              onClick={onAction}
              ariaLabel={onAction ? label : undefined}
              radius={999}
              refractionHeight={14}
              refractionAmount={20}
              chromaticAberration={6}
              blur={1}
              className={`is-press inline-flex items-center px-4 py-1.5 text-sm font-medium whitespace-nowrap ${
                onAction ? 'text-text-soft hover:text-text cursor-pointer' : 'text-text-soft pointer-events-none'
              }`}
            >
              {label}
            </LiquidGlass>
            {extra && <div className="pointer-events-auto">{extra}</div>}
          </div>,
          document.body,
        )}
    </div>
  );
};
