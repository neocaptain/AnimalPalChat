import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import MoodInputHome from './pages/MoodInputHome';
import MoodAnalysis from './pages/MoodAnalysis';
import EmotionResult from './pages/EmotionResult';
import RecommendedSongs from './pages/RecommendedSongs';
import { analyzeMood } from './services/ai';
import type { AnalysisResult } from './services/ai';

type AppState = 'HOME' | 'ANALYSIS' | 'RESULT' | 'RECOMMENDATIONS';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('HOME');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (text: string) => {
    setState('ANALYSIS');
    setError(null);


    try {
      const result = await analyzeMood(text);
      setAnalysisResult(result);
    } catch (err) {
      console.error(err);
      setError("AI analysis failed. Please try again.");
      setState('HOME');
    }
  };

  const handleAnalysisComplete = () => {
    if (analysisResult) {
      setState('RESULT');
    }
  };

  const handleShowRecommendations = () => {
    setState('RECOMMENDATIONS');
  };

  const handleBackToHome = () => {
    setState('HOME');
    setAnalysisResult(null);
  };


  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen">
      <div className="app-container">
        {error && (
          <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 rounded-full shadow-lg text-sm font-medium">
            {error}
          </div>
        )}
        <AnimatePresence mode="wait">
          {state === 'HOME' && (
            <motion.div
              key="home"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <MoodInputHome onAnalyze={handleAnalyze} />

              {/* Bottom Navigation (Only on Home) */}
              <div className="mt-auto flex items-center justify-around border-t border-slate-100 dark:border-white/5 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md px-6 py-4 pb-8">
                <button className="flex flex-col items-center gap-1 text-primary">
                  <span className="material-symbols-outlined fill-[1]">home</span>
                  <span className="text-[10px] font-bold">Home</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                  <span className="material-symbols-outlined">explore</span>
                  <span className="text-[10px] font-medium">Discover</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                  <span className="material-symbols-outlined">history</span>
                  <span className="text-[10px] font-medium">History</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-slate-400">
                  <span className="material-symbols-outlined">settings</span>
                  <span className="text-[10px] font-medium">Settings</span>
                </button>
              </div>
            </motion.div>
          )}

          {state === 'ANALYSIS' && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full"
            >
              <MoodAnalysis
                onComplete={handleAnalysisComplete}
                onCancel={handleBackToHome}
              />
            </motion.div>
          )}

          {state === 'RESULT' && analysisResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="h-full"
            >
              <EmotionResult
                result={analysisResult}
                onShowRecommendations={handleShowRecommendations}
                onBack={handleBackToHome}
              />
            </motion.div>
          )}

          {state === 'RECOMMENDATIONS' && analysisResult && (
            <motion.div
              key="recommendations"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="h-full"
            >
              <RecommendedSongs
                result={analysisResult}
                onBack={() => setState('RESULT')}
                onRefresh={handleBackToHome}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;
