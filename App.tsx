
import React, { useState, useMemo, useCallback } from 'react';
import { ProgressProvider } from './contexts/ProgressContext';
import Header from './components/Header';
import DailyWordList from './components/DailyWordList';
import Flashcards from './components/Flashcards';
import MatchingQuiz from './components/MatchingQuiz';
import ProgressDashboard from './components/ProgressDashboard';
import { useProgress } from './hooks/useProgress';
import { WORD_LIST } from './constants/words';
import type { Word, Level } from './types/index';

export enum View {
  DAILY_LIST,
  FLASHCARDS,
  QUIZ,
  PROGRESS,
}

const App: React.FC = () => {
  const [view, setView] = useState<View>(View.DAILY_LIST);
  const [level, setLevel] = useState<Level>('Beginner');
  const [wordList, setWordList] = useState<Word[]>(WORD_LIST);
  const progressHook = useProgress();

  const todayWords: Word[] = useMemo(() => {
    const levelProgress = progressHook.progress.progressByLevel[level];
    if (!levelProgress) return [];
    
    const currentDay = levelProgress.currentDay;
    return wordList.filter(word => word.level === level && word.day === currentDay);
  }, [progressHook.progress, level, wordList]);

  const renderView = () => {
    switch (view) {
      case View.FLASHCARDS:
        return <Flashcards words={todayWords} onComplete={() => setView(View.DAILY_LIST)} />;
      case View.QUIZ:
        return <MatchingQuiz words={todayWords} onComplete={() => setView(View.DAILY_LIST)} />;
      case View.PROGRESS:
        return <ProgressDashboard />;
      case View.DAILY_LIST:
      default:
        return <DailyWordList words={todayWords} />;
    }
  };

  const contextValue = {
    progress: progressHook.progress,
    markWordAsMastered: progressHook.markWordAsMastered,
    resetProgress: progressHook.resetProgress,
    markDayAsCompleted: useCallback((day: number, l: Level) => progressHook.markDayAsCompleted(day, l, wordList), [progressHook.markDayAsCompleted, wordList]),
    goToNextDay: useCallback((l: Level) => progressHook.goToNextDay(l, wordList), [progressHook.goToNextDay, wordList]),
    goToPreviousDay: progressHook.goToPreviousDay,
    level,
    setLevel,
    wordList,
    addWords: useCallback((newWords: Word[]) => {
      setWordList(prev => [...prev, ...newWords]);
    }, []),
  };

  return (
    <ProgressProvider value={contextValue}>
      <div className="min-h-screen bg-slate-100 flex flex-col items-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl mx-auto">
          <Header currentView={view} setView={setView} />
          <main className="mt-6">
            {renderView()}
          </main>
        </div>
      </div>
    </ProgressProvider>
  );
};

export default App;
