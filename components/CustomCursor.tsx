'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = (e: MouseEvent) => setMousePosition({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', update);
    return () => window.removeEventListener('mousemove', update);
  }, []);

  if (!mounted) return null;

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/70 bg-primary/10 backdrop-blur-sm md:block"
      animate={{ x: mousePosition.x, y: mousePosition.y }}
      transition={{ type: 'spring', stiffness: 520, damping: 32, mass: 0.45 }}
    />
  );
}
