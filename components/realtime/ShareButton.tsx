'use client';

import { Share2 } from 'lucide-react';
import { useState } from 'react';
import type { MathQuestion } from '@/lib/types';
import ShareModal from './ShareModal';

interface Props {
  question: MathQuestion | null;
  disabled?: boolean;
}

export default function ShareButton({ question, disabled }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={disabled || !question}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-foreground bg-pop-blue text-foreground font-semibold text-xs shadow-pop-sm hover:-translate-y-0.5 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Share2 className="w-3.5 h-3.5" />
        Share
      </button>
      <ShareModal open={open} onOpenChange={setOpen} question={question} />
    </>
  );
}
