import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import AutoScroll from 'embla-carousel-auto-scroll';
import { config } from '@/config/env';
import { GlassCard } from '@/components/glass/GlassCard';
import { useGuestbook, type GuestbookEntry } from '@/hooks/useGuestbook';

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] },
  },
};

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

type Status = 'idle' | 'submitting' | 'success' | 'error';

const formatDate = (iso: string, lang: string): string => {
  try {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es-ES' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

interface EntryCardProps {
  entry: GuestbookEntry;
  lang: string;
  expanded: boolean;
  onExpand: () => void;
  onCollapse: () => void;
}

const CLAMP_LINES = 3;

const EntryCard = ({ entry, lang, expanded, onExpand, onCollapse }: EntryCardProps) => {
  const { t } = useTranslation();
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const [overflowing, setOverflowing] = useState(false);

  useEffect(() => {
    const measure = () => {
      const el = textRef.current;
      if (!el) return;
      const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * CLAMP_LINES;
      setOverflowing(el.scrollHeight > maxHeight + 1);
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [entry.comment]);

  const handleToggle = () => {
    if (expanded) onCollapse();
    else onExpand();
  };

  return (
    <div
      className="entry-card p-6 h-full rounded-2xl flex flex-col gap-3 transition-transform duration-500 ease-out hover:scale-[1.04]"
    >
      <p
        ref={textRef}
        className={`text-sm leading-relaxed whitespace-pre-wrap flex-1 ${
          expanded ? '' : 'line-clamp-3'
        }`}
      >
        {entry.comment}
      </p>

      {overflowing && (
        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={expanded}
          className="liquid-glass is-press relative inline-flex self-start items-center justify-center px-3 py-1 text-xs font-semibold text-text rounded-full overflow-hidden"
        >
          <span
            aria-hidden="true"
            className="lg-highlight absolute inset-0 pointer-events-none rounded-full"
          />
          <span className="relative z-[1]">
            {expanded
              ? t('guestbook.actions.read_less')
              : t('guestbook.actions.see_more')}
          </span>
        </button>
      )}

      <div className="flex flex-col gap-0.5 pt-3 border-t border-white/15">
        <h4 className="text-sm font-semibold tracking-tight">{entry.full_name}</h4>
        <div className="flex items-baseline justify-between gap-3">
          {entry.role ? (
            <span className="text-xs text-text-soft truncate">{entry.role}</span>
          ) : (
            <span />
          )}
          <time
            dateTime={entry.created_at}
            className="text-[11px] text-text-soft tabular-nums shrink-0"
          >
            {formatDate(entry.created_at, lang)}
          </time>
        </div>
      </div>
    </div>
  );
};

interface CarouselProps {
  entries: GuestbookEntry[];
  lang: string;
}

const EntriesCarousel = ({ entries, lang }: CarouselProps) => {
  const canLoop = entries.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: canLoop,
      align: 'start',
      skipSnaps: false,
      dragFree: true,
    },
    canLoop
      ? [
          AutoScroll({
            speed: 0.6,
            startDelay: 0,
            stopOnInteraction: false,
            stopOnMouseEnter: true,
            stopOnFocusIn: true,
          }),
        ]
      : [],
  );
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    if (!emblaApi || !canLoop) return;
    const auto = emblaApi.plugins().autoScroll;
    if (!auto) return;
    if (expandedId !== null) auto.stop();
    else auto.play();
  }, [emblaApi, canLoop, expandedId]);

  return (
    <div className="relative">
      <div
        className="overflow-hidden"
        ref={emblaRef}
        style={{
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          maskImage:
            'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}
      >
        <div className="flex -ml-6 py-6">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="pl-6 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
            >
              <EntryCard
                entry={entry}
                lang={lang}
                expanded={expandedId === entry.id}
                onExpand={() => setExpandedId(entry.id)}
                onCollapse={() =>
                  setExpandedId((id) => (id === entry.id ? null : id))
                }
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const Guestbook = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const { entries, loading, loadError, submit } = useGuestbook();
  const limits = config.guestbook.limits;

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const valid = useMemo(() => {
    if (email.trim().length === 0 || !EMAIL_RE.test(email.trim())) return false;
    if (email.trim().length > limits.email) return false;
    if (fullName.trim().length === 0 || fullName.trim().length > limits.name) return false;
    if (role.trim().length > limits.role) return false;
    if (comment.trim().length === 0 || comment.trim().length > limits.comment) return false;
    return true;
  }, [email, fullName, role, comment, limits]);

  const handleSubmit = async (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (status === 'submitting') return;
    if (!valid) {
      setErrorMsg(t('guestbook.form.incomplete'));
      setStatus('error');
      return;
    }
    setStatus('submitting');
    setErrorMsg('');
    const result = await submit({
      email,
      full_name: fullName,
      role,
      comment,
    });
    if (result.ok) {
      setEmail('');
      setFullName('');
      setRole('');
      setComment('');
      setStatus('success');
      setFormOpen(false);
    } else {
      setErrorMsg(result.reason);
      setStatus('error');
    }
  };

  if (!config.guestbook.enabled) {
    return (
      <GlassCard className="p-8 md:p-12 text-center">
        <p className="text-text-soft">{t('guestbook.disabled')}</p>
      </GlassCard>
    );
  }

  const inputClass =
    'w-full rounded-xl bg-bg-soft/60 border border-white/10 px-4 py-2.5 text-sm placeholder:text-text-soft/60 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition';

  const labelClass = 'flex flex-col gap-1.5 text-xs font-medium text-text-soft uppercase tracking-wider';

  const form = (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div className="grid gap-4 md:grid-cols-2">
        <label className={labelClass}>
          {t('guestbook.form.email')}
          <input
            type="email"
            required
            maxLength={limits.email}
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
            className={inputClass}
            autoComplete="email"
          />
          <span className="text-[10px] font-normal tracking-normal text-text-soft normal-case">
            {t('guestbook.form.email_help')}
          </span>
        </label>

        <label className={labelClass}>
          {t('guestbook.form.full_name')}
          <input
            type="text"
            required
            maxLength={limits.name}
            value={fullName}
            onChange={(ev) => setFullName(ev.target.value)}
            className={inputClass}
            autoComplete="name"
          />
        </label>
      </div>

      <label className={labelClass}>
        {t('guestbook.form.role')}
        <input
          type="text"
          maxLength={limits.role}
          value={role}
          onChange={(ev) => setRole(ev.target.value)}
          className={inputClass}
          autoComplete="organization-title"
        />
      </label>

      <label className={labelClass}>
        <span className="flex items-center justify-between">
          <span>{t('guestbook.form.comment')}</span>
          <span className="text-[10px] font-normal tracking-normal text-text-soft normal-case tabular-nums">
            {t('guestbook.form.char_count', {
              count: comment.length,
              max: limits.comment,
            })}
          </span>
        </span>
        <textarea
          required
          rows={5}
          maxLength={limits.comment}
          value={comment}
          onChange={(ev) => setComment(ev.target.value)}
          className={`${inputClass} resize-y min-h-[120px]`}
        />
      </label>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p
          aria-live="polite"
          className={`text-sm ${
            status === 'success'
              ? 'text-accent'
              : status === 'error'
                ? 'text-red-400'
                : 'text-text-soft'
          }`}
        >
          {status === 'success' && t('guestbook.form.success')}
          {status === 'error' && (errorMsg || t('guestbook.form.error'))}
        </p>
        <button
          type="button"
          onClick={(e) => {
            void handleSubmit(e);
          }}
          className={`liquid-glass is-press is-active relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-text rounded-full overflow-hidden ${
            status === 'submitting' ? 'opacity-70 cursor-wait' : ''
          }`}
        >
          <span
            aria-hidden="true"
            className="lg-highlight absolute inset-0 pointer-events-none rounded-full"
          />
          <span className="relative z-[1]">
            {status === 'submitting'
              ? t('guestbook.form.submitting')
              : t('guestbook.form.submit')}
          </span>
        </button>
      </div>
    </form>
  );

  const list = (
    <div className="flex flex-col gap-6">
      <h2 className="text-4xl md:text-5xl font-bold">
        {t('guestbook.list.title')}
      </h2>
      {loading && (
        <p className="text-sm text-text-soft">{t('guestbook.list.loading')}</p>
      )}
      {!loading && loadError && (
        <p className="text-sm text-red-400">{t('guestbook.list.load_error')}</p>
      )}
      {!loading && !loadError && entries.length === 0 && (
        <p className="text-sm text-text-soft italic">{t('guestbook.list.empty')}</p>
      )}
      {!loading && !loadError && entries.length > 0 && (
        <EntriesCarousel entries={entries} lang={lang} />
      )}
    </div>
  );

  return (
    <div className="flex flex-col gap-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        className="flex flex-col gap-6"
      >
        <motion.div variants={itemVariants}>{list}</motion.div>

        <motion.div variants={itemVariants} className="flex flex-col gap-4 items-start">
          <button
            type="button"
            onClick={() => setFormOpen((v) => !v)}
            aria-expanded={formOpen}
            className="liquid-glass is-press is-active relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-text rounded-full overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="lg-highlight absolute inset-0 pointer-events-none rounded-full"
            />
            <span className="relative z-[1]">
              {formOpen ? t('guestbook.actions.close') : t('guestbook.actions.open')}
            </span>
          </button>

          {formOpen && (
            <div className="w-full">
              <GlassCard className="p-6 md:p-8">{form}</GlassCard>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};
