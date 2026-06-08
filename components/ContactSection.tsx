'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactModal from './ContactModal';

const quickLinks = [
  { label: 'Email', href: 'mailto:jaberi.soroush@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/soroush-jaberi/' },
  { label: 'GitHub', href: 'https://github.com/SoroushJaberi' },
  { label: 'CV', href: '/Soroush-Jaberi-CV.pdf' },
];

function Orbits() {
  return (
    <div className="pointer-events-none absolute left-1/2 top-1/2 -z-0 h-[42rem] w-[42rem] -translate-x-1/2 -translate-y-1/2 opacity-60">
      {[0, 1, 2].map((ring) => (
        <motion.div
          key={ring}
          className="absolute inset-0 rounded-full border border-white/[0.06]"
          style={{ scale: 1 - ring * 0.26 }}
          animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 38 + ring * 14, repeat: Infinity, ease: 'linear' }}
        >
          <span
            className="absolute h-2 w-2 rounded-full bg-primary shadow-[0_0_16px_rgba(124,199,255,0.8)]"
            style={{ top: '-4px', left: 'calc(50% - 4px)' }}
          />
        </motion.div>
      ))}
      <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#a78bfa] shadow-[0_0_22px_rgba(167,139,250,0.9)]" />
    </div>
  );
}

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden px-6 py-28 text-foreground md:px-12 md:py-40">
      <Orbits />

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-3xl text-center"
      >
        <p className="eyebrow mb-6"><span className="text-foreground/30">08 ·</span> Contact</p>
        <h2 className="display-title text-glow text-[clamp(2.8rem,8vw,6rem)] leading-[0.98]">
          Let’s build useful <span className="serif-accent text-primary">AI systems.</span>
        </h2>
        <p className="mx-auto mt-7 max-w-xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
          Open to research collaborations, AI / data science roles, and projects across NLP, medical AI,
          retrieval systems, and applied machine learning.
        </p>

        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-10 rounded-full bg-primary px-8 py-4 font-syne text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_0_45px_rgba(124,199,255,0.3)] transition-transform hover:-translate-y-0.5"
        >
          Get in touch
        </button>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-7 gap-y-3">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') || link.href.endsWith('.pdf') ? '_blank' : undefined}
              rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="font-syne text-xs uppercase tracking-[0.2em] text-foreground/55 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </div>
      </motion.div>

      <footer className="relative z-10 mx-auto mt-20 flex max-w-7xl flex-col gap-5 border-t border-white/10 pt-6 font-syne text-[0.7rem] uppercase tracking-[0.2em] text-foreground/48 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Soroush Jaberi</span>
        <span className="text-foreground/35">AI Researcher · Data Scientist · Machine Learning Engineer</span>
      </footer>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
