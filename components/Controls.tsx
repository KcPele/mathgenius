'use client';

import { RefreshCw, Eye, CheckCircle, Loader2 } from 'lucide-react';
import { MathQuestion } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  isGenerating: boolean;
  question: MathQuestion | null;
  revealedSteps: number;
  isFullReveal: boolean;
  onGenerate: () => void;
  onShowStep: () => void;
  onFullReveal: () => void;
}

export default function Controls({
  isGenerating,
  question,
  revealedSteps,
  isFullReveal,
  onGenerate,
  onShowStep,
  onFullReveal,
}: Props) {
  const stepsDone = !!question && revealedSteps >= question.workingSteps.length;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-black font-semibold text-sm',
          'bg-black text-white shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-transform',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
        Generate
      </button>

      <button
        onClick={onShowStep}
        disabled={isGenerating || !question || stepsDone}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-black font-semibold text-sm',
          'bg-[#c8b6ff] text-black shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-transform',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <Eye className="w-4 h-4" />
        Show Step
      </button>

      <button
        onClick={onFullReveal}
        disabled={isGenerating || !question || isFullReveal || stepsDone}
        className={cn(
          'inline-flex items-center gap-2 px-5 py-3 rounded-full border-2 border-black font-semibold text-sm',
          'bg-[#ffe066] text-black shadow-[3px_3px_0_0_#000] hover:-translate-y-0.5 transition-transform',
          'disabled:opacity-50 disabled:cursor-not-allowed'
        )}
      >
        <CheckCircle className="w-4 h-4" />
        Full Reveal
      </button>
    </div>
  );
}
