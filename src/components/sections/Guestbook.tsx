import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, useScroll, useTransform } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
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
const CAROUSEL_AUTOPLAY_MS = 5000;

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
}

const EntryCard = ({ entry, lang }: EntryCardProps) => (
  <GlassCard className="p-6 h-full">
    <div className="flex flex-col gap-3 h-full">
      <p className="text-sm leading-relaxed whitespace-pre-wrap flex-1">
        {entry.comment}
      </p>
      <div className="flex flex-col gap-0.5 pt-3 border-t border-white/10">
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
  </GlassCard>
);

interface CarouselProps {
  entries: GuestbookEntry[];
  lang: string;
}

const EntriesCarousel = ({ entries, lang }: CarouselProps) => {
  const canLoop = entries.length > 1;
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: canLoop,
    align: 'start',
    skipSnaps: false,
  });
  const [paused, setPaused] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  useEffect(() => {
    if (!emblaApi || paused || !canLoop) return;
    const id = window.setInterval(() => emblaApi.scrollNext(), CAROUSEL_AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [emblaApi, paused, canLoop]);

  return (
    <div
      className="relative"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="pl-4 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0"
            >
              <EntryCard entry={entry} lang={lang} />
            </div>
          ))}
        </div>
      </div>

      {canLoop && (
        <div className="flex justify-center gap-1.5 mt-5">
          {entries.map((entry, i) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`Go to note ${i + 1}`}
              aria-current={i === selectedIndex}
              className={`h-1.5 rounded-full transition-all ${
                i === selectedIndex ? 'w-5 bg-accent' : 'w-1.5 bg-white/30 hover:bg-white/55'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Guestbook = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.resolvedLanguage?.startsWith('es') ? 'es' : 'en';
  const animations = config.features.animations;
  const ref = useRef<HTMLDivElement>(null);
  const { entries, loading, loadError, submit } = useGuestbook();
  const limits = config.guestbook.limits;

  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('');
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  });
  const wrapperOpacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const wrapperY = useTransform(scrollYProgress, [0, 0.6], [60, 0]);
  const wrapperFilter = useTransform(
    scrollYProgress,
    [0, 0.6],
    ['blur(12px)', 'blur(0px)'],
  );

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
    <div className="flex flex-col gap-4">
      <h3 className="text-xs font-semibold uppercase tracking-[0.18em] text-text-soft">
        {t('guestbook.list.title')}
      </h3>
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

  const content = (
    <div className="flex flex-col gap-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        className="flex flex-col gap-6"
      >
        <motion.div variants={itemVariants} className="flex flex-col gap-3 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold">{t('guestbook.title')}</h2>
          <p className="text-lg text-text-soft">{t('guestbook.subtitle')}</p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GlassCard className="p-6 md:p-8">{form}</GlassCard>
        </motion.div>

        <motion.div variants={itemVariants}>{list}</motion.div>
      </motion.div>
    </div>
  );

  if (!animations) return content;

  return (
    <motion.div
      ref={ref}
      style={{
        opacity: wrapperOpacity,
        y: wrapperY,
        filter: wrapperFilter,
        willChange: 'opacity, transform, filter',
      }}
    >
      {content}
    </motion.div>
  );
};
