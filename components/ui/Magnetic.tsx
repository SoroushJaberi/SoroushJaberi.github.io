'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/**
 * Magnetic — the element is gently pulled toward the cursor while hovered.
 * Mouse-only (touch leaves it at rest).
 */
export default function Magnetic({
  children,
  strength = 0.35,
  className = '',
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 160, damping: 14, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 160, damping: 14, mass: 0.4 });

  return (
    <motion.div
      ref={ref}
      style={{ x: sx, y: sy }}
      className={className}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * strength);
        y.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
