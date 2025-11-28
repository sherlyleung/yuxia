import React, { useState } from 'react';
import { getWisdomAnswer } from '../services/geminiService';
import { Sparkles, Stars, Moon, Zap } from 'lucide-react';

const CatWisdomBook: React.FC = () => {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  // Removed isLocked state to allow multiple asks

  const handleAsk = async () => {
    if (loading) return;

    setLoading(true);
    // Clear previous answer briefly to trigger re-entry animation visual cue
    setAnswer(null); 
    
    try {
      const result = await getWisdomAnswer();
      setAnswer(result);
    } catch (error) {
      console.error("Failed to get wisdom", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex-none mb-8 z-10 relative group">
      <div 
        className={`relative overflow-hidden rounded-[2.5rem] p-6 min-h-[180px] transition-all duration-300 shadow-[0_10px_40px_-10px_rgba(79,70,229,0.5)] border-4 border-indigo-100
          ${loading ? 'scale-[0.98]' : 'hover:scale-[1.02] active:scale-95'}
          bg-gradient-to-br from-indigo-600 via-blue-600 to-violet-600 cursor-pointer`}
        onClick={handleAsk}
      >
        
        {/* Decorative Background Elements */}
        <div className="absolute top-4 right-6 text-yellow-300 opacity-60 animate-pulse"><Stars size={24} fill="currentColor" /></div>
        <div className="absolute bottom-4 left-6 text-indigo-300 opacity-30"><Moon size={28} /></div>
        <div className="absolute top-10 left-10 text-pink-300 opacity-40 animate-ping duration-1000"><Sparkles size={16} /></div>
        
        {/* Glowing aura behind the cat */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center">
          
          {/* Header Badge */}
          <div className="absolute top-0 left-0 px-5 py-3 flex items-center gap-2">
             <div className="bg-white/20 backdrop-blur-md p-1.5 rounded-full">
                <Sparkles size={12} className="text-yellow-300" fill="currentColor" />
             </div>
             <span className="text-[10px] font-black tracking-widest uppercase text-indigo-100 opacity-90 shadow-sm">
               Magic Cat
             </span>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex flex-col items-center w-full mt-4">
            
            {/* CUTE WIZARD CAT SVG - Redesigned */}
            <div className={`w-28 h-28 relative drop-shadow-2xl transition-transform duration-500 ${loading ? 'animate-bounce' : 'group-hover:-translate-y-2'}`}>
               <svg viewBox="0 0 120 120" className="w-full h-full overflow-visible">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Tail (Wagging) */}
                  <path d="M90 90 Q 110 80 105 50" stroke="#E0E7FF" strokeWidth="8" strokeLinecap="round" fill="none">
                    <animateTransform attributeName="transform" type="rotate" from="0 90 90" to="10 90 90" dur="1s" repeatCount="indefinite" values="0 90 90; 10 90 90; 0 90 90" keyTimes="0; 0.5; 1" />
                  </path>

                  {/* Body */}
                  <ellipse cx="60" cy="95" rx="35" ry="25" fill="#E0E7FF" />
                  <ellipse cx="60" cy="95" rx="20" ry="15" fill="#C7D2FE" opacity="0.5" />

                  {/* Paws holding a ball? Or just sitting. Let's do sitting paws */}
                  <ellipse cx="45" cy="110" rx="8" ry="6" fill="#F8FAFC" />
                  <ellipse cx="75" cy="110" rx="8" ry="6" fill="#F8FAFC" />

                  {/* Head */}
                  <g transform="translate(0, -5)">
                    <circle cx="60" cy="60" r="32" fill="#F8FAFC" stroke="#E0E7FF" strokeWidth="2" />
                    
                    {/* Ears */}
                    <path d="M35 45 L 25 25 L 50 38 Z" fill="#F8FAFC" stroke="#E0E7FF" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M85 45 L 95 25 L 70 38 Z" fill="#F8FAFC" stroke="#E0E7FF" strokeWidth="2" strokeLinejoin="round" />
                    <path d="M38 42 L 32 32 L 46 39 Z" fill="#FDA4AF" /> {/* Pink inner ear */}
                    <path d="M82 42 L 88 32 L 74 39 Z" fill="#FDA4AF" />

                    {/* Face */}
                    <circle cx="48" cy="62" r="4" fill="#1E1B4B" /> {/* Eye L */}
                    <circle cx="50" cy="60" r="1.5" fill="white" /> {/* Sparkle L */}
                    
                    <circle cx="72" cy="62" r="4" fill="#1E1B4B" /> {/* Eye R */}
                    <circle cx="74" cy="60" r="1.5" fill="white" /> {/* Sparkle R */}

                    <ellipse cx="60" cy="68" rx="3" ry="2" fill="#FDA4AF" /> {/* Nose */}
                    <path d="M60 70 Q 55 75 50 72 M 60 70 Q 65 75 70 72" stroke="#1E1B4B" strokeWidth="1.5" fill="none" /> {/* Mouth */}
                    
                    {/* Whiskers */}
                    <line x1="40" y1="65" x2="25" y2="62" stroke="#CBD5E1" strokeWidth="1.5" />
                    <line x1="40" y1="70" x2="28" y2="72" stroke="#CBD5E1" strokeWidth="1.5" />
                    <line x1="80" y1="65" x2="95" y2="62" stroke="#CBD5E1" strokeWidth="1.5" />
                    <line x1="80" y1="70" x2="92" y2="72" stroke="#CBD5E1" strokeWidth="1.5" />

                    {/* Wizard Hat (Floppy & Cute) */}
                    <g transform="rotate(-5 60 20)">
                       <path d="M30 35 Q 60 45 90 35" fill="none" stroke="#4C1D95" strokeWidth="3" /> {/* Brim bottom curve */}
                       <path d="M25 35 Q 60 50 95 35 L 80 15 Q 60 -10 30 15 Z" fill="#5B21B6" /> {/* Hat Cone */}
                       <path d="M25 35 Q 60 50 95 35" fill="none" stroke="#FCD34D" strokeWidth="4" /> {/* Yellow Band */}
                       <path d="M80 15 L 85 5" stroke="#5B21B6" strokeWidth="3" fill="none"/> {/* Tip flop */}
                       <circle cx="85" cy="5" r="3" fill="#FCD34D" filter="url(#glow)" /> {/* Pom pom */}
                       
                       {/* Stars on hat */}
                       <path d="M50 20 L 52 15 L 54 20 L 59 20 L 55 24 L 57 29 L 52 26 L 47 29 L 49 24 L 45 20 Z" fill="#FCD34D" transform="scale(0.6) translate(30, 10)" />
                    </g>
                  </g>
               </svg>
            </div>

            {/* TEXT & ANSWER AREA */}
            <div className="mt-4 w-full px-2 min-h-[60px] flex flex-col items-center justify-center">
              {loading ? (
                <div className="text-white/80 font-bold animate-pulse tracking-widest text-sm">
                  CONSULTING THE STARS...
                </div>
              ) : answer ? (
                <div key={answer} className="animate-float-up-slightly flex flex-col items-center">
                   <p className="text-xl font-black text-white leading-tight drop-shadow-md font-sans">
                     "{answer}"
                   </p>
                   <p className="text-[10px] text-blue-200 mt-2 font-bold uppercase tracking-wider opacity-80">
                     Tap to ask another question
                   </p>
                </div>
              ) : (
                <p className="text-blue-100 font-bold text-lg animate-pulse drop-shadow-sm">
                  Got a Question? Pet Me!
                </p>
              )}
            </div>

          </div>
        </div>
        
        {/* Shine Effect */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
      </div>
    </section>
  );
};

export default CatWisdomBook;