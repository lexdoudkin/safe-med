import React from 'react';
import { Activity, Menu, User } from 'lucide-react';
import { AppState } from '../types';

interface HeaderProps {
  onBack?: () => void;
  appState: AppState;
}

const Header: React.FC<HeaderProps> = ({ onBack, appState }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/70 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={onBack}>
          <div className="bg-emerald-500 p-2 rounded-lg shadow-emerald-200 shadow-md">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">SafeMed</span>
        </div>
        
        <div className="flex items-center gap-4">
            {appState !== AppState.ONBOARDING && (
                <button 
                  onClick={onBack}
                  className="p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors"
                  aria-label="Profile"
                >
                  <User className="w-5 h-5" />
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
