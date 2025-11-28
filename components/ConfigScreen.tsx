import React, { useState } from 'react';
import { UserConfig } from '../types';
import { Cat, Fish, Sparkles } from 'lucide-react';
import { ZODIAC_OPTIONS } from '../constants';

interface ConfigScreenProps {
  onComplete: (config: UserConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onComplete }) => {
  const [nickname, setNickname] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Please tell me your name, meow!');
      return;
    }
    if (!zodiac) {
      setError('Please pick your star sign!');
      return;
    }
    onComplete({ nickname, zodiac });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-cute-pattern text-sky-900 relative overflow-hidden">
      
      {/* Decorative Circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 bg-sky-100 rounded-full blur-3xl opacity-50"></div>
      <div className="absolute top-40 -right-20 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-50"></div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(186,230,253,0.8)] p-8 w-full max-w-md border-4 border-white relative z-10">
        
        <div className="flex justify-center mb-6 text-sky-400 gap-4 items-center">
          <Fish size={24} className="opacity-60 rotate-45" />
          <div className="bg-gradient-to-tr from-sky-400 to-blue-500 p-5 rounded-[2rem] shadow-lg shadow-sky-200 text-white transform hover:scale-110 transition-transform cursor-pointer">
            <Cat size={48} strokeWidth={2.5} />
          </div>
          <Sparkles size={24} className="opacity-60 text-yellow-400" />
        </div>
        
        <h1 className="text-3xl font-black text-center mb-2 tracking-tight text-sky-800">Meowing Morning</h1>
        <p className="text-center text-sky-500 mb-10 text-sm font-bold tracking-wide uppercase opacity-80">Design your purrfect day</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider pl-4 text-sky-400">Nickname</label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setError('');
              }}
              placeholder="e.g. Kitten123"
              className="w-full px-6 py-4 rounded-3xl bg-sky-50/50 border-2 border-sky-100 focus:outline-none focus:border-sky-400 focus:bg-white focus:shadow-lg focus:shadow-sky-100 transition-all text-sky-800 placeholder-sky-300 font-bold text-lg"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider pl-4 text-sky-400">Zodiac Sign</label>
            <div className="relative">
              <select
                value={zodiac}
                onChange={(e) => {
                  setZodiac(e.target.value);
                  setError('');
                }}
                className="w-full px-6 py-4 rounded-3xl bg-sky-50/50 border-2 border-sky-100 focus:outline-none focus:border-sky-400 focus:bg-white focus:shadow-lg focus:shadow-sky-100 transition-all text-sky-800 appearance-none font-bold text-lg cursor-pointer"
              >
                <option value="" disabled>Choose a sign...</option>
                {ZODIAC_OPTIONS.map((sign) => (
                  <option key={sign} value={sign}>
                    {sign}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-6 text-sky-400">
                <svg className="fill-current h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-400 px-4 py-3 rounded-2xl text-sm text-center font-bold animate-pulse border border-red-100">
               {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full mt-4 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-black py-4 rounded-3xl shadow-xl shadow-sky-200 transition-all transform hover:scale-[1.02] active:scale-95 text-xl tracking-wide"
          >
            Let's Go! 🐾
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfigScreen;