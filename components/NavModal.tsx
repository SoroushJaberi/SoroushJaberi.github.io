'use client';

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
  const handleClick = (href: string) => {
    onClose();
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 180);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="nav-modal"
          className="fixed inset-0 z-[9998] overflow-hidden bg-background/92 px-6 py-6 text-foreground backdrop-blur-2xl md:px-12 md:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: 'easeInOut' }}
        >
          <div className="absolute left-[-12rem] top-[-12rem] h-[26rem] w-[26rem] rounded-full bg-primary/12 blur-[100px]" />
          <div className="absolute bottom-[-14rem] right-[-10rem] h-[28rem] w-[28rem] rounded-full bg-[#d6b56d]/8 blur-[110px]" />

          <div className="relative z-10 flex h-full flex-col">
            <div className="flex items-center justify-between">
              <span className="font-syne text-xs font-semibold uppercase tracking-[0.24em] text-foreground/55">Navigation</span>
              <button onClick={onClose} className="rounded-full border border-white/10 px-4 py-2 font-syne text-xs font-semibold uppercase tracking-[0.2em] text-foreground/70 transition-colors hover:border-primary/45 hover:text-primary">
                Close
              </button>
            </div>

            <div className="flex flex-1 items-center">
              <nav className="grid w-full grid-cols-1 gap-2 md:grid-cols-2 md:gap-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.href}
                    onClick={() => handleClick(item.href)}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.34, delay: index * 0.04 }}
                    className="group flex items-center justify-between rounded-[1.5rem] border border-white/10 bg-white/[0.025] px-5 py-5 text-left transition-colors hover:border-primary/45 hover:bg-primary/[0.06] md:px-7 md:py-6"
                  >
                    <span className="font-syne text-[clamp(1.8rem,5vw,4rem)] font-semibold leading-none tracking-[-0.05em] text-foreground transition-colors group-hover:text-primary">{item.text}</span>
                    <span className="font-syne text-xs uppercase tracking-[0.2em] text-foreground/36">0{index + 1}</span>
                  </motion.button>
                ))}
              </nav>
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-white/10 pt-5 font-syne text-xs uppercase tracking-[0.2em] text-foreground/45">
              <a className="hover:text-primary" href="https://github.com/SoroushJaberi" target="_blank" rel="noopener noreferrer">GitHub</a>
              <a className="hover:text-primary" href="https://www.linkedin.com/in/soroush-jaberi/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a className="hover:text-primary" href="mailto:jaberi.soroush@gmail.com">Email</a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
