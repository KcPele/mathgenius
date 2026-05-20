export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Logic';

export type DiagramKind = 'mermaid' | 'svg';

export interface Diagram {
  kind: DiagramKind;
  source: string;
  caption?: string;
}

export interface MathQuestion {
  topic: string;
  questionText: string;
  diagram?: Diagram | null;
  stepsIntro?: string;
  workingSteps: string[];
  finalAnswer: string;
  tip: string;
}
