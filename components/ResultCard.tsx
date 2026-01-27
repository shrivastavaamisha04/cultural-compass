
import React from 'react';
import { CulturalAdvice } from '../types';
import { motion } from 'framer-motion';

interface ResultCardProps {
  advice: CulturalAdvice;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ advice, onReset }) => {
  const [expandedSteps, setExpandedSteps] = React.useState<boolean[]>([false, false, false]);

  const toggleStep = (index: number) => {
    setExpandedSteps(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const stepLabels = ["Green Light", "The Interaction", "The Close"];
  // Using darker pastel border accents for the light theme
  const stepColors = ["border-emerald-400/80 text-emerald-800", "border-sky-400/80 text-sky-800", "border-indigo-400/80 text-indigo-800"];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 pb-12"
    >
      <motion.div variants={item} className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
          {advice.title}
        </h2>
      </motion.div>

      <div className="space-y-4">
        {advice.steps.map((step, idx) => {
          const isExpanded = expandedSteps[idx];
          const needsTruncation = step.length > 120;
          
          return (
            <motion.div 
              key={idx} 
              variants={item}
              className={`flex flex-col gap-2 p-5 glass-container border-l-4 ${stepColors[idx]} bg-white/70 shadow-sm border-white/50`}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-40">
                {stepLabels[idx]}
              </span>
              <p className="text-slate-800 text-lg font-medium">
                {isExpanded || !needsTruncation ? step : truncateText(step)}
              </p>
              {needsTruncation && (
                <button
                  onClick={() => toggleStep(idx)}
                  className="text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors self-start mt-1"
                >
                  {isExpanded ? '← Show less' : 'Read more →'}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>
      </div>

      <motion.div 
        variants={item}
        className="bg-red-50 border-2 border-red-200 rounded-3xl p-6 relative overflow-hidden group shadow-sm"
      >
        <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
          <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="text-red-500 text-[10px] font-bold uppercase tracking-widest mb-1">Critical Taboo</div>
        <p className="text-red-900 font-bold text-xl leading-snug">{advice.taboo}</p>
      </motion.div>

      <motion.div 
        variants={item}
        className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 rounded-3xl p-8 text-center relative overflow-hidden shadow-sm"
      >
        <div className="absolute -top-12 -left-12 w-40 h-40 bg-indigo-200/20 blur-[60px]"></div>
        <div className="relative z-10 space-y-3">
          <div className="text-indigo-400 text-[10px] font-bold uppercase tracking-[0.3em]">Local Phrase</div>
          <div className="text-5xl font-bold tracking-tighter text-slate-800">{advice.phrase.native}</div>
          <div className="text-slate-500 italic font-medium">"{advice.phrase.phonetic}"</div>
          <div className="pt-2">
            <span className="bg-white border border-indigo-100 px-4 py-1.5 rounded-full text-sm font-semibold text-indigo-700 shadow-sm">
              {advice.phrase.meaning}
            </span>
          </div>
        </div>
      </motion.div>

      <motion.button 
        variants={item}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onReset}
        className="w-full py-5 bg-white border border-slate-100 rounded-2xl text-slate-800 font-bold shadow-sm hover:shadow-md transition-all"
      >
        Ask Another Scenario
      </motion.button>
    </motion.div >
  );
};

export default ResultCard;
