import React, { useState, useEffect, useCallback, useRef } from 'react';
import { UserConfig, DailyContent } from '../types';
import { generateDailyContent } from '../services/geminiService';
import { RefreshCw, Heart, Loader2, CloudSun, Sparkles, MapPin, PawPrint } from 'lucide-react';
import DachshundFoodDecider from './DachshundFoodDecider';
import CatWisdomBook from './CatWisdomBook';
import LocationPermissionModal from './LocationPermissionModal';

interface DashboardProps {
  config: UserConfig;
}

// Helpers for Weather Status formatting - Soft Gradients & Rounded Theme
const getUvStatus = (uv: number) => {
  if (uv <= 2) return { label: 'Low', className: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-100' };
  if (uv <= 5) return { label: 'Moderate', className: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-100' };
  if (uv <= 7) return { label: 'High', className: 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-100' };
  if (uv <= 10) return { label: 'Very High', className: 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-100' };
  return { label: 'Extreme', className: 'bg-gradient-to-r from-purple-50 to-fuchsia-50 text-purple-700 border-purple-100' };
};

const getAqiStatus = (aqi: number) => {
  if (aqi <= 50) return { label: 'Good', className: 'bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-700 border-emerald-100' };
  if (aqi <= 100) return { label: 'Moderate', className: 'bg-gradient-to-r from-amber-50 to-yellow-50 text-amber-700 border-amber-100' };
  if (aqi <= 150) return { label: 'Sensitive', className: 'bg-gradient-to-r from-orange-50 to-red-50 text-orange-700 border-orange-100' };
  if (aqi <= 200) return { label: 'Unhealthy', className: 'bg-gradient-to-r from-rose-50 to-pink-50 text-rose-700 border-rose-100' };
  if (aqi <= 300) return { label: 'Very Poor', className: 'bg-gradient-to-r from-purple-50 to-fuchsia-50 text-purple-700 border-purple-100' };
  return { label: 'Hazardous', className: 'bg-gradient-to-r from-slate-100 to-gray-200 text-slate-700 border-slate-200' };
};

const Dashboard: React.FC<DashboardProps> = ({ config }) => {
  const [content, setContent] = useState<DailyContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgUrl, setImgUrl] = useState<string>('');
  const [imgLoading, setImgLoading] = useState(true);
  const [likes, setLikes] = useState<number[]>([]);
  const [showLocationModal, setShowLocationModal] = useState(true);
  
  const mountedRef = useRef(false);

  const fetchCatImage = useCallback(() => {
    setImgLoading(true);
    const url = `https://cataas.com/cat?width=800&height=800&t=${Date.now()}`;
    const img = new Image();
    img.src = url;
    img.onload = () => {
      setImgUrl(url);
      setImgLoading(false);
    };
  }, []);

  // Main data fetch function
  const fetchData = useCallback(async (lat?: number, lon?: number) => {
    setLoading(true);
    try {
      // Check explicitly for number type to handle 0 coordinates correctly
      const hasCoords = typeof lat === 'number' && typeof lon === 'number';
      const dailyData = await generateDailyContent(
        config, 
        hasCoords ? { lat: lat!, lon: lon! } : undefined
      );
      
      setContent(dailyData);
      fetchCatImage();
    } catch (error) {
      console.error("Dashboard Load Error", error);
    } finally {
      setLoading(false);
    }
  }, [config, fetchCatImage]);

  // Handle Location Permission: Allow
  const handleAllowLocation = () => {
    setShowLocationModal(false);
    // Keep loading state true while browser asks for permission
    setLoading(true); 

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location granted:", position.coords);
          fetchData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.warn("Location permission denied or error:", error);
          fetchData(); // Fallback to default/random data
        },
        { timeout: 10000, maximumAge: 60000 }
      );
    } else {
      console.warn("Geolocation not supported");
      fetchData(); // Browser doesn't support, fallback
    }
  };

  // Handle Location Permission: Skip
  const handleSkipLocation = () => {
    setShowLocationModal(false);
    fetchData(); // Load with default/random data
  };

  const handleDoubleTap = (e: React.MouseEvent) => {
    setLikes(prev => [...prev, Date.now()]);
    setTimeout(() => {
      setLikes(prev => prev.slice(1));
    }, 1000);
  };

  // Removed useEffect auto-fetch. 
  // We now wait for the user to interact with the Location Modal.

  // If showing location modal, return it immediately (blocking other views)
  if (showLocationModal) {
    return (
      <div className="min-h-screen w-full bg-cute-pattern relative flex items-center justify-center">
        {/* Background elements to keep context */}
        <div className="absolute top-20 left-10 text-sky-200/50"><CloudSun size={60} /></div>
        <LocationPermissionModal onAllow={handleAllowLocation} onSkip={handleSkipLocation} />
      </div>
    );
  }

  if (loading && !content) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-cute-pattern text-sky-400 relative overflow-hidden">
        {/* Animated Clouds Background */}
        <div className="absolute top-20 left-10 text-sky-100 animate-pulse delay-75"><CloudSun size={60} /></div>
        <div className="absolute bottom-20 right-10 text-sky-100 animate-pulse delay-300"><CloudSun size={80} /></div>
        
        <div className="bg-white/90 backdrop-blur-xl p-8 rounded-full shadow-[0_0_40px_rgba(186,230,253,0.5)] mb-6 animate-bounce">
          <Loader2 className="animate-spin text-sky-400" size={48} />
        </div>
        <p className="font-bold text-lg text-sky-500 bg-white/80 px-6 py-3 rounded-2xl shadow-sm tracking-wide">
          Connecting to Cat Planet...
        </p>
      </div>
    );
  }

  // Pre-calculate status for UI
  const uvStatus = content?.weatherData.uvIndex !== undefined ? getUvStatus(content.weatherData.uvIndex) : null;
  const aqiStatus = content?.weatherData.aqi !== undefined ? getAqiStatus(content.weatherData.aqi) : null;

  return (
    <div className="min-h-screen w-full bg-cute-pattern text-slate-800 flex flex-col p-5 overflow-y-auto relative selection:bg-sky-200">
      
      {/* GLOBAL BACKGROUND DECORATIONS (Floating Paws & Hearts) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-10 -right-4 text-sky-200 opacity-30 transform rotate-12"><PawPrint size={100} /></div>
        <div className="absolute top-40 -left-6 text-blue-200 opacity-20 transform -rotate-12"><PawPrint size={80} /></div>
        <div className="absolute bottom-20 right-4 text-pink-200 opacity-20 transform rotate-45"><Heart size={60} fill="currentColor" /></div>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-50/20 to-blue-100/10"></div>
      </div>

      {/* Top: Weather & Tip Module - Compact & Cute Redesign */}
      <section className="flex-none mb-5 z-10 relative mt-2 group">
        <div className="bg-gradient-to-r from-white/90 via-sky-50/95 to-blue-50/90 backdrop-blur-xl rounded-[2rem] p-4 shadow-[0_8px_20px_-6px_rgba(186,230,253,0.8)] border-2 border-white transition-all duration-300 hover:scale-[1.01]">
           {/* Top Row: Status Bar style */}
           <div className="flex justify-between items-start mb-3">
              <div className="flex items-start gap-3 w-full">
                 {/* Compact Icon */}
                 <div className="bg-sky-100/60 p-2 rounded-2xl text-sky-500 ring-2 ring-white shadow-sm mt-1 shrink-0">
                    <CloudSun size={22} strokeWidth={2.5} />
                 </div>
                 
                 {/* Compact Info */}
                 <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-1.5">
                       <span className="text-3xl font-black text-sky-800 tracking-tighter leading-none">{content?.weatherData.temp}°</span>
                       <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wide truncate">{content?.weatherData.condition}</span>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-1.5">
                       <div className="flex items-center gap-1 text-[11px] font-bold text-sky-900/50 leading-none">
                          <MapPin size={10} strokeWidth={3} />
                          <span className="truncate max-w-[140px]">{content?.weatherData.city}</span>
                       </div>
                       
                       {/* UV & AQI Badges - Force Row Layout (no wrap) for side-by-side */}
                       <div className="flex flex-row flex-nowrap gap-2 overflow-hidden items-center">
                          {uvStatus && (
                            <div className={`px-2 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap ${uvStatus.className}`}>
                              <span>UV {content?.weatherData.uvIndex}</span>
                              <span className="uppercase opacity-75 text-[9px] border-l border-current/20 pl-1.5 leading-none">{uvStatus.label}</span>
                            </div>
                          )}
                          
                          {aqiStatus && (
                            <div className={`px-2 py-1 rounded-full border text-[10px] font-bold flex items-center gap-1.5 shadow-sm whitespace-nowrap ${aqiStatus.className}`}>
                              <span>AQI {content?.weatherData.aqi}</span>
                              <span className="uppercase opacity-75 text-[9px] border-l border-current/20 pl-1.5 leading-none">{aqiStatus.label}</span>
                            </div>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
              
              {/* Nickname Badge */}
              <div className="bg-sky-300/20 border border-sky-200 text-sky-600 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-sm transform -rotate-1 shrink-0 ml-2">
                 {config.nickname}
              </div>
           </div>

           {/* Bottom Row: Tip Bubble */}
           <div className="bg-white/60 p-3 rounded-2xl border border-sky-100/50 relative shadow-sm">
               <div className="flex gap-2 items-center">
                  <div className="text-lg animate-bounce select-none shrink-0">🐱</div>
                  <p className="text-xs text-sky-800/90 font-bold leading-tight">
                    {content?.weatherTip}
                  </p>
               </div>
           </div>
        </div>
      </section>

      {/* Middle: Cat Image (Polaroid Style) */}
      <section className="w-full relative mb-8 z-10 shrink-0">
        <div className="aspect-square relative rounded-[3rem] bg-white p-3 shadow-[0_20px_40px_-12px_rgba(56,189,248,0.3)] transform rotate-1 hover:rotate-0 transition-transform duration-500 border border-white">
          
          <div className="w-full h-full relative rounded-[2.5rem] overflow-hidden bg-sky-100 cursor-pointer group" onDoubleClick={handleDoubleTap}>
              {/* Refresh Button */}
              <button 
                onClick={(e) => { e.stopPropagation(); fetchCatImage(); }}
                className="absolute top-5 right-5 z-30 p-3 bg-white/30 backdrop-blur-md rounded-full text-white hover:bg-white/50 transition-all active:scale-90 hover:rotate-180 shadow-sm border border-white/20"
              >
                <RefreshCw size={24} strokeWidth={2.5} />
              </button>

              {imgLoading ? (
                 <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                    <Loader2 className="animate-spin text-sky-300" size={48} />
                    <span className="text-sky-300 text-sm font-bold">Summoning Cat...</span>
                 </div>
              ) : (
                <img 
                  src={imgUrl} 
                  alt="Daily Cat" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              )}
              
              {/* Gradient & Quote */}
              <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-8 text-white pointer-events-none transform translate-y-2 group-hover:translate-y-0 transition-transform">
                <p className="font-serif italic text-xl md:text-2xl leading-relaxed drop-shadow-md text-center text-white/95">
                  "{content?.quote}"
                </p>
              </div>

              {/* Likes */}
              {likes.map((id) => (
                <div key={id} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-rose-400 animate-float-up pointer-events-none z-40 drop-shadow-xl">
                  <Heart fill="currentColor" size={80} />
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Feature: The Doxie's Daily Diner */}
      <DachshundFoodDecider />

      {/* Feature: Cat's Book of Wisdom */}
      <CatWisdomBook />

      {/* Horoscope Module */}
      <section className="flex-none mb-8 z-10 relative">
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-50 rounded-[2.5rem] p-6 shadow-lg shadow-purple-100/50 border-2 border-white">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-white rounded-full text-purple-500 shadow-sm">
                <Sparkles size={20} fill="currentColor" className="text-purple-200" />
              </div>
              <h3 className="text-lg font-black text-purple-900 tracking-tight">
                Star Whispers <span className="text-purple-400 font-medium ml-1 text-base">for {config.zodiac}</span>
              </h3>
            </div>
            
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-purple-100">
               <p className="text-sm text-purple-900/80 leading-relaxed font-medium">
                 {content?.horoscope}
               </p>
            </div>
          </div>
        </div>
      </section>

      <div className="h-8 flex justify-center items-center text-sky-300 text-xs font-bold tracking-widest opacity-50 pb-4">
         MADE WITH LOVE & MEOWS
      </div>
    </div>
  );
};

export default Dashboard;