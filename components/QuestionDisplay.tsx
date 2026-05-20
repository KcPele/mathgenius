'use client';

import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Loader2 } from 'lucide-react';
import { Difficulty, MathQuestion } from '@/lib/types';
import Starburst from './Starburst';

interface Props {
  difficulty: Difficulty;
  question: MathQuestion | null;
  isGenerating: boolean;
  error: string | null;
}

export default function QuestionDisplay({ difficulty, question, isGenerating, error }: Props) {
  return (
    <section className="relative rounded-3xl bg-canvas border-2 border-foreground p-7 sm:p-10 shadow-pop-lg">
      <div className="absolute -top-6 -left-4 w-16 h-16 sm:w-20 sm:h-20">
        <Starburst color="yellow">
          <span className="font-display text-base sm:text-lg text-foreground">{difficulty}</span>
        </Starburst>
      </div>

      <div className="flex items-center justify-between mb-5 pl-14 sm:pl-16">
        <h2 className="text-xs font-bold tracking-[0.25em] text-neutral-500 uppercase">
          Current Problem
        </h2>
      </div>

      <div className="min-h-[140px]">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-[160px] gap-3 text-neutral-500"
            >
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Crafting a {difficulty} problem…</p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-[160px] text-red-600 text-center font-medium"
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
              <div className="mb-4">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-foreground text-canvas tracking-wide uppercase">
                  {question.topic}
                </span>
              </div>
              <div className="markdown-body text-xl sm:text-2xl text-foreground font-medium leading-relaxed overflow-x-auto pb-2">
                <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
                  {question.questionText}
                </ReactMarkdown>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-center h-[160px] text-neutral-400 text-sm"
            >
              Pick a difficulty + model, then generate a problem.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
