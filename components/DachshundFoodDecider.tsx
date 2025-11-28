import React, { useState } from 'react';
import { getFoodSuggestion } from '../services/geminiService';
import { FoodOption } from '../types';
import { Utensils, Bone } from 'lucide-react';

const DachshundFoodDecider: React.FC = () => {
  const [suggestion, setSuggestion] = useState<FoodOption | null>(null);
  const [loading, setLoading] = useState(false);
  const [isWagging, setIsWagging] = useState(false);

  const handleHeadClick = async () => {
    if (loading) return;
    
    setLoading(true);
    setIsWagging(true);
    setSuggestion(null);

    try {
      const result = await getFoodSuggestion();
      setSuggestion(result);
    } catch (error) {
      console.error("Failed to get food suggestion", error);
    } finally {
      setLoading(false);
      setTimeout(() => setIsWagging(false), 2000);
    }
  };

  return (
    <section className="flex-none mb-6 z-10 relative group">
      {/* Container: Unified "Cute Blue" Theme - Soft Blue Gradient with rounded corners */}
      <div className="relative bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 rounded-[2.5rem] p-6 shadow-[0_8px_30px_rgb(14,165,233,0.15)] border-4 border-white overflow-hidden transition-all hover:shadow-[0_15px_40px_rgb(14,165,233,0.2)] hover:scale-[1.01]">
        
        {/* Decorative Background Patterns (Bones) */}
        <div className="absolute top-4 right-10 text-sky-200 opacity-40 rotate-12"><Bone size={24} fill="currentColor" /></div>
        <div className="absolute bottom-6 left-6 text-sky-200 opacity-40 -rotate-45"><Bone size={32} fill="currentColor" /></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-white rounded-full blur-2xl opacity-60 pointer-events-none"></div>

        {/* Cute Header */}
        <div className="absolute top-5 left-6 z-10 flex items-center gap-2">
           <div className="bg-sky-200 text-sky-700 p-2 rounded-2xl shadow-sm transform -rotate-6">
             <Utensils size={18} strokeWidth={3} />
           </div>
           <h3 className="text-lg font-black text-sky-800 tracking-tight font-sans uppercase">
             The Doxie's Diner
           </h3>
        </div>

        {/* Content Area */}
        <div className="mt-12 flex flex-col items-center justify-center relative min-h-[200px]">
          
          {/* Result Bubble - Pop style */}
          {suggestion && (
             <div className="absolute top-[-20px] right-0 md:right-8 z-30 w-52 animate-fade-in origin-bottom-left">
                <div className="bg-white p-5 rounded-[2rem] rounded-bl-none shadow-xl border-2 border-sky-100 relative">
                   <p className="text-lg font-black text-sky-900 leading-tight mb-2">
                     {suggestion.suggestion}
                   </p>
                   <div className="h-1 w-10 bg-sky-100 rounded-full my-2"></div>
                   <p className="text-xs text-sky-500 font-bold italic">
                     “{suggestion.mood_text}”
                   </p>
                   {/* Bubble triangle */}
                   <div className="absolute -bottom-3 -left-[2px] w-5 h-5 bg-white border-b-2 border-l-2 border-sky-100 transform -rotate-12 translate-y-1 rounded-bl-md"></div>
                </div>
             </div>
          )}

          {/* CUTE DACHSHUND SVG */}
          {/* Colors: Low Saturation Browns. Light: #EAD8C0 (Milk Tea), Dark: #C9A886 (Soft Caramel) */}
          <div className="relative w-72 h-40 mt-auto translate-y-6">
             <svg viewBox="0 0 300 160" className="w-full h-full drop-shadow-xl">
                <style>
                  {`
                    @keyframes tail-wag-cute {
                      0% { transform: rotate(0deg); }
                      25% { transform: rotate(-20deg); }
                      75% { transform: rotate(20deg); }
                      100% { transform: rotate(0deg); }
                    }
                    .wagging-tail {
                      transform-origin: 260px 85px;
                      animation: tail-wag-cute 0.25s infinite ease-in-out;
                    }
                    .dog-head {
                      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                      transform-origin: 80px 90px;
                    }
                    .dog-head:hover {
                      transform: rotate(-5deg) scale(1.05);
                      cursor: pointer;
                    }
                    .eye-blink {
                      animation: blink 4s infinite;
                    }
                    @keyframes blink {
                      0%, 96%, 100% { transform: scaleY(1); }
                      98% { transform: scaleY(0.1); }
                    }
                  `}
                </style>

                {/* --- BODY GROUP --- */}
                <g transform="translate(10, 10)">
                  
                  {/* Tail */}
                  <path 
                    d="M260 85 Q 280 70 290 50" 
                    stroke="#EAD8C0" 
                    strokeWidth="14" 
                    strokeLinecap="round" 
                    fill="none"
                    className={isWagging ? "wagging-tail" : ""}
                  />

                  {/* Back Legs */}
                  <path d="M90 120 L 90 145" stroke="#C9A886" strokeWidth="16" strokeLinecap="round" />
                  <path d="M230 120 L 230 145" stroke="#C9A886" strokeWidth="16" strokeLinecap="round" />

                  {/* Main Body (Sausage) */}
                  <rect x="60" y="70" width="200" height="65" rx="32" fill="#EAD8C0" />

                  {/* Front Legs */}
                  <path d="M100 125 L 100 145" stroke="#C9A886" strokeWidth="16" strokeLinecap="round" />
                  <path d="M210 125 L 210 145" stroke="#C9A886" strokeWidth="16" strokeLinecap="round" />
                  
                  {/* Belly Highlight (Cute factor) */}
                  <path d="M90 115 Q 160 125 230 115" stroke="#F5EFE0" strokeWidth="10" strokeLinecap="round" opacity="0.6" />

                  {/* --- HEAD GROUP (Clickable) --- */}
                  <g className="dog-head" onClick={handleHeadClick}>
                     
                     {/* Ear (Back) */}
                     <path d="M80 60 Q 50 80 55 110 C 58 125 75 125 85 100" fill="#C9A886" />

                     {/* Neck Connector */}
                     <circle cx="85" cy="90" r="30" fill="#EAD8C0" />

                     {/* Face Shape */}
                     <ellipse cx="75" cy="75" rx="45" ry="40" fill="#EAD8C0" />
                     
                     {/* Snout */}
                     <ellipse cx="45" cy="85" rx="25" ry="18" fill="#F2E6D4" />

                     {/* Ear (Front) */}
                     <path d="M90 60 Q 60 80 65 115 C 68 135 90 130 100 100" fill="#C9A886" />

                     {/* Nose */}
                     <circle cx="30" cy="82" r="7" fill="#5D4037" />
                     <circle cx="28" cy="80" r="2" fill="white" opacity="0.5" />

                     {/* Eye */}
                     <g className="eye-blink" transform-origin="60 70">
                       <circle cx="60" cy="70" r="6" fill="#3E2723" />
                       <circle cx="62" cy="68" r="2" fill="white" />
                     </g>

                     {/* Cheek Blush */}
                     <ellipse cx="75" cy="90" rx="6" ry="4" fill="#FFB7B2" opacity="0.6" />

                     {/* Bow Tie (Red) */}
                     <g transform="translate(75, 115) rotate(-5)">
                        <path d="M0 0 L -10 -8 L -10 8 Z" fill="#EF5350" />
                        <path d="M0 0 L 10 -8 L 10 8 Z" fill="#EF5350" />
                        <circle cx="0" cy="0" r="3" fill="#D32F2F" />
                     </g>

                     {/* "Pet Me" Badge (Visible when no suggestion) */}
                     {!suggestion && !loading && (
                        <g transform="translate(-10, 20)">
                           <path d="M0 0 L 10 -10 L 60 -10 L 60 20 L 10 20 L 0 10 Z" fill="white" stroke="#38BDF8" strokeWidth="2" />
                           <text x="15" y="8" fontSize="10" fill="#0284C7" fontWeight="bold" fontFamily="sans-serif">Tap me!</text>
                        </g>
                     )}
                  </g>
                </g>
             </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DachshundFoodDecider;