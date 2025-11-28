import React from 'react';
import { MapPin, CloudSun, X } from 'lucide-react';

interface LocationPermissionModalProps {
  onAllow: () => void;
  onSkip: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ onAllow, onSkip }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-sky-900/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 rounded-[2.5rem] shadow-2xl p-8 max-w-sm w-full relative overflow-hidden border-4 border-sky-100">
        
        {/* Decorative Background */}
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-sky-50 to-transparent"></div>
        <div className="absolute -top-6 -right-6 text-sky-100 opacity-50">
          <CloudSun size={100} />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-6">
          
          {/* Icon */}
          <div className="bg-sky-100 p-5 rounded-full text-sky-500 shadow-inner ring-4 ring-white animate-bounce">
            <MapPin size={40} strokeWidth={2.5} />
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h2 className="text-2xl font-black text-sky-800 tracking-tight">
              Sniff the Weather?
            </h2>
            <p className="text-slate-600 font-medium leading-relaxed">
              To tell you if it's perfect for a nap or a walk, I need to know where we are!
              <br/>
              <span className="text-xs text-sky-400 font-bold uppercase mt-2 block">
                (Can I use your location?)
              </span>
            </p>
          </div>

          {/* Buttons */}
          <div className="w-full space-y-3 pt-2">
            <button
              onClick={onAllow}
              className="w-full bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-sky-200 transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <MapPin size={18} fill="currentColor" />
              Yes, Locate Me!
            </button>
            
            <button
              onClick={onSkip}
              className="w-full bg-white text-slate-400 font-bold py-3 rounded-2xl hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-slate-100 text-sm"
            >
              No thanks, keep it secret
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LocationPermissionModal;