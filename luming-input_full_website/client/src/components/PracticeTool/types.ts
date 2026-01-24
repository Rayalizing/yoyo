export type PracticeMode = 'finger' | 'base' | 'advanced';

export interface ZigenInfo {
  code: string | string[];
  name: string;
}

export interface ProgressItem {
  index: number;
  count: number; // -1 means not started
}

export interface PracticeState {
  practiceMode: PracticeMode;
  currentChar: string | null;
  streak: number;
  maxStreak: number;
  total: number;
  correct: number;
  startTime: number | null;
  learnedCount: number;
  totalCount: number;
}
