import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Sparkles, Loader2 } from 'lucide-react';
import { Difficulty, MathQuestion } from '@/lib/types';

interface Props {
  difficulty: Difficulty;
  question: MathQuestion | null;
  isGenerating: boolean;
  error: string | null;
}

export default function QuestionDisplay({ difficulty, question, isGenerating, error }: Props) {
  return (
    <div className="p-8 sm:p-10 border-b border-neutral-100 bg-white">
      {/* Header row: label + difficulty badge */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-xs font-bold tracking-widest text-neutral-400 uppercase">
          Current Problem
        </h2>
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 ring-1 ring-blue-200">
          <Sparkles className="w-3.5 h-3.5" />
          {difficulty}
        </span>
      </div>

      <div className="min-h-[140px]">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[140px] gap-3 text-neutral-400"
            >
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <p className="text-sm font-medium">Crafting a {difficulty} problem…</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[140px] text-red-500 text-center"
            >
              <p>{error}</p>
            </motion.div>
          ) : question ? (
            <motion.div
              key={question.questionText}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Topic badge */}
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-blue-600 text-white tracking-wide">
                  {question.topic}
                </span>
              </div>

              {/* Question text */}
              <div className="markdown-body text-xl sm:text-2xl text-neutral-800 font-medium leading-relaxed overflow-x-auto pb-2">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {question.questionText}
                </ReactMarkdown>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </div>
  );
}
