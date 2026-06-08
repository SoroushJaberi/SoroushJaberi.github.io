'use client';

import { motion } from 'framer-motion';

const academicItems = [
  {
    role: 'M.Sc. Artificial Intelligence',
    org: 'Karaj Islamic Azad University',
    period: '2023 – Present',
    bullets: [
      'Overall GPA: 4.0 / 4.0; top-of-class academic performance.',
      'Thesis status: preparing for defense, expected Summer 2026.',
      'Relevant coursework: Machine Learning, Neural Networks & Deep Learning, Image Processing.',
    ],
  },
  {
    role: 'B.Sc. Computer Engineering',
    org: 'Karaj Islamic Azad University',
    period: '2019 – 2023',
    bullets: [
      'Built a strong foundation in algorithms, artificial intelligence, data mining, and computer graphics.',
      'Last two years GPA: 3.81 / 4.0; overall GPA: 3.74 / 4.0.',
      'Relevant coursework: Artificial Intelligence, Data Mining, Algorithm Design, Computer Graphics.',
    ],
  },
  {
    role: 'Teaching Assistant — Machine Learning',
    org: 'Karaj Islamic Azad University',
    period: '2023 – 2025',
    bullets: [
      'Supported graduate students in implementing machine learning workflows and models.',
      'Assisted with supervised and unsupervised learning projects, model evaluation, and practical Q&A sessions.',
      'Helped bridge theoretical machine learning concepts with implementation-focused practice.',
    ],
  },
  {
    role: 'Teaching Assistant — Data Mining & Algorithm Design',
    org: 'Karaj Islamic Azad University',
    period: '2022 – 2025',
    bullets: [
      'Guided students through preprocessing, feature selection, classification, clustering, and pattern discovery.',
      'Assisted with algorithmic problem sets requiring efficient design and complexity analysis.',
      'Connected algorithmic thinking with AI and large-scale data processing applications.',
    ],
  },
];

const researchWorks = [
  {
    title: 'Enhancing Sentiment Analysis via Ensemble Methods — BERT + VADER',
    venue: 'Under Review',
    description:
      'A hybrid sentiment analysis framework combining transformer-based contextual embeddings with lexicon-based polarity signals for practical NLP sentiment classification pipelines.',
  },
  {
    title: 'Systematic Mapping Study on Deep Learning-Based Biomedical Image Segmentation Techniques',
    venue: 'In Preparation',
    description:
      'A systematic study of deep learning architectures across biomedical imaging modalities, with attention to supervision strategies, evaluation metrics, 3D modeling challenges, and clinical relevance.',
  },
];

export default function AcademicSection() {
  return (
    <section id="academic" className="relative px-6 py-24 text-foreground md:px-12 md:py-32">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.75 }}
          className="mb-14 max-w-3xl md:mb-18"
        >
          <p className="eyebrow mb-5"><span className="text-foreground/30">04 ·</span> Academic Foundation</p>
          <h2 className="display-title text-[clamp(2.9rem,7vw,5.6rem)]">
            Education, teaching & <span className="serif-accent text-primary">research.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-5">
          {academicItems.map((item, index) => (
            <motion.article
              key={item.role}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
              className="soft-card rounded-[1.75rem] p-6 md:p-7"
            >
              <div className="mb-5 flex items-start justify-between gap-5">
                <div>
                  <h3 className="font-syne text-xl font-semibold leading-snug tracking-[-0.03em] text-foreground md:text-2xl">{item.role}</h3>
                  <p className="mt-2 font-syne text-sm uppercase tracking-[0.18em] text-foreground/42">{item.org}</p>
                </div>
                <span className="whitespace-nowrap rounded-full border border-white/10 px-3 py-1.5 font-syne text-[0.65rem] uppercase tracking-[0.16em] text-primary/80">{item.period}</span>
              </div>
              <ul className="space-y-2.5">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-3 font-syne text-sm leading-6 text-foreground/64 md:text-[0.95rem]">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/75" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.7 }}
          className="mt-18 md:mt-24"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <h3 className="font-syne text-sm font-semibold uppercase tracking-[0.22em] text-foreground/62">Research Work</h3>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {researchWorks.map((work, index) => (
              <motion.article
                key={work.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 transition-colors hover:border-primary/40"
              >
                <span className="font-syne text-xs uppercase tracking-[0.2em] text-primary/75">{work.venue}</span>
                <h4 className="mt-4 font-syne text-xl font-semibold leading-snug tracking-[-0.035em] text-foreground md:text-2xl">{work.title}</h4>
                <p className="mt-4 font-syne text-sm leading-7 text-foreground/64 md:text-base">{work.description}</p>
              </motion.article>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-70px' }}
          transition={{ duration: 0.7 }}
          className="mt-14 md:mt-20"
        >
          <div className="mb-8 flex items-center gap-4">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <h3 className="font-syne text-sm font-semibold uppercase tracking-[0.22em] text-foreground/62">Certifications</h3>
            <div className="h-px flex-1 bg-white/10" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
