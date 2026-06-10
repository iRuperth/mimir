/* Single coordination channel used by every hoverable popover in the
   navbar: Projects / Skills / Contact dropdowns AND control button
   tooltips (language, theme, colorblind, music).

   When any element opens, it dispatches its id; every listener that
   sees a different id closes itself. This is the same mechanism the
   Navbar already used internally (one `openDropdown` string)
   generalised to a global bus so the control tooltips share it too, so that
   no two popovers can ever be visible at the same time. */

export const TOOLTIP_OPEN_EVENT = 'mimir:tooltip-open';

export const broadcastTooltipOpen = (id: string) => {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(TOOLTIP_OPEN_EVENT, { detail: id }));
};

export const onTooltipOpen = (handler: (id: string) => void) => {
  if (typeof window === 'undefined') return () => {};
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<string>).detail;
    if (typeof detail === 'string') handler(detail);
  };
  window.addEventListener(TOOLTIP_OPEN_EVENT, listener);
  return () => window.removeEventListener(TOOLTIP_OPEN_EVENT, listener);
};
