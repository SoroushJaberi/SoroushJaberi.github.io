'use client';

import { motion } from 'framer-motion';

const skills = [
  {
    category: 'Modeling',
    focus: 'Training, evaluating, and iterating on classical and deep learning models.',
    tools: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'pandas', 'XGBoost'],
  },
  {
    category: 'Language',
    focus: 'NLP and document-grounded generation for sentiment, retrieval, and QA.',
    tools: ['Transformers', 'BERT', 'ParsBERT', 'RAG', 'LangChain', 'ChromaDB'],
  },
  {
    category: 'Vision',
    focus: 'Medical segmentation and real-time computer-vision prototypes.',
    tools: ['OpenCV', 'UNet', 'Image Processing', 'Pose Estimation', 'MediaPipe'],
  },
  {
    category: 'Engineering',
    focus: 'Turning research into readable, maintainable code.',
    tools: ['Git/GitHub', 'Linux', 'Jupyter', 'SQL', 'Java', 'JavaScript'],
  },
];

export default function SkillsSection() {
  return (
    <section className="px-6 pb-24 text-foreground md:px-12 md:pb-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-5 md:grid-cols-2">
        {skills.map((skill, index) => (
          <motion.article
            key={skill.category}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.55, delay: index * 0.05 }}
            className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-7 transition-colors duration-300 hover:border-primary/25 md:p-8"
          >
            <div className="flex items-baseline justify-between gap-4">
              <h3 className="font-syne text-2xl font-semibold tracking-[-0.03em] text-foreground md:text-[1.75rem]">{skill.category}</h3>
              <span className="font-mono-label text-[0.6rem] uppercase tracking-[0.22em] text-foreground/35">0{index + 1}</span>
            </div>
            <p className="mt-3 font-syne text-sm leading-7 text-foreground/60 md:text-base">{skill.focus}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {skill.tools.map((tool) => (
                <span
                  key={tool}
                  className="rounded-full border border-white/10 px-3 py-1 font-mono-label text-[0.6rem] uppercase tracking-[0.12em] text-foreground/60"
                >
                  {tool}
                </span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
