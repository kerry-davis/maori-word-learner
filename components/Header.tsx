
import React from 'react';
import { useProgressContext } from '../contexts/ProgressContext';
import { View } from '../App';
import { StreakIcon } from './icons';
import type { Level } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  const { progress, level, setLevel } = useProgressContext();

  const navItems = [
    { view: View.DAILY_LIST, label: 'Today\'s Words' },
    { view: View.FLASHCARDS, label: 'Flashcards' },
    { view: View.QUIZ, label: 'Quiz' },
    { view: View.PROGRESS, label: 'Progress' },
  ];

  const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced'];

  const NavButton: React.FC<{ view: View, label: string }> = ({ view, label }) => (
    <button
      onClick={() => setView(view)}
      className={`px-3 py-2 text-sm sm:px-4 sm:py-2 sm:text-base font-semibold rounded-md transition-colors duration-200 ${
        currentView === view
          ? 'bg-teal-600 text-white shadow-md'
          : 'bg-white text-teal-700 hover:bg-teal-50'
      }`}
    >
      {label}
    </button>
  );

  return (
    <header className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-teal-800">Māori Word Learner</h1>
          <p className="text-sm text-slate-500">Kia kaha te reo Māori!</p>
        </div>
        <div className="flex items-center gap-2 bg-orange-100 text-orange-700 font-bold px-4 py-2 rounded-full shadow-inner">
          <StreakIcon className="w-6 h-6 text-orange-500" />
          <span>{progress.streak} Day Streak</span>
        </div>
      </div>

      <div className="mt-4 sm:mt-6 border-t pt-4 flex flex-col sm:flex-row gap-4 justify-between items-center">
        <nav className="flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-3">
            {navItems.map(item => <NavButton key={item.view} view={item.view} label={item.label} />)}
        </nav>
        <div className="flex items-center gap-2 p-1 bg-slate-200 rounded-lg">
            {levels.map(l => (
                <button
                    key={l}
                    onClick={() => setLevel(l)}
                    className={`px-3 py-1 text-sm font-semibold rounded-md transition-all duration-200 ${
                        level === l ? 'bg-white text-teal-700 shadow' : 'bg-transparent text-slate-600 hover:bg-slate-100'
                    }`}
                >
                    {l}
                </button>
            ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
