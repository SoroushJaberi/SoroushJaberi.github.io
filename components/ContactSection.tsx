'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ContactModal from './ContactModal';

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section id="contact" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.75 }}
        className="soft-card mx-auto flex max-w-7xl flex-col items-start justify-between gap-10 rounded-[2.25rem] p-7 md:p-10 lg:flex-row lg:items-end"
      >
        <div className="max-w-4xl">
          <p className="eyebrow mb-5"><span className="text-foreground/30">08 ·</span> Contact</p>
          <h2 className="display-title text-[clamp(3rem,7.5vw,6.4rem)]">
            Let’s build useful <span className="serif-accent text-primary">AI systems.</span>
          </h2>
          <p className="mt-6 max-w-2xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
            I’m open to research collaborations, AI/data science roles, and projects around NLP,
            medical AI, retrieval systems, and applied machine learning.
          </p>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            setIsModalOpen(true);
          }}
          className="rounded-full bg-primary px-7 py-4 font-syne text-xs font-bold uppercase tracking-[0.2em] text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Get in touch
        </button>
      </motion.div>

      <footer className="mx-auto mt-10 flex max-w-7xl flex-col gap-5 border-t border-white/10 pt-6 font-syne text-[0.7rem] uppercase tracking-[0.2em] text-foreground/48 md:flex-row md:items-center md:justify-between">
        <span>© {new Date().getFullYear()} Soroush Jaberi</span>
        <div className="flex flex-wrap gap-x-5 gap-y-2">
          <a href="https://github.com/SoroushJaberi" target="_blank" rel="noopener noreferrer" className="hover:text-primary">GitHub</a>
          <a href="https://www.linkedin.com/in/soroush-jaberi/" target="_blank" rel="noopener noreferrer" className="hover:text-primary">LinkedIn</a>
          <a href="mailto:jaberi.soroush@gmail.com" className="hover:text-primary">Email</a>
          <a href="/Soroush-Jaberi-CV.pdf" target="_blank" className="hover:text-primary">CV</a>
        </div>
      </footer>

      <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </section>
  );
}
