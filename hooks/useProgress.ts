import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, Level, LevelProgress, Word } from '../types/index';

const STORAGE_KEY = 'maori_word_learner_progress_v2';

const getTodayDateString = () => new Date().toISOString().split('T')[0];

const defaultLevelProgress: LevelProgress = {
  currentDay: 1,
  wordsMastered: [],
  dailyCompletion: {},
};

const defaultProgress: UserProgress = {
  progressByLevel: {
    Beginner: { ...defaultLevelProgress },
    Intermediate: { ...defaultLevelProgress },
    Advanced: { ...defaultLevelProgress },
  },
  streak: 0,
  lastVisitDate: null,
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress);
        
        // Merge saved data with defaults to ensure data integrity and prevent crashes
        // if localStorage data is from an older version or corrupted.
        const mergedProgress: UserProgress = {
          ...defaultProgress,
          ...(parsed || {}),
          progressByLevel: {
            Beginner: {
              ...defaultLevelProgress,
              ...(parsed?.progressByLevel?.Beginner || {}),
            },
            Intermediate: {
              ...defaultLevelProgress,
              ...(parsed?.progressByLevel?.Intermediate || {}),
            },
            Advanced: {
              ...defaultLevelProgress,
              ...(parsed?.progressByLevel?.Advanced || {}),
            },
          },
        };
        return mergedProgress;
      }
      return defaultProgress;
    } catch (error) {
      console.error("Failed to parse progress from localStorage", error);
      return defaultProgress;
    }
  });

  useEffect(() => {
    const today = getTodayDateString();
    if (progress.lastVisitDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayString = yesterday.toISOString().split('T')[0];
        
        const newStreak = progress.lastVisitDate === yesterdayString ? progress.streak + 1 : 1;

        setProgress(prev => ({
            ...prev,
            lastVisitDate: today,
            streak: newStreak
        }));
    }
  }, []); // Run only once on mount to check date.

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error("Failed to save progress to localStorage", error);
    }
  }, [progress]);

  const markWordAsMastered = useCallback((wordId: number, level: Level) => {
    setProgress(prev => {
      const levelProgress = prev.progressByLevel[level];
      if (levelProgress.wordsMastered.includes(wordId)) {
        return prev;
      }
      const newWordsMastered = [...levelProgress.wordsMastered, wordId];
      return { 
        ...prev, 
        progressByLevel: {
          ...prev.progressByLevel,
          [level]: {
            ...levelProgress,
            wordsMastered: newWordsMastered
          }
        }
      };
    });
  }, []);

  const markDayAsCompleted = useCallback((day: number, level: Level, wordList: Word[]) => {
    setProgress(prev => {
        const levelProgress = prev.progressByLevel[level];
        if (levelProgress.dailyCompletion[day]) return prev;

        const newDailyCompletion = { ...levelProgress.dailyCompletion, [day]: true };
        
        const wordsForLevel = wordList.filter(w => w.level === level);
        const maxDay = wordsForLevel.length > 0 ? Math.max(...wordsForLevel.map(w => w.day)) : 0;
        
        const newCurrentDay = levelProgress.currentDay < maxDay ? levelProgress.currentDay + 1 : levelProgress.currentDay;
        
        return {
            ...prev,
            progressByLevel: {
              ...prev.progressByLevel,
              [level]: {
                ...levelProgress,
                dailyCompletion: newDailyCompletion,
                currentDay: newCurrentDay
              }
            }
        };
    });
  }, []);
  
  const goToNextDay = useCallback((level: Level, wordList: Word[]) => {
    setProgress(prev => {
      const levelProgress = prev.progressByLevel[level];
      const wordsForLevel = wordList.filter(w => w.level === level);
      const maxDay = wordsForLevel.length > 0 ? Math.max(...wordsForLevel.map(w => w.day)) : 0;
      
      if (levelProgress.currentDay < maxDay) {
        return {
          ...prev,
          progressByLevel: {
            ...prev.progressByLevel,
            [level]: {
              ...levelProgress,
              currentDay: levelProgress.currentDay + 1,
            }
          }
        };
      }
      return prev;
    });
  }, []);

  const resetProgress = useCallback(() => {
      const freshProgress = {...defaultProgress, lastVisitDate: getTodayDateString(), streak: 1};
      setProgress(freshProgress);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(freshProgress));
  }, []);


  return { progress, markWordAsMastered, markDayAsCompleted, resetProgress, goToNextDay };
};