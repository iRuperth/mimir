import type { ReactNode } from 'react';
import { config } from '@/config/env';
import { LiquidGlass } from '@/components/glass/LiquidGlass';

interface IconProps {
  className?: string;
}

const GithubIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M12 .5C5.73.5.67 5.56.67 11.83c0 5 3.24 9.23 7.74 10.73.57.1.78-.25.78-.55v-2.1c-3.15.69-3.82-1.36-3.82-1.36-.51-1.31-1.26-1.66-1.26-1.66-1.03-.7.08-.69.08-.69 1.14.08 1.74 1.17 1.74 1.17 1.01 1.74 2.66 1.24 3.31.95.1-.74.4-1.24.72-1.53-2.51-.29-5.16-1.26-5.16-5.59 0-1.24.44-2.25 1.16-3.05-.12-.29-.5-1.45.11-3.02 0 0 .95-.3 3.1 1.16a10.7 10.7 0 0 1 5.64 0c2.14-1.46 3.09-1.16 3.09-1.16.61 1.57.23 2.73.11 3.02.72.8 1.16 1.81 1.16 3.05 0 4.34-2.66 5.29-5.19 5.58.41.35.78 1.05.78 2.12v3.14c0 .3.21.66.79.55 4.49-1.5 7.73-5.73 7.73-10.73C23.33 5.56 18.27.5 12 .5z" />
  </svg>
);

const LinkedinIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
  </svg>
);

const EmailIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </svg>
);

const XIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
  </svg>
);

interface SocialEntry {
  key: keyof typeof config.socials;
  url: string;
  label: string;
  icon: ReactNode;
}

const buildEntries = (): SocialEntry[] => {
  const s = config.socials;
  const iconClass = 'w-4 h-4';
  return [
    { key: 'github', url: s.github, label: 'GitHub', icon: <GithubIcon className={iconClass} /> },
    { key: 'linkedin', url: s.linkedin, label: 'LinkedIn', icon: <LinkedinIcon className={iconClass} /> },
    {
      key: 'email',
      url: s.email ? `mailto:${s.email}` : '',
      label: 'Email',
      icon: <EmailIcon className={iconClass} />,
    },
    { key: 'x', url: s.x, label: 'X', icon: <XIcon className={iconClass} /> },
    { key: 'instagram', url: s.instagram, label: 'Instagram', icon: <InstagramIcon className={iconClass} /> },
  ];
};

interface Props {
  className?: string;
}

export const SocialLinks = ({ className = '' }: Props) => {
  const entries = buildEntries().filter((e) => e.url.length > 0);
  if (entries.length === 0) return null;

  return (
    <ul className={`flex items-center gap-2 ${className}`}>
      {entries.map((e) => (
        <li key={e.key}>
          <LiquidGlass
            as="a"
            href={e.url}
            target={e.key === 'email' ? undefined : '_blank'}
            rel={e.key === 'email' ? undefined : 'noopener noreferrer'}
            radius={999}
            refractionHeight={12}
            refractionAmount={16}
            chromaticAberration={5}
            blur={1}
            className="is-press p-2 inline-flex items-center justify-center"
            ariaLabel={e.label}
            title={e.label}
          >
            {e.icon}
          </LiquidGlass>
        </li>
      ))}
    </ul>
  );
};
