'use client';

import { useState, useEffect } from 'react';
import { Difficulty, MathQuestion, ModelId, MODELS } from '@/lib/types';
import { generateMathQuestion } from '@/lib/gemini';
import Header from '@/components/Header';
import DifficultySelector from '@/components/DifficultySelector';
import QuestionDisplay from '@/components/QuestionDisplay';
import Controls from '@/components/Controls';
import WorkingSteps from '@/components/WorkingSteps';

export default function MathGeneratorApp() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [model, setModel] = useState<ModelId>('glm-4.5-air');
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [revealedSteps, setRevealedSteps] = useState<number>(0);
  const [isFullReveal, setIsFullReveal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleGenerateQuestion(difficulty, model);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateQuestion = async (
    selectedDiff: Difficulty = difficulty,
    selectedModel: ModelId = model
  ) => {
    setDifficulty(selectedDiff);
    setIsGenerating(true);
    setError(null);
    setRevealedSteps(0);
    setIsFullReveal(false);
    setQuestion(null);

    try {
      const data = await generateMathQuestion(selectedDiff, selectedModel);
      setQuestion(data);
    } catch (err) {
      console.error(err);
      setError('Failed to generate a question. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleShowStep = () => {
    if (question && revealedSteps < question.workingSteps.length) {
      setRevealedSteps(prev => prev + 1);
    }
  };

  const handleFullReveal = () => {
    if (question) {
      setRevealedSteps(question.workingSteps.length);
      setIsFullReveal(true);
    }
  };

  const handleModelChange = (newModel: ModelId) => {
    setModel(newModel);
    handleGenerateQuestion(difficulty, newModel);
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <Header />

        {/* Model selector */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-2">
            <label htmlFor="model-select" className="text-xs font-medium text-neutral-500">
              Model
            </label>
            <select
              id="model-select"
              value={model}
              disabled={isGenerating}
              onChange={(e) => handleModelChange(e.target.value as ModelId)}
              className="text-sm rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DifficultySelector
          difficulty={difficulty}
          isGenerating={isGenerating}
          onSelect={(diff) => handleGenerateQuestion(diff, model)}
        />

        <main className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 border border-neutral-100 overflow-hidden">

          <QuestionDisplay
            difficulty={difficulty}
            question={question}
            isGenerating={isGenerating}
            error={error}
          />

          <Controls
            isGenerating={isGenerating}
            question={question}
            revealedSteps={revealedSteps}
            isFullReveal={isFullReveal}
            onGenerate={() => handleGenerateQuestion(difficulty, model)}
            onShowStep={handleShowStep}
            onFullReveal={handleFullReveal}
          />

          <WorkingSteps
            question={question}
            revealedSteps={revealedSteps}
            isGenerating={isGenerating}
            isFullReveal={isFullReveal}
          />

        </main>
      </div>
    </div>
  );
}
