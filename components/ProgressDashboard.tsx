import React from 'react';
import { useProgressContext } from '../contexts/ProgressContext';
import { CheckIcon, FireIcon } from './icons';

const ProgressDashboard: React.FC = () => {
  const { progress, resetProgress, level, wordList } = useProgressContext();
  const levelProgress = progress.progressByLevel[level];

  const wordsForLevel = wordList.filter(w => w.level === level);
  const totalWords = wordsForLevel.length;
  const wordsMasteredCount = levelProgress.wordsMastered.length;
  const masteryPercentage = totalWords > 0 ? Math.round((wordsMasteredCount / totalWords) * 100) : 0;

  const totalDays = wordsForLevel.length > 0 ? Math.max(...wordsForLevel.map(w => w.day)) : 0;

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset all your progress? This action cannot be undone.")) {
      resetProgress();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-teal-800 mb-1">Your <span className="capitalize">{level}</span> Progress</h2>
      <p className="text-slate-500 mb-6">Global streak is maintained across all levels.</p>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Words Mastered */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
          <h3 className="text-lg font-semibold text-slate-700">Words Mastered</h3>
          <p className="text-4xl font-bold text-teal-600 my-2">{wordsMasteredCount} <span className="text-2xl text-slate-500">/ {totalWords}</span></p>
          <div className="w-full bg-slate-200 rounded-full h-4">
            <div className="bg-teal-500 h-4 rounded-full" style={{ width: `${masteryPercentage}%` }}></div>
          </div>
        </div>

        {/* Learning Streak */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
          <h3 className="text-lg font-semibold text-slate-700">Learning Streak</h3>
          <div className="flex justify-center items-center gap-2 my-2">
            <FireIcon className="w-10 h-10 text-orange-500" />
            <p className="text-4xl font-bold text-orange-600">{progress.streak} <span className="text-2xl text-slate-500">days</span></p>
          </div>
           <p className="text-sm text-slate-500">Keep it up!</p>
        </div>
        
        {/* Current Day */}
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200 text-center">
          <h3 className="text-lg font-semibold text-slate-700">Current Day</h3>
          <p className="text-4xl font-bold text-indigo-600 my-2">{levelProgress.currentDay}</p>
          <p className="text-sm text-slate-500">of {totalDays} available</p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold text-teal-800 mb-4">Daily Completion</h3>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {Array.from({ length: totalDays }, (_, i) => i + 1).map(day => (
            <div
              key={day}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 font-bold transition-colors ${
                levelProgress.dailyCompletion[day]
                  ? 'bg-green-100 border-green-300 text-green-700'
                  : 'bg-slate-100 border-slate-200 text-slate-500'
              }`}
            >
              <span className="text-sm">Day</span>
              <span className="text-xl">{day}</span>
              {levelProgress.dailyCompletion[day] && <CheckIcon className="w-5 h-5 mt-1" />}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-12 pt-6 border-t border-slate-200">
        <h3 className="text-xl font-bold text-red-700">Danger Zone</h3>
        <p className="text-slate-600 mt-2">If you want to start over, you can reset all your progress here. This will reset all levels.</p>
        <button
          onClick={handleReset}
          className="mt-4 bg-red-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-red-700 transition-colors"
        >
          Reset All Progress
        </button>
      </div>
    </div>
  );
};

export default ProgressDashboard;