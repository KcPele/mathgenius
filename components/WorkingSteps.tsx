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
  return (
    <div className="p-8 sm:p-10 bg-white min-h-[300px]">
      <h3 className="text-xs font-bold tracking-widest text-neutral-400 uppercase mb-8">
        Solution Steps
      </h3>

      <div className="space-y-6">
        <AnimatePresence>
          {question?.workingSteps.map((step, index) =>
            index < revealedSteps ? (
              <motion.div
                key={`step-${index}`}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                  {index + 1}
                </div>
                <div className="markdown-body pt-1 text-neutral-700 text-lg leading-relaxed overflow-x-auto">
                  <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                    {step}
                  </ReactMarkdown>
                </div>
              </motion.div>
            ) : null
          )}
        </AnimatePresence>

        {/* Final Answer */}
        <AnimatePresence>
          {question && revealedSteps >= question.workingSteps.length && revealedSteps > 0 && (
            <motion.div
              key="final-answer"
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2, type: 'spring' }}
              className="mt-10 p-6 bg-green-50 rounded-2xl border border-green-100 text-center overflow-x-auto"
            >
              <h4 className="text-xs font-bold tracking-widest text-green-600 uppercase mb-4">
                Final Answer
              </h4>
              <div className="markdown-body text-3xl text-green-900 font-semibold">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {question.finalAnswer}
                </ReactMarkdown>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tutor Tip — shown only after full reveal */}
        <AnimatePresence>
          {isFullReveal && question?.tip && (
            <motion.div
              key="tip"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45, delay: 0.55 }}
              className="p-5 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center">
                <Lightbulb className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold tracking-widest text-amber-600 uppercase mb-1">
                  Tutor Tip
                </p>
                <p className="text-neutral-700 text-sm leading-relaxed">{question.tip}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!isGenerating && revealedSteps === 0 && question && (
          <div className="text-center py-12 text-neutral-400 flex flex-col items-center gap-3">
            <ChevronDown className="w-8 h-8 animate-bounce opacity-50" />
            <p className="text-sm">Click &quot;Show Partial Working&quot; to begin solving.</p>
          </div>
        )}
      </div>
    </div>
  );
}
