import React from 'react';
import type { Word } from '../types/index';
import { useProgressContext } from '../contexts/ProgressContext';
import { CheckIcon } from './icons';
import AddWords from './AddWords';

interface DailyWordListProps {
  words: Word[];
}

const DailyWordList: React.FC<DailyWordListProps> = ({ words }) => {
  const { progress, level, goToNextDay, wordList } = useProgressContext();
  const levelProgress = progress.progressByLevel[level];

  if (!words || words.length === 0) {
    return <AddWords />;
  }

  const wordsForLevel = wordList.filter(w => w.level === level);
  const maxDayForLevel = wordsForLevel.length > 0 ? Math.max(...wordsForLevel.map(w => w.day)) : 0;
  const isLastDay = levelProgress.currentDay >= maxDayForLevel;
  const day = words[0]?.day || levelProgress.currentDay;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-teal-800 mb-6">Day {day} Words</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {words.map(word => (
          <div key={word.id} className="bg-slate-50 border border-slate-200 rounded-lg p-4 transition-shadow hover:shadow-md h-full">
            <div>
              <div className="flex items-center gap-3 flex-wrap">
                <h3 className="text-xl font-bold text-slate-900">{word.maori}</h3>
                <span className="text-slate-500 font-medium">/ {word.english}</span>
                {levelProgress.wordsMastered.includes(word.id) && (
                    <div className="flex items-center text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold">
                        <CheckIcon className="w-4 h-4 mr-1"/>
                        Mastered
                    </div>
                )}
              </div>
              <div className="mt-2 text-sm text-slate-600">
                <p>
                  <span className="font-semibold">Māori:</span> "{word.example_maori}"
                </p>
                <p className="italic">
                  <span className="font-semibold not-italic">English:</span> "{word.example_english}"
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-end">
        {!isLastDay && (
          <button
            onClick={() => goToNextDay(level)}
            className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
          >
            Go to Next Day &rarr;
          </button>
        )}
      </div>
    </div>
  );
};

export default DailyWordList;