import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { useProgressContext } from '../contexts/ProgressContext';
import { PlusIcon, LoadingIcon } from './icons';
import type { Word } from '../types';

const AddWords: React.FC = () => {
  const { level, wordList, addWords } = useProgressContext();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const generateNewWords = async () => {
    setIsLoading(true);
    setError(null);

    const wordsForLevel = wordList.filter(w => w.level === level);
    const maxDay = wordsForLevel.length > 0 ? Math.max(...wordsForLevel.map(w => w.day)) : 0;
    const maxId = wordList.length > 0 ? Math.max(...wordList.map(w => w.id)) : 0;

    const themePrompt = `The existing themes are kitchen items, clothing, body parts, family, animals, numbers, household items, emotions, weather, marae, actions, colors, native flora/fauna, geography, deities, traditional tools, time/space concepts, landscape features, and cultural values. Please choose a new, practical theme for the next day's words that has not been used before, for example 'occupations', 'sports', or 'modern technology'.`;

    const prompt = `
      You are an expert in the Māori language (te reo Māori).
      Generate a list of 7 new Māori words for a language learning app.
      The difficulty level for these words should be '${level}'.
      ${themePrompt}
      
      The last day of words generated for this level was Day ${maxDay}. The new words should all be for Day ${maxDay + 1}.
      
      Provide your response as a JSON array of objects. Each object must conform to this schema:
      - maori: string (the Māori word)
      - english: string (the English translation)
      - example_maori: string (an example sentence in Māori using the word)
      - example_english: string (the English translation of the example sentence)

      Do not include id, day, level, or audio_file in your JSON output.
    `;
    
    try {
      if (!process.env.API_KEY) {
        throw new Error("API key is not configured.");
      }
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                maori: { type: Type.STRING },
                english: { type: Type.STRING },
                example_maori: { type: Type.STRING },
                example_english: { type: Type.STRING },
              },
              required: ['maori', 'english', 'example_maori', 'example_english'],
            }
          }
        }
      });

      const generatedWords = JSON.parse(response.text);

      if (!Array.isArray(generatedWords) || generatedWords.length === 0) {
        throw new Error("API returned an invalid format or an empty list.");
      }

      const newWords: Word[] = generatedWords.map((word, index) => ({
        ...word,
        id: maxId + index + 1,
        day: maxDay + 1,
        level: level,
        audio_file: `${word.maori.toLowerCase().replace(/ /g, '_').replace(/'/g, '')}.mp3`,
      }));

      addWords(newWords);

    } catch (e) {
      console.error("Failed to generate words:", e);
      setError(`Sorry, I couldn't generate new words at the moment. Please try again later. (${e.message})`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8 text-center flex flex-col items-center">
      <h2 className="text-2xl font-bold text-teal-800">Ka Pai! All Done!</h2>
      <p className="text-slate-600 mt-2">You've completed all available lessons for the {level} level.</p>
      <p className="text-slate-600 mt-1">Ready for more?</p>
      
      <button 
        onClick={generateNewWords}
        disabled={isLoading}
        className="mt-6 bg-teal-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-teal-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center gap-3"
      >
        {isLoading ? (
          <>
            <LoadingIcon className="w-5 h-5 animate-spin"/>
            <span>Generating...</span>
          </>
        ) : (
          <>
            <PlusIcon className="w-5 h-5"/>
            <span>Generate Words for Day {wordList.filter(w=>w.level === level).length > 0 ? Math.max(...wordList.filter(w => w.level === level).map(w => w.day)) + 1 : 1}</span>
          </>
        )}
      </button>

      {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}
    </div>
  );
};

export default AddWords;
