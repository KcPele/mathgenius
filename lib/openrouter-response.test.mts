import assert from 'node:assert/strict';
import test from 'node:test';

import { parseOpenRouterQuestion } from './openrouter-response.ts';

const question = {
  topic: 'Linear Equations',
  questionText: 'Solve $2x + 3 = 11$.',
  diagram: null,
  stepsIntro: 'Use inverse operations to isolate $x$.',
  workingSteps: ['Subtract 3 from both sides.', 'Divide both sides by 2.'],
  finalAnswer: '$x = 4$',
  tip: 'Undo addition before multiplication.',
};

test('parses JSON wrapped in a markdown code fence', () => {
  const content = `\`\`\`json\n${JSON.stringify(question, null, 2)}\n\`\`\``;

  assert.deepEqual(parseOpenRouterQuestion(content), question);
});
