'use client';

import { useState, useEffect } from 'react';
import { Difficulty, MathQuestion, ModelId, MODELS, Provider, PROVIDERS } from '@/lib/types';
import { generateMathQuestion } from '@/lib/gemini';
import Header from '@/components/Header';
import DifficultySelector from '@/components/DifficultySelector';
import QuestionDisplay from '@/components/QuestionDisplay';
import Controls from '@/components/Controls';
import WorkingSteps from '@/components/WorkingSteps';

const OPENROUTER_MODEL_KEY = 'mathgenius_openrouter_model';

export default function MathGeneratorApp() {
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [provider, setProvider] = useState<Provider>('zai');
  const [model, setModel] = useState<ModelId>('glm-4.5-air');
  const [openRouterModel, setOpenRouterModel] = useState<string>('');
  const [openRouterInput, setOpenRouterInput] = useState<string>('');
  const [question, setQuestion] = useState<MathQuestion | null>(null);
  const [revealedSteps, setRevealedSteps] = useState<number>(0);
  const [isFullReveal, setIsFullReveal] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(OPENROUTER_MODEL_KEY);
    if (saved) {
      setOpenRouterModel(saved);
      setOpenRouterInput(saved);
    }
  }, []);

  useEffect(() => {
    const activeModel = provider === 'openrouter' ? openRouterModel : model;
    if (activeModel) {
      handleGenerateQuestion(difficulty, activeModel, provider);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleGenerateQuestion = async (
    selectedDiff: Difficulty = difficulty,
    selectedModel: string = provider === 'openrouter' ? openRouterModel : model,
    selectedProvider: Provider = provider
  ) => {
    if (selectedProvider === 'openrouter' && !selectedModel) return;

    setDifficulty(selectedDiff);
    setIsGenerating(true);
    setError(null);
    setRevealedSteps(0);
    setIsFullReveal(false);
    setQuestion(null);

    try {
      const data = await generateMathQuestion(selectedDiff, selectedModel, selectedProvider);
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
    handleGenerateQuestion(difficulty, newModel, 'zai');
  };

  const handleProviderChange = (newProvider: Provider) => {
    setProvider(newProvider);
    if (newProvider === 'openrouter' && openRouterModel) {
      handleGenerateQuestion(difficulty, openRouterModel, 'openrouter');
    } else if (newProvider === 'zai') {
      handleGenerateQuestion(difficulty, model, 'zai');
    }
  };

  const handleSaveOpenRouterModel = () => {
    const trimmed = openRouterInput.trim();
    if (!trimmed) return;
    setOpenRouterModel(trimmed);
    localStorage.setItem(OPENROUTER_MODEL_KEY, trimmed);
    handleGenerateQuestion(difficulty, trimmed, 'openrouter');
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 font-sans selection:bg-blue-200">
      <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <Header />

        {/* Provider & Model selector */}
        <div className="flex justify-end mb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <label htmlFor="provider-select" className="text-xs font-medium text-neutral-500">
                Provider
              </label>
              <select
                id="provider-select"
                value={provider}
                disabled={isGenerating}
                onChange={(e) => handleProviderChange(e.target.value as Provider)}
                className="text-sm rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {PROVIDERS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            {provider === 'zai' ? (
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
            ) : (
              <div className="flex items-center gap-2">
                <label htmlFor="openrouter-model" className="text-xs font-medium text-neutral-500">
                  Model
                </label>
                <input
                  id="openrouter-model"
                  type="text"
                  value={openRouterInput}
                  onChange={(e) => setOpenRouterInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveOpenRouterModel()}
                  placeholder="e.g. openai/gpt-4o"
                  disabled={isGenerating}
                  className="text-sm rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-neutral-700 font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed w-48"
                />
                <button
                  onClick={handleSaveOpenRouterModel}
                  disabled={isGenerating || !openRouterInput.trim()}
                  className="text-sm rounded-lg bg-blue-600 text-white px-3 py-1.5 font-medium shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>

        <DifficultySelector
          difficulty={difficulty}
          isGenerating={isGenerating}
          onSelect={(diff) => handleGenerateQuestion(diff)}
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
            onGenerate={() => handleGenerateQuestion()}
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
