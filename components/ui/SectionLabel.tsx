'use client';

import { motion } from 'framer-motion';

/**
 * SectionLabel — a coordinate-style section marker: pulsing node, index,
 * a short signal line, then the label. Mono type for the scientific feel.
 */
export default function SectionLabel({
  index,
  label,
  className = '',
}: {
  index: string;
  label: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={`coord flex items-center gap-3 text-foreground/55 ${className}`}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-primary/60 [animation:pulse-ring_2.6s_ease-out_infinite]" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
      </span>
      <span className="text-foreground/35">{index}</span>
      <span className="h-px w-7 bg-gradient-to-r from-primary/55 to-transparent" />
      <span className="text-primary/85">{label}</span>
    </motion.div>
  );
}
