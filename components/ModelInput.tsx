'use client';

import { Cpu, Check } from 'lucide-react';
import { useState } from 'react';

interface Props {
  model: string;
  isGenerating: boolean;
  onSave: (model: string) => void;
}

export default function ModelInput({ model, isGenerating, onSave }: Props) {
  const [input, setInput] = useState(model);
  const dirty = input.trim() !== model && input.trim().length > 0;

  return (
    <div className="flex items-center gap-2 bg-canvas border-2 border-foreground rounded-full pl-4 pr-1 py-1 shadow-pop w-full sm:w-auto">
      <Cpu className="w-4 h-4 text-neutral-600 shrink-0" />
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && dirty) onSave(input.trim());
        }}
        placeholder="openrouter model, e.g. xiaomi/mimo-v2.5-pro"
        disabled={isGenerating}
        className="bg-transparent text-sm font-medium text-foreground placeholder:text-neutral-400 focus:outline-none w-full sm:w-72"
      />
      <button
        type="button"
        onClick={() => dirty && onSave(input.trim())}
        disabled={isGenerating || !dirty}
        className="inline-flex items-center gap-1 rounded-full bg-foreground text-canvas text-xs font-semibold px-3 py-1.5 disabled:opacity-40"
      >
        <Check className="w-3.5 h-3.5" /> Save
      </button>
    </div>
  );
}
