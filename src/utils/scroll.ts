/* Jump to an absolute Y position bypassing CSS `scroll-behavior: smooth`.
   We need this because all in-page animations are scroll-scrubbed —
   smooth scrolling would replay every animation in fast-forward as the
   page travels. Setting scroll-behavior to auto for a single frame
   forces an instant snap; the previous value is restored on the next
   animation frame so user-initiated smooth scrolling stays intact. */
export const scrollToYInstant = (top: number) => {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = 'auto';
  window.scrollTo({ top });
  requestAnimationFrame(() => {
    html.style.scrollBehavior = prev;
  });
};

export const scrollToElementInstant = (id: string, offset = 0) => {
  const el = document.getElementById(id);
  if (!el) return;
  const top = window.scrollY + el.getBoundingClientRect().top + offset;
  scrollToYInstant(top);
};
