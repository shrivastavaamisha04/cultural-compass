
import React, { useState, useRef } from 'react';
import { AppState } from './types';
import { getCulturalAdvice } from './services/geminiService';
import CompassLoader from './components/CompassLoader';
import ResultCard from './components/ResultCard';
import { motion, AnimatePresence } from 'framer-motion';

const GUIDING_QUESTIONS = [
  { id: 'greet', label: 'How to greet people?', icon: '🤝', prompt: 'How should I greet people formally and informally?' },
  { id: 'wear', label: 'What should I wear?', icon: '👔', prompt: 'What is the acceptable dress code for daily life and business?' },
  { id: 'thank', label: 'How to thank people?', icon: '🙏', prompt: 'What is the most polite way to say thank you?' },
  { id: 'behavior', label: 'General behavior?', icon: '✨', prompt: 'What are the general rules of acceptable social behavior?' },
  { id: 'donts', label: 'Top 3 Don\'ts?', icon: '🚫', prompt: 'What are the top 3 absolute "don\'ts" while roaming the city?' },
  { id: 'dining', label: 'Dining etiquette?', icon: '🍽️', prompt: 'What should I know about dining etiquette and tipping?' },
];

const GENDER_OPTIONS = ["Non-binary", "Woman", "Man"];

const App: React.FC = () => {
  const [state, setState] = useState<AppState>({
    origin: '',
    destination: '',
    gender: 'Woman',
    scenario: '',
    isRecording: false,
    isLoading: false,
    result: null,
    error: null,
  });

  const [lastScenario, setLastScenario] = useState<string>('');
  const [isFallbackMode, setIsFallbackMode] = useState<boolean>(false);

  // Re-fetch advice when gender changes and we have results showing
  // Debounced to prevent rapid API calls
  React.useEffect(() => {
    if (state.result && lastScenario && state.origin && state.destination) {
      const timeoutId = setTimeout(() => {
        handleSubmit(lastScenario);
      }, 500); // Wait 500ms before re-fetching

      return () => clearTimeout(timeoutId);
    }
  }, [state.gender]);

  const handleSubmit = async (scenarioOverride?: string) => {
    const activeScenario = scenarioOverride || state.scenario;
    if (!activeScenario.trim()) return;
    if (!state.origin || !state.destination) {
      setState(prev => ({ ...prev, error: "Please set Origin and Destination countries above." }));
      return;
    }

    // Store the scenario for re-fetching when gender changes
    setLastScenario(activeScenario);

    setState(prev => ({ ...prev, isLoading: true, error: null, result: null }));
    setIsFallbackMode(false);

    try {
      // Monitor console for fallback warnings
      const originalWarn = console.warn;
      let fallbackDetected = false;
      console.warn = (...args) => {
        if (args[0]?.includes('fallback')) {
          fallbackDetected = true;
        }
        originalWarn(...args);
      };

      const advice = await getCulturalAdvice(state.origin, state.destination, state.gender, activeScenario);

      console.warn = originalWarn;
      setIsFallbackMode(fallbackDetected);
      setState(prev => ({ ...prev, result: advice, isLoading: false }));
    } catch (err: any) {
      const errorMessage = err?.message || (typeof err === 'string' ? err : JSON.stringify(err)) || "Unknown error";
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: `Debug Error: ${errorMessage}`
      }));
    }
  };

  const handleReset = () => {
    setState(prev => ({ ...prev, scenario: '', result: null, error: null }));
    setLastScenario('');
  };


  return (
    <div className="h-[100dvh] max-w-md mx-auto flex flex-col relative overflow-hidden">
      {/* Dynamic Header */}
      <header className="flex-none z-50 px-6 py-6 pt-[calc(1.5rem+env(safe-area-inset-top))] flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 glass-container flex items-center justify-center text-xl shadow-sm border-slate-100">
              🧭
            </div>
            <div className="leading-tight">
              <h1 className="text-sm font-black uppercase tracking-widest text-slate-400">Cultural</h1>
              <h2 className="text-xl font-bold text-slate-800">Compass</h2>
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-1.5 glass-container p-1 border-white shadow-sm"
          >
            <div className={`flex flex-col px-2 py-0.5 rounded-lg transition-all ${!state.origin ? 'bg-indigo-50 border border-indigo-100' : 'hover:bg-white/40'}`}>
              <span className={`text-[7px] font-black uppercase tracking-tighter ${!state.origin ? 'text-indigo-400' : 'text-slate-400'}`}>From</span>
              <input
                className={`bg-transparent border-none text-[10px] font-bold w-10 text-center focus:outline-none uppercase placeholder:text-indigo-200 ${!state.origin ? 'text-indigo-600' : 'text-slate-500'}`}
                value={state.origin}
                placeholder="SET"
                onChange={(e) => setState(prev => ({ ...prev, origin: e.target.value.toUpperCase() }))}
                title="Origin Country"
              />
            </div>

            <div className="text-slate-300 self-center">
              <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>

            <div className={`flex flex-col px-2 py-0.5 rounded-lg transition-all border ${!state.destination ? 'bg-indigo-600 shadow-lg border-indigo-700' : 'bg-white/80 shadow-sm border-slate-50'}`}>
              <span className={`text-[7px] font-black uppercase tracking-tighter ${!state.destination ? 'text-white/60' : 'text-indigo-500'}`}>To</span>
              <input
                className={`bg-transparent border-none text-[10px] font-bold w-12 text-center focus:outline-none uppercase placeholder:text-white/40 ${!state.destination ? 'text-white' : 'text-slate-800'}`}
                value={state.destination}
                placeholder="HERE"
                onChange={(e) => setState(prev => ({ ...prev, destination: e.target.value.toUpperCase() }))}
                title="Destination Country"
              />
            </div>
          </motion.div>
        </div>

        {/* Gender Selection Bar */}
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-container flex p-1 border-white shadow-sm"
        >
          {GENDER_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setState(prev => ({ ...prev, gender: opt }))}
              className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${state.gender === opt
                ? 'bg-slate-800 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-600'
                }`}
            >
              {opt}
            </button>
          ))}
        </motion.div>
      </header>

      <main className="flex-1 overflow-y-auto px-6 pb-32">
        <AnimatePresence mode="wait">
          {isFallbackMode && state.result && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs font-medium text-center flex items-center justify-center gap-2"
            >
              <span>⚡</span>
              <span>Offline mode - showing general guidance</span>
            </motion.div>
          )}

          {state.error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs font-bold text-center"
            >
              {state.error}
            </motion.div>
          )}

          {!state.isLoading && !state.result && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-slate-800 tracking-tight leading-tight">
                  Your last-minute etiquette guide.
                </h2>
                <p className="text-slate-500 font-medium">Quick answers for smooth travels.</p>
              </div>

              {/* Guiding Questions Grid */}
              <div className="grid grid-cols-2 gap-3">
                {GUIDING_QUESTIONS.map((q) => (
                  <motion.button
                    key={q.id}
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.9)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSubmit(q.prompt)}
                    className="flex flex-col items-start gap-3 p-4 glass-container border-slate-50 text-left transition-all hover:shadow-md"
                  >
                    <span className="text-2xl">{q.icon}</span>
                    <span className="text-sm font-bold text-slate-700 leading-snug">{q.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="relative pt-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Or ask anything</span>
                  <div className="h-[1px] flex-1 bg-slate-200"></div>
                </div>

                <form
                  onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
                  className="relative glass-container p-4 group focus-within:ring-2 focus-within:ring-slate-200 transition-all border-slate-100"
                >
                  <textarea
                    className="w-full bg-transparent border-none text-slate-800 text-lg font-medium placeholder:text-slate-300 focus:outline-none resize-none min-h-[80px]"
                    placeholder="e.g. Can I blow my nose at the table?"
                    value={state.scenario}
                    onChange={(e) => setState(prev => ({ ...prev, scenario: e.target.value }))}
                  />
                  <div className="flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={!state.scenario.trim()}
                      className="bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold disabled:opacity-20 hover:scale-105 transition-all text-sm shadow-sm"
                    >
                      Get Advice
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {state.isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full flex items-center justify-center py-20"
            >
              <CompassLoader />
            </motion.div>
          )}

          {state.result && (
            <ResultCard key="result" advice={state.result} onReset={handleReset} />
          )}
        </AnimatePresence>
      </main>

      <footer className="flex-none h-16 pb-[calc(1rem+env(safe-area-inset-bottom))] flex items-center justify-center pointer-events-none">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-300">The Cultural Compass • Last Minute Etiquette • v1.2</p>
      </footer>
    </div>
  );
};

export default App;
