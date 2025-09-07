
import React, { useState, useMemo, useEffect } from 'react';
import type { Word } from '../types/index';
import { useProgressContext } from '../contexts/ProgressContext';
import { CheckIcon, SparklesIcon } from './icons';

interface MatchingQuizProps {
  words: Word[];
  onComplete: () => void;
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

const MatchingQuiz: React.FC<MatchingQuizProps> = ({ words, onComplete }) => {
  const { markDayAsCompleted, level } = useProgressContext();
  const [maoriWords, setMaoriWords] = useState<Word[]>([]);
  const [englishOptions, setEnglishOptions] = useState<Word[]>([]);
  
  const [selectedMaori, setSelectedMaori] = useState<Word | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<number[]>([]);
  const [incorrectPair, setIncorrectPair] = useState<[Word, Word] | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const shuffledMaori = shuffleArray(words);
    const shuffledEnglish = shuffleArray(words);
    setMaoriWords(shuffledMaori);
    setEnglishOptions(shuffledEnglish);
    setMatchedPairs([]);
    setSelectedMaori(null);
    setIsComplete(false);
  }, [words]);

  const handleMaoriSelect = (word: Word) => {
    if (matchedPairs.includes(word.id)) return;
    setSelectedMaori(word);
    setIncorrectPair(null);
  };

  const handleEnglishSelect = (word: Word) => {
    if (!selectedMaori || matchedPairs.includes(word.id)) return;

    if (selectedMaori.id === word.id) {
      setMatchedPairs([...matchedPairs, selectedMaori.id]);
      setSelectedMaori(null);
    } else {
      setIncorrectPair([selectedMaori, word]);
      setSelectedMaori(null);
      setTimeout(() => setIncorrectPair(null), 1000);
    }
  };

  useEffect(() => {
    if (words.length > 0 && matchedPairs.length === words.length && !isComplete) {
      setIsComplete(true);
      markDayAsCompleted(words[0].day, level);
    }
  }, [matchedPairs, words, markDayAsCompleted, level, isComplete]);

  if (isComplete) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center">
        <SparklesIcon className="w-16 h-16 text-yellow-400 mb-4" />
        <h2 className="text-3xl font-bold text-teal-800">Quiz Complete!</h2>
        <p className="text-slate-600 mt-2">Awesome work! You've completed the quiz for Day {words[0].day}.</p>
        <button onClick={onComplete} className="mt-8 bg-teal-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-teal-700 transition-colors">
          Continue Learning
        </button>
      </div>
    );
  }

  const getButtonClass = (word: Word, type: 'maori' | 'english') => {
    const base = 'w-full text-left p-4 rounded-lg font-semibold transition-all duration-200 shadow-sm ';
    
    if (matchedPairs.includes(word.id)) {
        return base + 'bg-green-200 text-green-800 ring-2 ring-green-400 cursor-not-allowed';
    }
    
    if (incorrectPair && (incorrectPair[0].id === word.id || incorrectPair[1].id === word.id)) {
        return base + 'bg-red-200 text-red-800 animate-shake';
    }

    if (selectedMaori && selectedMaori.id === word.id && type === 'maori') {
        return base + 'bg-teal-500 text-white ring-2 ring-teal-600';
    }

    return base + 'bg-white hover:bg-teal-50';
  };
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-teal-800 mb-6">Matching Quiz</h2>
      <p className="text-slate-600 mb-6">Match the Māori word with its English translation.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8">
        {/* Māori Words */}
        <div className="space-y-3">
          {maoriWords.map(word => (
            <button key={`maori-${word.id}`} onClick={() => handleMaoriSelect(word)} className={getButtonClass(word, 'maori')}>
                {word.maori}
            </button>
          ))}
        </div>
        {/* English Options */}
        <div className="space-y-3">
          {englishOptions.map(word => (
            <button key={`english-${word.id}`} onClick={() => handleEnglishSelect(word)} className={getButtonClass(word, 'english')}>
                {word.english}
            </button>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        .animate-shake { animation: shake 0.5s ease-in-out; }
      `}</style>
    </div>
  );
};

export default MatchingQuiz;
