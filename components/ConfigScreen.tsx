import React, { useState } from 'react';
import { UserConfig, ZodiacSign } from '../types';
import { ZODIAC_OPTIONS } from '../constants';
import { Cat, Fish } from 'lucide-react';

interface ConfigScreenProps {
  onComplete: (config: UserConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onComplete }) => {
  const [nickname, setNickname] = useState('');
  const [zodiac, setZodiac] = useState<ZodiacSign>(ZodiacSign.Aries);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Please enter your nickname, meow!');
      return;
    }
    onComplete({ nickname, zodiac });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cute-pattern text-sky-900">
      <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-xl shadow-sky-100 p-8 w-full max-w-md border-2 border-white">
        <div className="flex justify-center mb-6 text-sky-400 gap-2 items-center">
          <Fish size={24} className="opacity-60" />
          <div className="bg-sky-100 p-4 rounded-full">
            <Cat size={48} className="text-sky-500" />
          </div>
          <Fish size={24} className="opacity-60" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 tracking-tight text-sky-600">Meowing Morning</h1>
        <p className="text-center text-sky-400 mb-8 text-sm font-medium">Start your day with a purr...</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 pl-2 text-sky-600">What should we call you?</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="Enter your nickname"
              className="w-full px-5 py-4 rounded-2xl bg-sky-50 border-2 border-sky-100 focus:outline-none focus:border-sky-300 focus:bg-white transition-all text-sky-900 placeholder-sky-300 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 pl-2 text-sky-600">What is your zodiac sign?</label>
            <div className="relative">
              <select
                value={zodiac}
                onChange={(e) => setZodiac(e.target.value as ZodiacSign)}
                className="w-full px-5 py-4 rounded-2xl bg-sky-50 border-2 border-sky-100 focus:outline-none focus:border-sky-300 focus:bg-white transition-all text-sky-900 appearance-none font-medium"
              >
                {ZODIAC_OPTIONS.map((sign) => (
                  <option key={sign} value={sign}>
                    {sign}
                  </option>
                ))}
              </select>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-sky-400">
                ▼
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center font-medium animate-bounce">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-200 transition-all transform active:scale-95 text-lg"
          >
            Start Meow
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfigScreen;