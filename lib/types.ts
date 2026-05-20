export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Logic';

export interface MathQuestion {
  topic: string;
  questionText: string;
  workingSteps: string[];
  finalAnswer: string;
  tip: string;
}
