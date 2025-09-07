
export type Level = 'Beginner' | 'Intermediate' | 'Advanced';

export interface Word {
  id: number;
  day: number;
  maori: string;
  english: string;
  example_maori: string;
  example_english: string;
  audio_file: string; // e.g., 'kia_ora.mp3'
  level: Level;
}

export interface LevelProgress {
  currentDay: number;
  wordsMastered: number[]; // array of word IDs
  dailyCompletion: {
    [day: number]: boolean;
  };
}

export interface UserProgress {
  progressByLevel: Record<Level, LevelProgress>;
  streak: number;
  lastVisitDate: string | null; // ISO date string: 'YYYY-MM-DD'
}
