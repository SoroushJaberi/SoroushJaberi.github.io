/**
 * The factual record: education, teaching, skills, interests, timeline.
 * Source of truth is the CV (public/Soroush-Jaberi-CV.pdf). When the CV
 * changes, change it here and every page that shows it follows.
 */

export type Education = {
  degree: string;
  school: string;
  period: string;
  /** Short form of the grade, for tight spaces. */
  gpa: string;
  facts: string[];
  coursework: { name: string; grade: string }[];
};

export const education: Education[] = [
  {
    degree: 'M.Sc. in Artificial Intelligence',
    school: 'Karaj Islamic Azad University',
    period: '2023 – present',
    gpa: '19.58 / 20',
    facts: [
      'GPA 19.58 / 20 (4.0 / 4.0 by course-by-course conversion)',
      'Thesis defense expected January 2027',
      'Supervisor: Dr. Amineh Amini. Co-advisor: Dr. Hadi Saboohi',
    ],
    coursework: [
      { name: 'Machine Learning', grade: '20 / 20' },
      { name: 'Neural Networks & Deep Learning', grade: '20 / 20' },
      { name: 'Image Processing', grade: '19.5 / 20' },
    ],
  },
  {
    degree: 'B.Sc. in Computer Engineering',
    school: 'Karaj Islamic Azad University',
    period: '2019 – 2023',
    gpa: '17.97 / 20',
    facts: [
      'GPA 17.97 / 20 (3.74 / 4.0 by course-by-course conversion)',
      '3.81 / 4.0 over the last two years',
    ],
    coursework: [
      { name: 'Artificial Intelligence', grade: '20 / 20' },
      { name: 'Data Mining', grade: '20 / 20' },
      { name: 'Algorithm Design', grade: '20 / 20' },
      { name: 'Computer Graphics', grade: '19.5 / 20' },
    ],
  },
];

export const thesis = {
  title: 'Improving sentiment classification of Persian text using transformer-based and lexicon-based methods',
  supervisor: 'Dr. Amineh Amini',
  coAdvisor: 'Dr. Hadi Saboohi',
  status: 'Defense expected January 2027',
};

export type Role = {
  title: string;
  org: string;
  period: string;
  points: string[];
};

export const teaching: Role[] = [
  {
    title: 'Teaching Assistant, Machine Learning (graduate level)',
    org: 'Karaj Islamic Azad University',
    period: '2024 – 2025',
    points: [
      'Assisted in designing and evaluating projects on supervised and unsupervised learning and model evaluation.',
      'Supported graduate students in implementing machine learning workflows, and led Q&A sessions bridging theory and practice.',
    ],
  },
  {
    title: 'Teaching Assistant, Data Mining',
    org: 'Karaj Islamic Azad University',
    period: '2023 – 2025',
    points: [
      'Worked with the course instructor to design and evaluate assignments on data preprocessing, feature selection, classification, clustering and pattern discovery.',
      'Helped students bridge the gap between theoretical concepts and real-world applications in AI and analytics.',
    ],
  },
  {
    title: 'Teaching Assistant, Algorithm Design',
    org: 'Karaj Islamic Azad University',
    period: '2022 – 2023',
    points: [
      'Assisted in developing and assessing problem sets requiring efficient algorithm design and rigorous complexity analysis.',
    ],
  },
];

/** Research interests, as stated on the CV. `icon` is a name from Icon.astro. */
export const interests = [
  {
    area: 'Reliable language models',
    detail: 'Evaluation of LLMs and agents, grounding with retrieval (RAG), multilingual and low-resource NLP.',
    icon: 'language',
  },
  {
    area: 'Efficient machine learning',
    detail: 'Model optimization for efficient training and inference.',
    icon: 'chip',
  },
  {
    area: 'AI for healthcare',
    detail: 'Deep learning for medical image analysis and segmentation.',
    icon: 'pulse',
  },
  {
    area: 'Computer vision',
    detail: 'Image analysis and segmentation, with an interest in generative models.',
    icon: 'eye',
  },
] as const;

export const skills = [
  { group: 'Programming', items: ['Python', 'SQL', 'Java', 'JavaScript', 'HTML/CSS'] },
  {
    group: 'Machine learning & deep learning',
    items: ['PyTorch', 'TensorFlow', 'scikit-learn', 'NumPy', 'pandas', 'OpenCV', 'NLTK', 'XGBoost', 'LightGBM'],
  },
  {
    group: 'NLP, LLMs & retrieval',
    items: [
      'Transformers (ParsBERT, BERT)',
      'Retrieval-augmented generation',
      'LangChain',
      'ChromaDB',
      'Embedding-based retrieval',
      'vLLM',
    ],
  },
  {
    group: 'Tools',
    items: ['Git/GitHub', 'Linux (Ubuntu/Debian)', 'Anaconda', 'Jupyter', 'Google Colab', 'PyCharm', 'VirtualBox/VMware', 'Minitab'],
  },
];

export const languages = [
  { name: 'Persian', level: 'Native' },
  { name: 'English', level: 'Advanced (academic reading and technical writing)' },
];

/**
 * Working habits. These are the six habits practiced every week in
 * The AI Path course, quoted from its README.
 */
export const habits = [
  'Understand the problem before you type.',
  'Take small steps and run often.',
  'Predict, then check.',
  'Treat errors as information.',
  'Verify, don’t trust.',
  'Leave it reproducible.',
];

export type TimelineYear = {
  year: string;
  events: { title: string; text: string; href?: string }[];
};

/** The trajectory shown on the home page, oldest first. */
export const timeline: TimelineYear[] = [
  {
    year: '2019',
    events: [
      {
        title: 'B.Sc. in Computer Engineering begins',
        text: 'Karaj Islamic Azad University. Algorithms, artificial intelligence, data mining and computer graphics.',
      },
    ],
  },
  {
    year: '2022',
    events: [
      {
        title: 'First teaching role',
        text: 'Teaching assistant for Algorithm Design, 2022 to 2023.',
      },
      {
        title: 'First segmentation models',
        text: 'U-Nets in PyTorch for lung and liver tumors in CT scans, over the winter of 2022–23.',
        href: '/work/tumor-segmentation/',
      },
    ],
  },
  {
    year: '2023',
    events: [
      {
        title: 'M.Sc. in Artificial Intelligence begins',
        text: 'After finishing the B.Sc. with 17.97 / 20. Teaching assistant for Data Mining until 2025.',
      },
    ],
  },
  {
    year: '2024',
    events: [
      {
        title: 'Teaching graduate Machine Learning',
        text: 'Teaching assistant for the graduate course, 2024 to 2025. Built a retrieval-augmented QA system over NASA documents.',
      },
    ],
  },
  {
    year: '2025',
    events: [
      {
        title: 'HVB-Persian preprint',
        text: 'A hybrid ParsBERT and VADER sentiment classifier for Persian reviews, on SSRN. F1 of 0.95 on the combined dataset.',
        href: '/work/hvb-persian/',
      },
    ],
  },
  {
    year: '2026',
    events: [
      {
        title: 'When the Document Is Wrong',
        text: 'An independent study of knowledge conflicts in language models: 32,000 scored answers, all public.',
        href: '/work/knowledge-conflict/',
      },
      {
        title: 'The AI Path',
        text: 'A free, week-by-week course from Python to AI agents.',
        href: '/work/the-ai-path/',
      },
    ],
  },
  {
    year: '2027',
    events: [
      {
        title: 'M.Sc. thesis defense',
        text: 'Expected in January: sentiment classification of Persian text with transformer-based and lexicon-based methods.',
      },
    ],
  },
];
