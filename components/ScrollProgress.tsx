'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 28, mass: 0.3 });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[300] h-[2px] w-full origin-left bg-gradient-to-r from-primary via-[#a78bfa] to-[#d6b56d] shadow-[0_0_18px_rgba(124,199,255,0.6)]"
      aria-hidden="true"
    />
  );
}
