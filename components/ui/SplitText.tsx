'use client';

import { motion, type Variants } from 'framer-motion';

/**
 * SplitText — character-by-character entrance. Splits into words (so wrapping
 * stays natural) then characters (which stagger in). Use `trigger` for
 * controlled play (e.g. after the intro); otherwise it plays in-view.
 */
const container = (stagger: number, delay: number): Variants => ({
  hidden: {},
  show: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

const charVariant: Variants = {
  hidden: { opacity: 0, y: '0.5em' },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export default function SplitText({
  text,
  className = '',
  stagger = 0.026,
  delay = 0,
  trigger,
}: {
  text: string;
  className?: string;
  stagger?: number;
  delay?: number;
  trigger?: boolean;
}) {
  const controlled = trigger !== undefined;
  const words = text.split(' ');

  return (
    <motion.span
      className={className}
      aria-label={text}
      variants={container(stagger, delay)}
      initial="hidden"
      {...(controlled ? { animate: trigger ? 'show' : 'hidden' } : { whileInView: 'show', viewport: { once: true, margin: '-12%' } })}
    >
      {words.map((word, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap">
          {Array.from(word).map((ch, ci) => (
            <motion.span key={ci} variants={charVariant} className="inline-block">
              {ch}
            </motion.span>
          ))}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </motion.span>
  );
}
