'use client';

import { Difficulty } from '@/lib/types';
import { cn } from '@/lib/utils';

interface Props {
  difficulty: Difficulty;
  isGenerating: boolean;
  onSelect: (diff: Difficulty) => void;
}

const difficulties: { id: Difficulty; emoji: string }[] = [
  { id: 'Easy', emoji: '🌱' },
  { id: 'Medium', emoji: '⚡' },
  { id: 'Hard', emoji: '🔥' },
  { id: 'Logic', emoji: '🧩' },
];

export default function DifficultySelector({ difficulty, isGenerating, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      {difficulties.map(({ id, emoji }) => {
        const active = difficulty === id;
        return (
          <button
            key={id}
            onClick={() => onSelect(id)}
            disabled={isGenerating}
            className={cn(
              'inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-foreground text-sm font-semibold transition-all shadow-pop',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              active
                ? 'bg-foreground text-canvas -translate-y-0.5'
                : 'bg-canvas text-foreground hover:bg-paper'
            )}
          >
            <span aria-hidden>{emoji}</span>
            {id}
          </button>
        );
      })}
    </div>
  );
}
