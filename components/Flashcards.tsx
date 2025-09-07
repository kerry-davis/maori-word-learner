
import React, { useState, useMemo } from 'react';
import type { Word } from '../types/index';
import { useProgressContext } from '../contexts/ProgressContext';
import { CheckIcon, XIcon } from './icons';

interface FlashcardsProps {
  words: Word[];
  onComplete: () => void;
}

const Flashcards: React.FC<FlashcardsProps> = ({ words, onComplete }) => {
  const { markWordAsMastered, level } = useProgressContext();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const wordsToLearn = useMemo(() => words.filter(w => w), [words]);

  if (wordsToLearn.length === 0) {
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-teal-800">Ka Pai!</h2>
            <p className="text-slate-600 mt-2">You've reviewed all the words for today.</p>
            <button onClick={onComplete} className="mt-6 bg-teal-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-teal-700 transition-colors">
                Back to Word List
            </button>
        </div>
    );
  }

  const currentWord = wordsToLearn[currentIndex];

  const handleNext = (mastered: boolean) => {
    if (mastered) {
      markWordAsMastered(currentWord.id, level);
    }
    setIsFlipped(false);
    if (currentIndex < wordsToLearn.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-lg mb-4 text-center">
        <p className="text-slate-600">Flashcard {currentIndex + 1} of {wordsToLearn.length}</p>
        <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
          <div className="bg-teal-600 h-2.5 rounded-full" style={{ width: `${((currentIndex + 1) / wordsToLearn.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="w-full max-w-lg h-80 perspective-1000">
        <div 
            className={`relative w-full h-full transform-style-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}
            onClick={() => setIsFlipped(!isFlipped)}
        >
            {/* Front of card */}
            <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-white rounded-xl shadow-2xl cursor-pointer p-6">
                <h2 className="text-4xl sm:text-5xl font-bold text-center text-slate-800">{currentWord.maori}</h2>
            </div>
            {/* Back of card */}
            <div className="absolute w-full h-full backface-hidden rotate-y-180 flex flex-col items-center justify-center bg-teal-600 text-white rounded-xl shadow-2xl cursor-pointer p-6">
                <h3 className="text-3xl sm:text-4xl font-bold text-center">{currentWord.english}</h3>
                <p className="mt-4 text-center italic text-teal-100">"{currentWord.example_english}"</p>
            </div>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4 sm:gap-8 w-full">
        <button onClick={() => handleNext(false)} className="flex items-center gap-2 bg-red-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-red-600 transition-colors shadow-lg transform hover:scale-105">
            <XIcon className="w-6 h-6" />
            <span>Still Learning</span>
        </button>
        <button onClick={() => handleNext(true)} className="flex items-center gap-2 bg-green-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-600 transition-colors shadow-lg transform hover:scale-105">
            <CheckIcon className="w-6 h-6" />
            <span>Got It!</span>
        </button>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .transform-style-3d { transform-style: preserve-3d; }
        .rotate-y-180 { transform: rotateY(180deg); }
        .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
      `}</style>
    </div>
  );
};

export default Flashcards;
