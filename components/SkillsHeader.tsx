'use client';

import { motion } from 'framer-motion';

export default function SkillsHeader() {
  return (
    <section id="skills" className="relative px-6 pt-24 pb-8 text-foreground md:px-12 md:pt-32 md:pb-12">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-4xl"
        >
          <p className="eyebrow mb-5"><span className="text-foreground/30">05 ·</span> Capabilities</p>
          <h2 className="display-title text-[clamp(2.9rem,7vw,5.6rem)]">
            A focused AI stack for <span className="serif-accent text-primary">research & build.</span>
          </h2>
          <p className="mt-6 max-w-2xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
            The stack is intentionally curated around the work I want to be known for: machine learning,
            NLP, medical AI, retrieval systems, and clean research implementation.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
