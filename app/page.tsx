'use client';

import { useCallback, useEffect, useState } from 'react';
import { Difficulty, MathQuestion } from '@/lib/types';
import { generateMathQuestion } from '@/lib/openrouter';
import Header from '@/components/Header';
import DifficultySelector from '@/components/DifficultySelector';
import ModelInput from '@/components/ModelInput';
import StatsBanner from '@/components/StatsBanner';
import QuestionDisplay from '@/components/QuestionDisplay';
import Controls from '@/components/Controls';
import WorkingSteps from '@/components/WorkingSteps';
import { useRealtime } from '@/lib/realtime/useRealtime';

const MODEL_KEY = 'stargirl_openrouter_model';
const DEFAULT_MODEL = 'xiaomi/mimo-v2.5-pro';

export default function StarGirlApp() {
  useRealtime();

  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [model, setModel] = useState<string>('');
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [revealedSteps, setRevealedSteps] = useState<number>(0);
  const [isFullReveal, setIsFullReveal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(
    async (
      diff: Difficulty = difficulty,
      selectedModel: string = model
    ) => {
      if (!selectedModel) return;
      setDifficulty(diff);
      setIsGenerating(true);
      setError(null);
      setRevealedSteps(0);
      setIsFullReveal(false);
      setQuestion(null);

      try {
        const data = await generateMathQuestion(diff, selectedModel);
        setQuestion(data);
      } catch (err) {
        console.error(err);
        setError(
          'Failed to generate a question. Check your OpenRouter model id and try again.'
        );
      } finally {
        setIsGenerating(false);
      }
    },
    [difficulty, model]
  );

  useEffect(() => {
    const saved = localStorage.getItem(MODEL_KEY) || DEFAULT_MODEL;
    // Bootstrap from localStorage on mount — single fire, intentional setState.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModel(saved);
    if (saved) handleGenerate(difficulty, saved);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleShowStep = () => {
    if (question && revealedSteps < question.workingSteps.length) {
      setRevealedSteps((p) => p + 1);
    }
  };

  const handleFullReveal = () => {
    if (question) {
      setRevealedSteps(question.workingSteps.length);
      setIsFullReveal(true);
    }
  };

  const handleSaveModel = (next: string) => {
    setModel(next);
    localStorage.setItem(MODEL_KEY, next);
    handleGenerate(difficulty, next);
  };

  const handleOpenSharedQuestion = useCallback((incoming: MathQuestion) => {
    setQuestion(incoming);
    setRevealedSteps(0);
    setIsFullReveal(false);
    setError(null);
    setIsGenerating(false);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1 flex flex-col gap-8">
        <Header onOpenSharedQuestion={handleOpenSharedQuestion} />

        <section className="flex flex-col gap-3">
          <h1 className="font-display text-4xl sm:text-5xl text-foreground">My Tutor</h1>
          <p className="text-neutral-600 text-sm sm:text-base max-w-xl">
            Generate an open-ended math problem, then reveal worked steps one at a time. Powered by
            any model on OpenRouter.
          </p>
        </section>

        <StatsBanner question={question} revealedSteps={revealedSteps} />

        <section className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <DifficultySelector
              difficulty={difficulty}
              isGenerating={isGenerating}
              onSelect={(d) => handleGenerate(d)}
            />
            <ModelInput model={model} isGenerating={isGenerating} onSave={handleSaveModel} />
          </div>
          <Controls
            isGenerating={isGenerating}
            question={question}
            revealedSteps={revealedSteps}
            isFullReveal={isFullReveal}
            onGenerate={() => handleGenerate()}
            onShowStep={handleShowStep}
            onFullReveal={handleFullReveal}
          />
        </section>

        <QuestionDisplay
          difficulty={difficulty}
          question={question}
          isGenerating={isGenerating}
          error={error}
        />

        <WorkingSteps
          question={question}
          revealedSteps={revealedSteps}
          isGenerating={isGenerating}
          isFullReveal={isFullReveal}
        />

        <footer className="mt-4 pt-6 border-t border-foreground/10 text-xs text-neutral-500 text-center">
          Set <code className="font-mono">OPENROUTER_API_KEY</code> in <code className="font-mono">.env.local</code> · model is saved per browser.
        </footer>
      </div>
    </div>
  );
}
