import { GraduationCap } from 'lucide-react';
import { Difficulty } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  difficulty: Difficulty;
  isGenerating: boolean;
  onSelect: (diff: Difficulty) => void;
}

const difficulties: Difficulty[] = ['Easy', 'Medium', 'Hard', 'Logic'];

export default function DifficultySelector({ difficulty, isGenerating, onSelect }: Props) {
  return (
    <div className="flex justify-center mb-8 overflow-x-auto pb-4">
      <div className="inline-flex bg-white rounded-xl shadow-sm p-1 border border-neutral-200 whitespace-nowrap">
        {difficulties.map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            disabled={isGenerating}
            className={cn(
              "px-4 sm:px-6 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ease-in-out flex items-center gap-2",
              difficulty === level
                ? "bg-blue-600 text-white shadow-sm"
                : "text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 disabled:opacity-50"
            )}
          >
            <GraduationCap className={cn("w-4 h-4", difficulty === level ? "text-white" : "text-neutral-400")} />
            {level}
          </button>
        ))}
      </div>
    </div>
  );
}
