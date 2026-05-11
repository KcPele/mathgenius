export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'Logic';

export type ModelId = 'glm-4.5-air' | 'glm-4.7';

export const MODELS: { id: ModelId; label: string }[] = [
  { id: 'glm-4.5-air', label: 'GLM-4.5 Air' },
  { id: 'glm-4.7',     label: 'GLM-4.7' },
];

export interface MathQuestion {
  topic: string;
  questionText: string;
  workingSteps: string[];
  finalAnswer: string;
  tip: string;
}
