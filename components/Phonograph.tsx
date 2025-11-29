import React, { useState, useRef, useEffect } from 'react';
import { Mic, Heart, Sparkles, Music, PauseCircle } from 'lucide-react';

const Phonograph: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeBtn, setActiveBtn] = useState<string | null>(null);
  const [statusText, setStatusText] = useState<string>('');
  
  // Audio ref to manage playback
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const getTimeCategory = (): string => {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();

    // Mapping minutes of the day to filename categories
    
    // 02:00 - 06:00 (120 - 360) -> late
    if (minutes >= 120 && minutes < 360) return 'late';
    
    // 06:00 - 10:00 (360 - 600) -> morning
    if (minutes >= 360 && minutes < 600) return 'morning';
    
    // 10:00 - 11:30 (600 - 690) -> commute
    if (minutes >= 600 && minutes < 690) return 'commute';
    
    // 11:30 - 13:30 (690 - 810) -> lunch
    if (minutes >= 690 && minutes < 810) return 'lunch';
    
    // 13:30 - 17:30 (810 - 1050) -> afternoon
    // NOTE: Extended to 17:30 to bridge the gap to dinner
    if (minutes >= 810 && minutes < 1050) return 'afternoon';
    
    // 17:30 - 19:00 (1050 - 1140) -> dinner
    if (minutes >= 1050 && minutes < 1140) return 'dinner';
    
    // 19:00 - 23:00 (1140 - 1380) -> evening
    if (minutes >= 1140 && minutes < 1380) return 'evening';
    
    // 23:00 - 02:00 (1380 - 1440 OR 0 - 120) -> goodnight
    return 'goodnight';
  };

  const playRandomMessage = () => {
    const category = getTimeCategory();
    const randomIndex = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    const fileName = `${category}_${randomIndex}.mp3`;
    
    // Formatting display text
    const displayLabels: Record<string, string> = {
      late: "Late Night Whispers",
      morning: "Morning Greeting",
      commute: "Commute Cheer",
      lunch: "Lunch Break",
      afternoon: "Afternoon Boost",
      dinner: "Dinner Time",
      evening: "Evening Relax",
      goodnight: "Goodnight Kiss"
    };

    setStatusText(`Playing: ${displayLabels[category] || category}...`);
    
    // STRATEGY: 
    // 1. Direct Raw Link (raw.githubusercontent.com) - Most stable for audio tags
    // 2. User provided link format (github.com/.../raw/...) - Follows redirects
    // 3. Local fallback (just in case)
    
    const directRawUrl = `https://raw.githubusercontent.com/sherlyleung/audio/refs/heads/main/${fileName}`;
    const userProvidedUrl = `https://github.com/sherlyleung/audio/raw/refs/heads/main/${fileName}`;

    const pathsToTry = [directRawUrl, userProvidedUrl, `audio/${fileName}`];
    
    attemptPlay(pathsToTry);
  };

  const attemptPlay = (paths: string[], index = 0) => {
    // 1. Check if we have exhausted all options
    if (index >= paths.length) {
      console.error("[Phonograph] All paths failed. Files likely missing.");
      setStatusText('Audio Missing 😿');
      setIsPlaying(false);
      setTimeout(() => {
        setActiveBtn(null);
        setStatusText('');
      }, 3000);
      return;
    }

    const currentPath = paths[index];
    console.log(`[Phonograph] Attempting load: ${currentPath}`);

    // 2. Cleanup previous audio BEFORE creating new one to prevent overlap
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // 3. Create new audio instance
    const audio = new Audio(currentPath);
    // Enable cross-origin for remote resources
    audio.crossOrigin = "anonymous"; 
    audioRef.current = audio;

    // Flag to ensure we don't trigger retry twice for the same instance
    let hasFailed = false;

    const triggerRetry = (reason: string) => {
      if (hasFailed) return; 
      hasFailed = true;

      // Only retry if this audio instance is STILL the active one.
      if (audioRef.current === audio) {
         console.warn(`[Phonograph] Failed ${currentPath} (${reason}), trying next...`);
         attemptPlay(paths, index + 1);
      }
    };

    audio.onended = () => {
      setIsPlaying(false);
      setActiveBtn(null);
      setStatusText('');
    };

    // Standard error event (404, decode error)
    audio.onerror = (e) => {
      triggerRetry("onerror event");
    };

    // Attempt playback
    const playPromise = audio.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          // Success!
          if (audioRef.current === audio) {
            setIsPlaying(true);
            console.log(`[Phonograph] Success playing from: ${currentPath}`);
          }
        })
        .catch(error => {
          if (error.name === 'AbortError') return;

          if (error.name === 'NotAllowedError') {
             console.warn("[Phonograph] Autoplay blocked");
             setStatusText('Tap again to play');
             setIsPlaying(false);
             setActiveBtn(null);
             return;
          }

          triggerRetry(`Promise error: ${error.message}`);
        });
    }
  };

  const handleButtonClick = (action: string) => {
    if (isPlaying) return;

    setActiveBtn(action);
    
    if (action === 'message') {
      playRandomMessage();
    } else {
      // Logic for Love and Kiss
      setIsPlaying(true);
      
      if (action === 'love') setStatusText('Sending Love Signal... ❤️');
      if (action === 'kiss') setStatusText('Chu! 💋 Sending Kiss...');

      setTimeout(() => {
        setIsPlaying(false);
        setActiveBtn(null);
        setStatusText('');
      }, 2500);
    }
  };

  return (
    <section className="flex-none mb-8 z-10 relative group">
      {/* Container: Retro Rose/Cream Theme */}
      <div className="relative overflow-hidden rounded-[2.5rem] p-6 bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 shadow-[0_10px_30px_-5px_rgba(251,113,133,0.3)] border-4 border-white transition-transform hover:scale-[1.01]">
        
        {/* Header */}
        <div className="absolute top-5 left-6 z-10 flex items-center gap-2">
           <div className="bg-rose-200 text-rose-700 p-2 rounded-2xl shadow-sm -rotate-3">
             <Mic size={18} strokeWidth={3} />
           </div>
           <h3 className="text-lg font-black text-rose-900 tracking-tight font-sans uppercase">
             Love Recorder
           </h3>
        </div>

        {/* Main Record Player Visual */}
        <div className="mt-12 mb-6 flex justify-center items-center relative h-40">
           
           {/* The Vinyl Record */}
           <div className={`relative w-36 h-36 rounded-full bg-slate-900 border-4 border-slate-800 shadow-xl flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
              {/* Grooves */}
              <div className="absolute inset-2 rounded-full border border-slate-800/50 opacity-50"></div>
              <div className="absolute inset-4 rounded-full border border-slate-800/50 opacity-50"></div>
              <div className="absolute inset-6 rounded-full border border-slate-800/50 opacity-50"></div>
              
              {/* Inner Label */}
              <div className="w-14 h-14 bg-gradient-to-tr from-rose-400 to-orange-400 rounded-full flex items-center justify-center shadow-inner relative z-10">
                <div className="w-2 h-2 bg-white rounded-full"></div>
              </div>
           </div>

           {/* The Tone Arm (Needle) */}
           <div className={`absolute top-0 right-10 w-24 h-4 origin-top-right transition-transform duration-700 ease-in-out ${isPlaying ? 'rotate-[25deg]' : 'rotate-0'}`}>
              <div className="w-full h-full relative">
                 {/* Arm */}
                 <div className="absolute top-2 right-2 w-20 h-1.5 bg-slate-400 rounded-full origin-right rotate-12"></div>
                 {/* Pivot */}
                 <div className="absolute top-0 right-0 w-8 h-8 bg-slate-300 rounded-full border-2 border-slate-400 shadow-sm z-10"></div>
                 {/* Head */}
                 <div className="absolute bottom-[-10px] left-2 w-6 h-8 bg-rose-400 rounded-md rotate-12 shadow-md"></div>
              </div>
           </div>
        </div>

        {/* Controls / Buttons */}
        <div className="bg-white/60 backdrop-blur-sm rounded-[2rem] p-3 border border-rose-100 flex justify-between items-center gap-2 shadow-sm">
          
          {/* Button 1: Message */}
          <button 
            onClick={() => handleButtonClick('message')}
            disabled={isPlaying}
            className={`flex-1 py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              ${activeBtn === 'message' ? 'bg-rose-400 text-white shadow-lg' : 'bg-white text-rose-400 hover:bg-rose-50'}`}
          >
            {isPlaying && activeBtn === 'message' ? <PauseCircle size={20} /> : <Mic size={20} strokeWidth={2.5} />}
            <span className="text-[10px] font-black uppercase tracking-wider">Message</span>
          </button>

          {/* Button 2: Love */}
          <button 
            onClick={() => handleButtonClick('love')}
            disabled={isPlaying}
            className={`flex-1 py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              ${activeBtn === 'love' ? 'bg-rose-500 text-white shadow-lg scale-105' : 'bg-white text-rose-500 hover:bg-rose-50'}`}
          >
            <Heart size={24} fill={activeBtn === 'love' ? "currentColor" : "none"} strokeWidth={3} />
            <span className="text-[10px] font-black uppercase tracking-wider">Love</span>
          </button>

          {/* Button 3: Kiss */}
          <button 
            onClick={() => handleButtonClick('kiss')}
            disabled={isPlaying}
            className={`flex-1 py-3 px-2 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              ${activeBtn === 'kiss' ? 'bg-rose-400 text-white shadow-lg' : 'bg-white text-rose-400 hover:bg-rose-50'}`}
          >
            {/* Using Sparkles/Lips metaphor */}
            <div className="relative">
               <span className="text-lg leading-none">💋</span>
               {activeBtn === 'kiss' && <Sparkles size={12} className="absolute -top-1 -right-2 animate-spin" />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-wider">Kiss</span>
          </button>

        </div>

        {/* Status Text Area */}
        <div className="mt-3 text-center h-5 flex items-center justify-center overflow-hidden">
           {statusText && (
             <p className="text-xs font-bold text-rose-500 animate-pulse uppercase tracking-widest truncate px-4">
                {statusText}
             </p>
           )}
        </div>

      </div>
      
      {/* CSS for slow spin */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 4s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default Phonograph;