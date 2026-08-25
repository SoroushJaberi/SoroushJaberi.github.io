'use client';

import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const navItems = [
  { text: 'Intro', href: '#intro' },
  { text: 'About', href: '#about' },
  { text: 'Research', href: '#research' },
  { text: 'Academic', href: '#academic' },
  { text: 'Skills', href: '#skills' },
  { text: 'Projects', href: '#projects' },
  { text: 'Timeline', href: '#experience' },
  { text: 'Contact', href: '#contact' },
];

export default function NavModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  // Escape closes, and the page behind stays put while the menu is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    window.__lenis?.stop?.();
    return () => {
      window.removeEventListener('keydown', onKey);
      window.__lenis?.start?.();
    };
  }, [isOpen, onClose]);

  const handleClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const lenis = window.__lenis;
      if (lenis) {
        lenis.scrollTo(href, { offset: 0 });
      } else {
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 220);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="nav-modal"
          className="fixed inset-0 z-[9998] overflow-y-auto bg-background/70 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.24, ease: 'easeInOut' }}
          onClick={onClose}
        >
          <div className="flex min-h-full items-center justify-center px-6 py-12">
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
              className="w-full max-w-sm"
              initial={{ opacity: 0, y: 14, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.99 }}
              transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-5 flex items-center justify-between px-1">
                <span className="font-mono-label text-[0.58rem] uppercase tracking-[0.28em] text-foreground/52">Menu</span>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-full border border-white/12 px-3.5 py-1.5 font-mono-label text-[0.58rem] uppercase tracking-[0.2em] text-foreground/60 transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Close
                </button>
              </div>

              <nav className="flex flex-col gap-1.5" aria-label="Primary">
                {navItems.map((item, index) => (
                  <motion.button
                    type="button"
                    key={item.href}
                    onClick={() => handleClick(item.href)}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.04 + index * 0.03 }}
                    className="group flex items-center justify-between rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-3.5 text-left transition-colors duration-300 hover:border-primary/30 hover:bg-primary/[0.05]"
                  >
                    <span className="font-syne text-xl font-medium tracking-[-0.02em] text-foreground/85 transition-colors group-hover:text-primary">
                      {item.text}
                    </span>
                    <span className="font-mono-label text-[0.58rem] tracking-[0.18em] text-foreground/52 transition-colors group-hover:text-primary/60">
                      0{index + 1}
                    </span>
                  </motion.button>
                ))}
              </nav>

              <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono-label text-[0.58rem] uppercase tracking-[0.2em] text-foreground/52">
                <a className="transition-colors hover:text-primary" href="https://github.com/SoroushJaberi" target="_blank" rel="noopener noreferrer">GitHub</a>
                <a className="transition-colors hover:text-primary" href="https://www.linkedin.com/in/soroush-jaberi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                <a className="transition-colors hover:text-primary" href="mailto:jaberi.soroush@gmail.com">Email</a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
