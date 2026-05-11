import { RefreshCw, Eye, CheckCircle, Loader2 } from 'lucide-react';
import { MathQuestion } from '@/lib/types';

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
  onFullReveal
}: Props) {
  return (
    <div className="px-8 py-6 bg-white border-b border-neutral-100 flex flex-wrap items-center justify-center gap-4">
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl font-medium hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2"
      >
        {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
        Generate Question
      </button>
      
      <button
        onClick={onShowStep}
        disabled={isGenerating || !question || revealedSteps >= question.workingSteps.length}
        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 rounded-xl font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <Eye className="w-5 h-5" />
        Show Partial Working
      </button>

      <button
        onClick={onFullReveal}
        disabled={isGenerating || !question || isFullReveal || revealedSteps >= question.workingSteps.length}
        className="inline-flex items-center gap-2 px-6 py-3 bg-white text-neutral-700 border border-neutral-200 rounded-xl font-medium hover:bg-neutral-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-neutral-200 focus:ring-offset-2"
      >
        <CheckCircle className="w-5 h-5" />
        Full Reveal
      </button>
    </div>
  );
}
