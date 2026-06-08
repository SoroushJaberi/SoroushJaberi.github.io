'use client';

import { motion } from 'framer-motion';

const milestones = [
  {
    year: '2026',
    title: 'M.Sc. thesis defense preparation',
    text: 'Preparing to defend my thesis on improving sentiment classification in Persian texts using transformer-based and lexicon-based methods.',
  },
  {
    year: '2025',
    title: 'Graduate teaching and research focus',
    text: 'Continued teaching assistant work while deepening research across NLP, medical AI, and retrieval-augmented language systems.',
  },
  {
    year: '2023',
    title: 'Started M.Sc. in Artificial Intelligence',
    text: 'Began graduate studies with a strong academic focus on machine learning, deep learning, image processing, and applied AI systems.',
  },
  {
    year: '2022',
    title: 'Research & network internship',
    text: 'Worked with Tehran Telecommunication Company on network connectivity data, traffic monitoring, and cloud/networking research.',
  },
  {
    year: '2019',
    title: 'Computer engineering foundation',
    text: 'Started building the technical foundation in algorithms, programming, artificial intelligence, data mining, and software engineering.',
  },
];

export default function TimelineSection() {
  return (
    <section id="experience" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="mb-14 max-w-4xl"
        >
          <p className="eyebrow mb-5"><span className="text-foreground/30">07 ·</span> Timeline</p>
          <h2 className="display-title text-[clamp(2.9rem,7vw,5.6rem)]">
            The path behind the <span className="serif-accent text-primary">work.</span>
          </h2>
        </motion.div>

        <div className="relative">
          <div className="absolute left-0 top-0 hidden h-full w-px bg-gradient-to-b from-primary/50 via-white/10 to-transparent md:block" />
          <div className="space-y-0">
            {milestones.map((item, index) => (
              <motion.article
                key={`${item.year}-${item.title}`}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group relative grid grid-cols-1 gap-3 border-t border-white/8 py-8 first:border-t-0 md:grid-cols-[8rem_1fr] md:gap-10 md:py-10 md:pl-12"
              >
                <div className="absolute left-[-0.3125rem] top-[3.25rem] hidden h-[0.625rem] w-[0.625rem] rounded-full bg-primary shadow-[0_0_18px_rgba(124,199,255,0.65)] transition-transform duration-300 group-hover:scale-125 md:block" />
                <span className="font-instrument text-[2.6rem] italic leading-none tracking-[-0.03em] text-primary/85 transition-colors duration-300 group-hover:text-primary md:text-[3.2rem]">
                  {item.year}
                </span>
                <div>
                  <h3 className="font-syne text-xl font-semibold tracking-[-0.03em] text-foreground md:text-2xl">{item.title}</h3>
                  <p className="mt-3 max-w-3xl font-syne text-sm leading-7 text-foreground/62 md:text-base">{item.text}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
