/**
 * Results of "When the document is wrong" (rag-knowledge-conflict).
 *
 * Every number here is transcribed from the repository's published tables:
 *   https://github.com/SoroushJaberi/rag-knowledge-conflict
 *   - README.md (results table, paired comparison)
 *   - results/summary.md (per-condition outcomes, cost)
 *   - results/extra_analyses.md (fixed-set comparison, cheap detectors)
 * If the study is re-run, update this file and every figure follows.
 */

export const SOURCE = 'https://github.com/SoroushJaberi/rag-knowledge-conflict';

export type ModelSize = '1.7B' | '4B' | '8B' | '14B';
export type Condition = 'none' | 'correct' | 'wrong' | 'unrelated';

/** Share of answers (per cent of 1,000 questions) in each outcome class. */
export type Outcome = { truth: number; planted: number; idk: number; other: number };

export type Run = {
  id: string;
  size: ModelSize;
  thinking: boolean;
  /** Closed-book accuracy, %. Also the share of "known facts". */
  closedBook: number;
  /** Number of facts the model answers correctly with no document. */
  known: number;
  /** Among known facts: % that switch to the planted answer. 95% bootstrap CI. */
  overwrite: number;
  ci: [number, number];
  /** Among known facts: % that keep the true answer. */
  kept: number;
  /** Conflict-detection AUROC from answer confidence. */
  auroc: number;
  /** Generation cost over all four conditions. */
  tokens: number;
  gpuSeconds: number;
  energyWh: number;
  /** Outcomes over all 1,000 questions, per condition. */
  outcomes: Record<Condition, Outcome>;
};

export const runs: Run[] = [
  {
    id: '1.7B-off', size: '1.7B', thinking: false,
    closedBook: 12.8, known: 128, overwrite: 54.7, ci: [46, 62], kept: 10.2, auroc: 0.54,
    tokens: 6, gpuSeconds: 13, energyWh: 0.4,
    outcomes: {
      none: { truth: 12.8, planted: 0.2, idk: 6.1, other: 80.9 },
      correct: { truth: 72.6, planted: 0.0, idk: 9.2, other: 18.2 },
      wrong: { truth: 2.5, planted: 59.0, idk: 12.2, other: 26.3 },
      unrelated: { truth: 0.2, planted: 0.0, idk: 98.0, other: 1.8 },
    },
  },
  {
    id: '4B-off', size: '4B', thinking: false,
    closedBook: 15.0, known: 150, overwrite: 49.3, ci: [42, 57], kept: 11.3, auroc: 0.53,
    tokens: 6, gpuSeconds: 15, energyWh: 0.7,
    outcomes: {
      none: { truth: 15.0, planted: 0.0, idk: 46.7, other: 38.3 },
      correct: { truth: 73.6, planted: 0.0, idk: 16.2, other: 10.2 },
      wrong: { truth: 4.5, planted: 54.4, idk: 26.3, other: 14.8 },
      unrelated: { truth: 0.0, planted: 0.0, idk: 99.5, other: 0.5 },
    },
  },
  {
    id: '8B-off', size: '8B', thinking: false,
    closedBook: 25.1, known: 251, overwrite: 61.8, ci: [56, 67], kept: 13.1, auroc: 0.59,
    tokens: 6, gpuSeconds: 19, energyWh: 1.1,
    outcomes: {
      none: { truth: 25.1, planted: 0.0, idk: 31.8, other: 43.1 },
      correct: { truth: 79.3, planted: 0.0, idk: 12.0, other: 8.7 },
      wrong: { truth: 5.5, planted: 59.0, idk: 21.9, other: 13.6 },
      unrelated: { truth: 0.1, planted: 0.0, idk: 99.4, other: 0.5 },
    },
  },
  {
    id: '14B-off', size: '14B', thinking: false,
    closedBook: 30.5, known: 304, overwrite: 57.6, ci: [52, 63], kept: 15.5, auroc: 0.6,
    tokens: 6, gpuSeconds: 27, energyWh: 2.0,
    outcomes: {
      none: { truth: 30.5, planted: 0.1, idk: 28.4, other: 41.0 },
      correct: { truth: 82.8, planted: 0.0, idk: 10.1, other: 7.1 },
      wrong: { truth: 7.2, planted: 60.5, idk: 20.1, other: 12.2 },
      unrelated: { truth: 0.0, planted: 0.0, idk: 99.7, other: 0.3 },
    },
  },
  {
    id: '1.7B-on', size: '1.7B', thinking: true,
    closedBook: 14.0, known: 140, overwrite: 56.4, ci: [49, 64], kept: 6.4, auroc: 0.53,
    tokens: 52, gpuSeconds: 42, energyWh: 2.3,
    outcomes: {
      none: { truth: 14.0, planted: 0.0, idk: 11.2, other: 74.8 },
      correct: { truth: 70.6, planted: 0.0, idk: 10.9, other: 18.5 },
      wrong: { truth: 2.2, planted: 58.3, idk: 15.3, other: 24.2 },
      unrelated: { truth: 0.0, planted: 0.0, idk: 98.6, other: 1.4 },
    },
  },
  {
    id: '4B-on', size: '4B', thinking: true,
    closedBook: 26.5, known: 265, overwrite: 52.1, ci: [46, 58], kept: 10.6, auroc: 0.63,
    tokens: 405, gpuSeconds: 174, energyWh: 13.3,
    outcomes: {
      none: { truth: 26.5, planted: 0.1, idk: 14.4, other: 59.0 },
      correct: { truth: 79.7, planted: 0.0, idk: 13.1, other: 7.2 },
      wrong: { truth: 5.3, planted: 57.6, idk: 26.5, other: 10.6 },
      unrelated: { truth: 0.0, planted: 0.0, idk: 99.7, other: 0.3 },
    },
  },
  {
    id: '8B-on', size: '8B', thinking: true,
    closedBook: 34.8, known: 348, overwrite: 67.8, ci: [63, 73], kept: 6.9, auroc: 0.68,
    tokens: 402, gpuSeconds: 232, energyWh: 19.0,
    outcomes: {
      none: { truth: 34.8, planted: 0.1, idk: 10.2, other: 54.9 },
      correct: { truth: 79.7, planted: 0.0, idk: 12.9, other: 7.4 },
      wrong: { truth: 4.9, planted: 62.2, idk: 21.1, other: 11.8 },
      unrelated: { truth: 0.0, planted: 0.0, idk: 99.9, other: 0.1 },
    },
  },
  {
    id: '14B-on', size: '14B', thinking: true,
    closedBook: 39.3, known: 393, overwrite: 65.9, ci: [61, 70], kept: 7.9, auroc: 0.7,
    tokens: 304, gpuSeconds: 207, energyWh: 19.0,
    outcomes: {
      none: { truth: 39.3, planted: 0.1, idk: 16.4, other: 44.2 },
      correct: { truth: 80.4, planted: 0.0, idk: 14.3, other: 5.3 },
      wrong: { truth: 5.1, planted: 59.9, idk: 26.6, other: 8.4 },
      unrelated: { truth: 0.0, planted: 0.0, idk: 100.0, other: 0.0 },
    },
  },
];

/**
 * Thinking on vs off on the same facts (known in both modes).
 * `onlyOn` / `onlyOff` count facts overwritten in just one mode.
 */
export const paired = [
  { size: '1.7B', n: 93, off: 52.7, on: 53.8, onlyOn: 4, onlyOff: 3, p: 1.0 },
  { size: '4B', n: 122, off: 48.4, on: 52.5, onlyOn: 15, onlyOff: 10, p: 0.42 },
  { size: '8B', n: 196, off: 61.2, on: 67.9, onlyOn: 28, onlyOff: 15, p: 0.066 },
  { size: '14B', n: 255, off: 56.5, on: 65.9, onlyOn: 35, onlyOff: 11, p: 0.0005 },
] as const;

/** "Ask twice" detector: AUROC on known facts vs on all 1,000 questions. */
export const askTwice = [
  { size: '1.7B', thinking: false, known: 0.75, all: 0.52 },
  { size: '1.7B', thinking: true, known: 0.74, all: 0.52 },
  { size: '4B', thinking: false, known: 0.72, all: 0.52 },
  { size: '4B', thinking: true, known: 0.72, all: 0.53 },
  { size: '8B', thinking: false, known: 0.79, all: 0.55 },
  { size: '8B', thinking: true, known: 0.81, all: 0.59 },
  { size: '14B', thinking: false, known: 0.75, all: 0.56 },
  { size: '14B', thinking: true, known: 0.79, all: 0.59 },
] as const;

export const sizes: ModelSize[] = ['1.7B', '4B', '8B', '14B'];

export const conditions: { id: Condition; label: string; note: string }[] = [
  { id: 'none', label: 'No document', note: 'The model answers from memory.' },
  { id: 'correct', label: 'Correct document', note: 'The passage contains the true answer.' },
  { id: 'wrong', label: 'Wrong document', note: 'The same passage with the answer swapped.' },
  { id: 'unrelated', label: 'Unrelated document', note: 'The passage from a different question.' },
];

export const outcomeLabels: Record<keyof Outcome, string> = {
  truth: 'True answer',
  planted: 'Planted answer',
  idk: '“I don’t know”',
  other: 'Other',
};

/** Headline range across all eight runs. */
export const overwriteRange = {
  min: Math.min(...runs.map((r) => r.overwrite)),
  max: Math.max(...runs.map((r) => r.overwrite)),
};

export function getRun(size: ModelSize, thinking: boolean): Run {
  const run = runs.find((r) => r.size === size && r.thinking === thinking);
  if (!run) throw new Error(`No run for ${size} thinking=${thinking}`);
  return run;
}
