import { Difficulty, MathQuestion, Provider } from './types';

export async function generateMathQuestion(
  difficulty: Difficulty,
  model: string,
  provider: Provider
): Promise<MathQuestion> {
  const response = await fetch('/api/generate-question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ difficulty, model, provider }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`API error ${response.status}: ${err}`);
  }

  return response.json();
}
