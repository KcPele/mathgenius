'use client';

import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { ChevronDown, Lightbulb } from 'lucide-react';
import { MathQuestion } from '@/lib/types';

interface Props {
  question: MathQuestion | null;
  revealedSteps: number;
  isGenerating: boolean;
  isFullReveal: boolean;
}

export default function WorkingSteps({ question, revealedSteps, isGenerating, isFullReveal }: Props) {
  const stepsDone = !!question && revealedSteps >= question.workingSteps.length && revealedSteps > 0;

  return (
    <section className="rounded-3xl bg-[#fffaf0] border-2 border-black p-7 sm:p-10 shadow-[6px_6px_0_0_#000] min-h-[260px]">
      <h3 className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase mb-6">
        Solution Steps
      </h3>

      <div className="space-y-5">
        <AnimatePresence>
          {question?.workingSteps.map((step, index) =>
            index < revealedSteps ? (
              <motion.div
                key={`step-${index}`}
                initial={{ opacity: 0, x: -16, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="flex gap-4 items-start"
              >
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center font-display text-sm shadow-[2px_2px_0_0_#000]">
                  {index + 1}
                </div>
                <div className="markdown-body pt-1 text-neutral-800 text-lg leading-relaxed overflow-x-auto">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {step}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        <AnimatePresence>
          {stepsDone && (
            <motion.div
              key="final-answer"
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15, type: 'spring' }}
              className="mt-8 p-6 rounded-2xl bg-[#bce29e] border-2 border-black text-center overflow-x-auto shadow-[3px_3px_0_0_#000]"
            >
              <h4 className="text-xs font-bold tracking-[0.25em] text-black/70 uppercase mb-3">
                Final Answer
              </h4>
              <div className="markdown-body text-3xl text-black font-semibold">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {question!.finalAnswer}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isFullReveal && question?.tip && (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="p-5 rounded-2xl bg-[#ffe066] border-2 border-black flex gap-4 items-start shadow-[3px_3px_0_0_#000]"
            >
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-black/70 uppercase mb-1">
                  Tutor Tip
                </p>
                <p className="text-black text-sm leading-relaxed">{question.tip}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isGenerating && revealedSteps === 0 && question && (
          <div className="text-center py-10 text-neutral-500 flex flex-col items-center gap-3">
            <ChevronDown className="w-7 h-7 animate-bounce opacity-60" />
            <p className="text-sm">Tap &quot;Show Step&quot; to begin solving.</p>
          </div>
        )}
      </div>
    </section>
  );
}
