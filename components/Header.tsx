'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import NavModal from './NavModal';

const navItems = [
  { text: 'Research', href: '#research' },
  { text: 'Academic', href: '#academic' },
  { text: 'Projects', href: '#projects' },
  { text: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-[200] flex items-center justify-between px-5 py-4 text-foreground md:px-10 md:py-6">
        <motion.a
          href="#intro"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35 }}
          className="border-b border-white/20 pb-1 font-syne text-[0.68rem] font-semibold uppercase tracking-[0.24em] text-foreground/86 backdrop-blur-xl transition-colors hover:border-primary hover:text-primary md:text-xs"
        >
          Soroush Jaberi
        </motion.a>

        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="hidden items-center gap-6 border border-white/10 bg-background/58 px-4 py-2 font-syne text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-foreground/58 backdrop-blur-xl lg:flex"
          aria-label="Primary navigation"
        >
          {navItems.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-primary">
              {item.text}
            </a>
          ))}
        </motion.nav>

        <motion.button
          type="button"
          onClick={() => setIsOpen(true)}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="group border border-white/10 bg-background/58 px-4 py-2 font-syne text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-foreground/80 backdrop-blur-xl transition-colors hover:border-primary/45 hover:text-primary md:text-xs"
          aria-label="Open menu"
        >
          Menu
        </motion.button>
      </header>

      <NavModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
