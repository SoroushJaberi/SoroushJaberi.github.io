'use client';

import * as React from 'react';
import { motion } from 'framer-motion';

const skills = [
  {
    category: 'Machine Learning',
    items: ['Python', 'PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'pandas', 'XGBoost', 'LightGBM'],
    focus: 'Modeling, training, evaluation, and experiment-driven iteration.',
  },
  {
    category: 'NLP & Generative AI',
    items: ['Transformers', 'BERT', 'ParsBERT', 'FastText', 'RAG', 'LangChain', 'ChromaDB', 'LLM QA'],
    focus: 'Language understanding, retrieval pipelines, and document-grounded assistants.',
  },
  {
    category: 'Computer Vision',
    items: ['OpenCV', 'UNet', 'Image Processing', 'Medical Segmentation', 'Pose Estimation', 'MediaPipe'],
    focus: 'Segmentation, medical imaging, and applied visual intelligence prototypes.',
  },
  {
    category: 'Software & Research',
    items: ['Git/GitHub', 'Linux', 'Jupyter', 'Anaconda', 'SQL', 'Java', 'JavaScript', 'Minitab'],
    focus: 'Reproducible workflows, technical documentation, and research-to-code implementation.',
  },
];

export default function SkillsSection() {
  const [active, setActive] = React.useState(0);
  const activeSkill = skills[active];

  React.useEffect(() => {
    const interval = setInterval(() => setActive((prev) => (prev + 1) % skills.length), 4200);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="px-6 pb-24 text-foreground md:px-12 md:pb-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 lg:grid-cols-[0.95fr_1fr] lg:items-stretch">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
          {skills.map((skill, index) => {
            const isActive = active === index;
            return (
              <button
                key={skill.category}
                onMouseEnter={() => setActive(index)}
                onClick={() => setActive(index)}
                className={`group rounded-[1.5rem] border p-5 text-left transition-all md:p-6 ${
                  isActive
                    ? 'border-primary/55 bg-primary/[0.08]'
                    : 'border-white/10 bg-white/[0.025] hover:border-white/20 hover:bg-white/[0.04]'
                }`}
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <span className="font-syne text-xs uppercase tracking-[0.22em] text-foreground/40">0{index + 1}</span>
                  <span className={`h-2 w-2 rounded-full transition-colors ${isActive ? 'bg-primary' : 'bg-white/20'}`} />
                </div>
                <h3 className="font-syne text-2xl font-semibold tracking-[-0.04em] text-foreground md:text-3xl">{skill.category}</h3>
                <p className="mt-3 font-syne text-sm leading-6 text-foreground/55">{skill.focus}</p>
              </button>
            );
          })}
        </div>

        <motion.div
          key={activeSkill.category}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glow-card flex min-h-[28rem] flex-col justify-between rounded-[2rem] p-7 md:p-10"
        >
          <div>
            <p className="eyebrow mb-5">Selected Stack</p>
            <h3 className="display-title text-[clamp(2.6rem,6vw,5rem)]">
              {activeSkill.category.split(' ')[0]} <span className="serif-accent text-primary">tools</span>
            </h3>
            <p className="mt-6 max-w-2xl font-syne text-base leading-[1.8] text-foreground/64 md:text-lg">
              {activeSkill.focus}
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-2.5">
            {activeSkill.items.map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/[0.03] px-4 py-2.5 font-syne text-xs font-medium uppercase tracking-[0.13em] text-foreground/70">
                {item}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
