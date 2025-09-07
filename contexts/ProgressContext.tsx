import { createContext, useContext } from 'react';
import type { useProgress } from '../hooks/useProgress';
import type { Level, Word } from '../types';

type ProgressHookType = ReturnType<typeof useProgress>;

interface ProgressContextType extends Omit<ProgressHookType, 'markDayAsCompleted' | 'goToNextDay'> {
  level: Level;
  setLevel: (level: Level) => void;
  wordList: Word[];
  addWords: (newWords: Word[]) => void;
  markDayAsCompleted: (day: number, level: Level) => void;
  goToNextDay: (level: Level) => void;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const ProgressProvider = ProgressContext.Provider;

export const useProgressContext = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgressContext must be used within a ProgressProvider');
  }
  return context;
};