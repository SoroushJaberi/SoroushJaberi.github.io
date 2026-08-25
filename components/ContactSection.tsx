'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactModal from './ContactModal';
import MediaFrame from './ui/MediaFrame';
import SectionLabel from './ui/SectionLabel';

const quickLinks = [
  { label: 'Email', href: 'mailto:jaberi.soroush@gmail.com' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/soroush-jaberi/' },
  { label: 'GitHub', href: 'https://github.com/SoroushJaberi' },
  { label: 'CV', href: '/Soroush-Jaberi-CV.pdf' },
];

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="relative overflow-hidden px-6 pt-28 pb-10 text-foreground md:px-12 md:pt-40 md:pb-12">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 lg:grid-cols-[1fr_360px] lg:items-center lg:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8 }}
          className="relative z-10"
        >
          <SectionLabel index="08" label="Contact" className="mb-6" />
          <h2 className="display-title text-glow max-w-[11ch] text-[clamp(3rem,8vw,6.4rem)] leading-[0.94]">
            Let&apos;s build useful <span className="serif-accent gradient-text">AI systems.</span>
          </h2>
          <p className="mt-7 max-w-xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
            Open to research collaborations, AI / data science roles, and projects across NLP,
            medical AI, retrieval systems, and applied machine learning.
          </p>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="border border-primary bg-primary px-6 py-3.5 font-syne text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-[0_0_22px_rgba(143,227,217,0.1)] transition-transform hover:-translate-y-0.5"
            >
              Get in touch
            </button>
            <a href="/Soroush-Jaberi-CV.pdf" target="_blank" className="border border-white/12 px-6 py-3.5 font-syne text-xs font-bold uppercase tracking-[0.2em] text-foreground/80 transition-colors hover:border-primary hover:text-primary">
              Download CV
            </a>
          </div>

          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-3">
            {quickLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('http') || link.href.endsWith('.pdf') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="font-mono-label text-[0.64rem] uppercase tracking-[0.2em] text-foreground/52 transition-colors hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.8, delay: 0.06 }}
          className="relative mx-auto w-full max-w-[360px] lg:mx-0 lg:ml-auto"
        >
          <div className="absolute -left-6 top-8 hidden h-[80%] w-px bg-gradient-to-b from-transparent via-primary/45 to-transparent lg:block" aria-hidden="true" />
          <MediaFrame
            src="/images/optimized/academic-library.jpg"
            alt="Soroush Jaberi in a library setting"
            variant="portrait"
            ratio="1100 / 2440"
            objectFit="contain"
            objectPosition="50% 50%"
            className="rounded-lg"
          />
          <div className="mt-4 grid grid-cols-1 gap-4 border-y border-white/12 py-5 sm:grid-cols-3">
            {['Research', 'AI roles', 'ML systems'].map((item) => (
              <span key={item} className="font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-foreground/44">{item}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <footer className="relative z-10 mx-auto mt-14 flex max-w-7xl flex-col gap-5 border-t border-white/10 pt-6 font-mono-label text-[0.62rem] uppercase tracking-[0.2em] text-foreground/45 md:flex-row md:items-center md:justify-between">
        <span>(c) {new Date().getFullYear()} Soroush Jaberi</span>
        <span className="text-foreground/35">AI Researcher / Data Scientist / Machine Learning Engineer</span>
      </footer>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
