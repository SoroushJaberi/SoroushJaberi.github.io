'use client';

import { motion } from 'framer-motion';
import SectionLabel from './ui/SectionLabel';

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
          <SectionLabel index="05" label="Skills" className="mb-5" />
          <h2 className="display-title text-[clamp(2.8rem,6.5vw,5.2rem)]">
            The tools behind the <span className="serif-accent gradient-text">work.</span>
          </h2>
          <p className="mt-6 max-w-xl font-syne text-base leading-[1.8] text-foreground/60 md:text-lg">
            Grouped by what they&apos;re for — modeling, language, vision, and the engineering that ties them together.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
