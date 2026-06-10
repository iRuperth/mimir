import { useTranslation } from 'react-i18next';

const LockIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

/* "Private repository" badge with a hover/focus tooltip inviting the visitor
   to ask for code access. The wrapper is `group` + tabIndex so the tip shows
   on both mouse hover and keyboard focus; the badge keeps the same look it had
   inline before, so it can drop straight into the modal and the card. */
export const PrivateBadge = () => {
  const { t } = useTranslation();
  return (
    <span className="relative inline-block group">
      <span
        tabIndex={0}
        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-text-soft whitespace-nowrap cursor-help focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
      >
        <LockIcon />
        {t('projects.private')}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 bottom-full z-20 mb-2 w-60 -translate-x-1/2 translate-y-1 rounded-xl border border-white/15 bg-surface/95 px-3 py-2 text-xs font-medium leading-relaxed text-text text-center opacity-0 shadow-lg backdrop-blur-md transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
      >
        {t('projects.privateHint')}
      </span>
    </span>
  );
};
