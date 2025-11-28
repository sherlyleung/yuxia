import React from 'react';
import { UserConfig } from '../types';
import { Heart } from 'lucide-react';

interface LoveLetterModalProps {
  config: UserConfig;
  onOpenDashboard: () => void;
}

const LoveLetterModal: React.FC<LoveLetterModalProps> = ({ config, onOpenDashboard }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-sky-900/30 backdrop-blur-md animate-fade-in">
      <div className="bg-white/95 rounded-[2rem] shadow-2xl p-8 max-w-sm w-full relative overflow-hidden border-4 border-sky-100">
        {/* Decorative background circle */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-sky-100 rounded-full opacity-60"></div>
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-sky-50 rounded-full opacity-60"></div>
        
        <div className="relative z-10 text-center space-y-6">
          <div className="flex justify-center text-red-400 animate-bounce drop-shadow-sm">
            <Heart fill="currentColor" size={48} />
          </div>
          
          <div className="space-y-4 text-left">
            <h2 className="text-2xl font-bold text-sky-800">
              {config.nickname}:
            </h2>
            <p className="text-slate-600 leading-relaxed text-lg font-medium">
              接下来请打开你的每日专属提醒。
              <br />
              <span className="font-bold text-sky-500 text-xl">我一直爱你。</span>
            </p>
            <p className="text-right text-sky-400 text-sm mt-4 font-bold">
              —— 乔夏
            </p>
          </div>

          <button
            onClick={onOpenDashboard}
            className="w-full mt-6 bg-gradient-to-r from-sky-400 to-sky-500 hover:from-sky-500 hover:to-sky-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-sky-200 transition-all transform active:scale-95 text-lg"
          >
            开启
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoveLetterModal;