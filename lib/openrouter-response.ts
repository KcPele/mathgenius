import type { MathQuestion } from './types';

export function parseOpenRouterQuestion(content: string): MathQuestion {
  const trimmed = content.trim();
  const fencedJson = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

  return JSON.parse(fencedJson?.[1] ?? trimmed) as MathQuestion;
}
