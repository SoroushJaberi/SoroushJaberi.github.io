'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export default function ContactModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const links = [
    { label: 'Email', value: 'jaberi.soroush@gmail.com', href: 'mailto:jaberi.soroush@gmail.com' },
    { label: 'LinkedIn', value: 'soroush-jaberi', href: 'https://www.linkedin.com/in/soroush-jaberi/' },
    { label: 'GitHub', value: 'SoroushJaberi', href: 'https://github.com/SoroushJaberi' },
    { label: 'Resume', value: 'Download CV', href: '/Soroush-Jaberi-CV.pdf' },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.96, y: 18, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.98, y: 10, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="soft-card relative w-full max-w-lg overflow-hidden rounded-[2rem] p-7 md:p-9"
          >
            <button onClick={onClose} className="absolute right-5 top-5 rounded-full border border-white/10 px-3 py-2 font-syne text-xs uppercase tracking-[0.16em] text-foreground/56 transition-colors hover:border-primary hover:text-primary" aria-label="Close modal">
              Close
            </button>

            <p className="eyebrow mb-5">Say hello</p>
            <h3 className="display-title max-w-[10ch] text-[clamp(2.8rem,10vw,5rem)]">
              Let’s talk <span className="serif-accent text-primary">AI.</span>
            </h3>
            <p className="mt-5 max-w-sm font-syne text-sm leading-7 text-foreground/62">
              Reach out for research collaboration, AI/Data Science opportunities, or project discussions.
            </p>

            <div className="mt-8 space-y-3">
              {links.map((link) => (
                <a key={link.label} href={link.href} target={link.href.startsWith('http') || link.href.endsWith('.pdf') ? '_blank' : undefined} rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined} className="flex items-center justify-between gap-5 rounded-2xl border border-white/10 bg-white/[0.03] p-4 transition-colors hover:border-primary/45">
                  <span className="font-syne text-xs uppercase tracking-[0.18em] text-foreground/42">{link.label}</span>
                  <span className="font-syne text-sm font-medium text-foreground/82">{link.value}</span>
                </a>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
