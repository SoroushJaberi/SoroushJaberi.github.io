'use client';

import { motion } from 'framer-motion';

/**
 * MediaFrame
 * ----------
 * A single component for every image area on the site.
 *
 * - Pass `src` to render a real image (object-cover, lazy, with the
 *   scientific "lab frame" chrome kept on top).
 * - Omit `src` to render a designed placeholder: a subtle themed motif,
 *   a corner-bracket crop frame, and a tiny figure caption. It looks
 *   intentional while empty, and tells you exactly what belongs there.
 *
 * Replacing a placeholder = drop the file in /public/images and set `src`.
 */

export type MediaVariant =
  | 'portrait'
  | 'nlp'
  | 'medical'
  | 'rag'
  | 'vision'
  | 'abstract';

type MediaFrameProps = {
  variant?: MediaVariant;
  /** Real image path, e.g. "/images/portrait.jpg". When set, the image shows. */
  src?: string;
  alt?: string;
  objectPosition?: string;
  /** How the image fills the frame. Defaults to "cover". Use "contain" to keep the full image visible. */
  objectFit?: 'cover' | 'contain';
  /** CSS aspect-ratio string, e.g. "4 / 5". */
  ratio?: string;
  /** Short label shown on the placeholder, e.g. "Portrait". */
  label?: string;
  /** One-line guidance shown under the label on the placeholder. */
  hint?: string;
  className?: string;
  priority?: boolean;
};

function Motif({ variant }: { variant: MediaVariant }) {
  const stroke = 'rgba(143,227,217,0.55)';
  const faint = 'rgba(143,227,217,0.18)';
  const gold = 'rgba(217,186,112,0.5)';

  switch (variant) {
    case 'portrait':
      return (
        <svg viewBox="0 0 120 120" fill="none" className="h-16 w-16">
          <circle cx="60" cy="44" r="20" stroke={stroke} strokeWidth="1.4" />
          <path d="M26 100c4-19 17-30 34-30s30 11 34 30" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
          <circle cx="60" cy="44" r="32" stroke={faint} strokeWidth="1" strokeDasharray="2 6" />
        </svg>
      );
    case 'nlp':
      return (
        <svg viewBox="0 0 140 100" fill="none" className="h-16 w-20">
          {[20, 50, 80, 110].map((x, i) => (
            <g key={x}>
              <circle cx={x} cy={i % 2 === 0 ? 30 : 70} r="4" fill={i === 1 ? stroke : faint} />
              {i < 3 && (
                <line x1={x} y1={i % 2 === 0 ? 30 : 70} x2={x + 30} y2={i % 2 === 0 ? 70 : 30} stroke={faint} strokeWidth="1" />
              )}
            </g>
          ))}
          <rect x="14" y="84" width="40" height="3" rx="1.5" fill={gold} />
          <rect x="60" y="84" width="24" height="3" rx="1.5" fill={faint} />
        </svg>
      );
    case 'medical':
      return (
        <svg viewBox="0 0 120 120" fill="none" className="h-16 w-16">
          <rect x="18" y="18" width="84" height="84" rx="10" stroke={faint} strokeWidth="1" />
          <path d="M40 70c8-26 32-26 40 0-10 16-30 16-40 0z" stroke={stroke} strokeWidth="1.4" />
          <circle cx="60" cy="62" r="7" stroke={gold} strokeWidth="1.4" />
          <path d="M60 30v8M60 102v-8M30 60h8M102 60h-8" stroke={faint} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    case 'rag':
      return (
        <svg viewBox="0 0 130 110" fill="none" className="h-16 w-20">
          <rect x="14" y="20" width="34" height="44" rx="4" stroke={faint} strokeWidth="1" />
          <rect x="22" y="12" width="34" height="44" rx="4" stroke={stroke} strokeWidth="1.3" />
          <path d="M60 40h26" stroke={gold} strokeWidth="1.3" strokeDasharray="3 4" />
          <circle cx="100" cy="40" r="16" stroke={stroke} strokeWidth="1.3" />
          <path d="M94 40l5 5 8-9" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case 'vision':
      return (
        <svg viewBox="0 0 130 100" fill="none" className="h-16 w-20">
          <path d="M18 50c14-22 80-22 94 0-14 22-80 22-94 0z" stroke={stroke} strokeWidth="1.3" />
          <circle cx="65" cy="50" r="13" stroke={stroke} strokeWidth="1.3" />
          <circle cx="65" cy="50" r="5" fill={gold} />
          <path d="M65 12v8M65 88v-8" stroke={faint} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 120" fill="none" className="h-16 w-16">
          <circle cx="60" cy="60" r="30" stroke={stroke} strokeWidth="1.3" />
          <circle cx="60" cy="60" r="44" stroke={faint} strokeWidth="1" strokeDasharray="2 6" />
          <circle cx="60" cy="60" r="6" fill={gold} />
        </svg>
      );
  }
}

export default function MediaFrame({
  variant = 'abstract',
  src,
  alt = '',
  objectPosition = '50% 50%',
  objectFit = 'cover',
  ratio = '4 / 5',
  label,
  hint,
  className = '',
  priority = false,
}: MediaFrameProps) {
  return (
    <div
      className={`group relative overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#0b1018] ${className}`}
      style={{ aspectRatio: ratio }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          style={{ objectPosition }}
          className={`absolute inset-0 h-full w-full ${objectFit === 'contain' ? 'object-contain' : 'object-cover'} transition-transform duration-700 ease-out group-hover:scale-[1.04]`}
        />
      ) : (
        <>
          {/* themed wash */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(143,227,217,0.10),transparent_60%),radial-gradient(circle_at_80%_90%,rgba(217,186,112,0.07),transparent_55%)]" />
          {/* faint grid */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:28px_28px]" />

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center"
          >
            <div className="opacity-80">
              <Motif variant={variant} />
            </div>
            {label && (
              <p className="mt-5 font-syne text-sm font-semibold uppercase tracking-[0.22em] text-foreground/70">
                {label}
              </p>
            )}
            {hint && (
              <p className="mt-2 max-w-[24ch] font-syne text-xs leading-5 text-foreground/52">{hint}</p>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
