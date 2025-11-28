import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserConfig, DailyContent } from '../types';
import { generateDailyContent } from '../services/geminiService';
import { RefreshCw, Heart, Loader2, CloudSun, Sparkles } from 'lucide-react';

interface DashboardProps {
  config: UserConfig;
}

const Dashboard: React.FC<DashboardProps> = ({ config }) => {
  const [content, setContent] = useState<DailyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [imgLoading, setImgLoading] = useState(true);
  const [likes, setLikes] = useState<number[]>([]); // Array of timestamps for keys
  
  // Ref to track mount status to prevent double-fetch in React.StrictMode
  const mountedRef = useRef(false);

  const fetchCatImage = useCallback(() => {
    setImgLoading(true);
    // Add timestamp to bypass cache
    const url = `https://cataas.com/cat?width=800&height=800&t=${Date.now()}`;
    // Preload image
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImgUrl(url);
      setImgLoading(false);
    };
  }, []);

  const fetchData = useCallback(async (lat?: number, lon?: number) => {
    setLoading(true);
    try {
      // 1. Fetch text content (Locally generated with real weather if coords provided)
      const dailyData = await generateDailyContent(config, lat && lon ? { lat, lon } : undefined);
      setContent(dailyData);
      
      // 2. Fetch Cat Image
      fetchCatImage();
    } catch (error) {
      console.error("Dashboard Load Error", error);
    } finally {
      setLoading(false);
    }
  }, [config, fetchCatImage]);

  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Request Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // Success
          fetchData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          // Error or Denied
          console.warn("Location permission denied or error:", error);
          fetchData(); // Fetch without coords (will use fallback)
        },
        { timeout: 10000 }
      );
    } else {
      // Geolocation not supported
      fetchData();
    }
  }, [fetchData]);

  const handleDoubleTap = (e: React.MouseEvent) => {
    // Add a heart animation at click position (simplified to center for now or randomized list)
    setLikes(prev => [...prev, Date.now()]);
    // Remove the heart after animation (1s)
    setTimeout(() => {
      setLikes(prev => prev.slice(1));
    }, 1000);
  };

  if (loading && !content) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-cute-pattern text-sky-400">
        <div className="bg-white/80 p-6 rounded-full shadow-lg mb-4">
          <Loader2 className="animate-spin text-sky-500" size={48} />
        </div>
        <p className="animate-pulse font-medium text-sky-600 bg-white/60 px-4 py-2 rounded-full">
          Connecting to Cat Planet...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-cute-pattern text-slate-800 flex flex-col p-4 overflow-y-auto relative">
      
      {/* Background decoration gradient overlay to soften pattern */}
      <div className="absolute top-0 left-0 w-full h-1/3 bg-gradient-to-b from-sky-100/80 to-transparent -z-0 pointer-events-none" />

      {/* Top: Weather & Tip */}
      <section className="flex-none mb-6 z-10 relative mt-2">
        <div className="bg-white/90 backdrop-blur-md rounded-[2rem] p-5 shadow-lg shadow-sky-100 border border-white flex items-start gap-4 transition-transform hover:scale-[1.01]">
           <div className="bg-sky-100 p-3 rounded-2xl text-sky-500 shadow-inner">
              <CloudSun size={32} />
           </div>
           <div className="flex-1 pt-1">
             <div className="flex justify-between items-baseline mb-2">
               <h2 className="font-bold text-xl text-sky-900 tracking-tight">
                 {content?.weatherData.city} <span className="text-sky-500">{content?.weatherData.temp}°C</span>
               </h2>
               <span className="text-xs text-sky-400 font-bold uppercase tracking-wider bg-sky-50 px-2 py-1 rounded-lg">
                 {config.nickname}
               </span>
             </div>
             <p className="text-sm text-slate-600 leading-snug font-medium">
               {content?.weatherTip}
             </p>
           </div>
        </div>
      </section>

      {/* Middle: Cat Image & Quote (Square Ratio) */}
      <section className="w-full aspect-square relative mb-6 rounded-[2.5rem] overflow-hidden shadow-xl shadow-sky-200 bg-sky-200 group z-10 shrink-0 border-4 border-white">
        {/* Refresh Button */}
        <button 
          onClick={fetchCatImage}
          className="absolute top-4 right-4 z-30 p-3 bg-white/40 backdrop-blur-md rounded-full text-white hover:bg-white/60 transition-all active:rotate-180 shadow-sm"
        >
          <RefreshCw size={22} />
        </button>

        {/* Image Container with Double Click Listener */}
        <div 
          className="w-full h-full relative cursor-pointer"
          onDoubleClick={handleDoubleTap}
        >
            {imgLoading ? (
               <div className="w-full h-full flex items-center justify-center bg-sky-100">
                  <Loader2 className="animate-spin text-sky-400" size={40} />
               </div>
            ) : (
              <img 
                src={imgUrl} 
                alt="Daily Cat" 
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

            {/* Quote Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 text-white pointer-events-none">
              <p className="font-serif italic text-xl md:text-2xl leading-relaxed opacity-95 drop-shadow-md text-center">
                "{content?.quote}"
              </p>
            </div>

            {/* Like Animations */}
            {likes.map((id) => (
              <div 
                key={id}
                className="absolute top-1/2 left-1/2 -ml-8 -mt-8 text-red-400 animate-float-up pointer-events-none z-40 drop-shadow-lg"
              >
                <Heart fill="currentColor" size={64} />
              </div>
            ))}
        </div>
      </section>

      {/* Bottom: Horoscope */}
      <section className="flex-none z-10 mb-4">
        <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white rounded-[2rem] p-6 shadow-xl shadow-sky-200 relative overflow-hidden">
          {/* Decorative Sparkles */}
          <Sparkles className="absolute top-4 right-4 text-sky-300 opacity-50" size={40} />
          
          <div className="flex items-center gap-3 mb-3 opacity-95 relative z-10">
             <span className="text-xs font-bold bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg uppercase tracking-wide border border-white/10">
               {config.zodiac}
             </span>
             <span className="text-sm text-sky-100 font-medium">Daily Horoscope</span>
          </div>
          <p className="text-base font-medium leading-relaxed relative z-10 text-sky-50">
            {content?.horoscope}
          </p>
        </div>
      </section>

      <div className="h-4"></div> {/* Bottom Spacer */}
    </div>
  );
};

export default Dashboard;