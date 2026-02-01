import React from 'react';
import { Heartbeat, User, CaretLeft } from '@phosphor-icons/react';
import { AppState } from '../types';

interface HeaderProps {
  onBack?: () => void;
  appState: AppState;
}

const Header: React.FC<HeaderProps> = ({ onBack, appState }) => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Back Button or Spacer */}
        <div className="w-12">
          {appState !== AppState.ONBOARDING && onBack && (
            <button
              onClick={onBack}
              className="p-3 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="Go back"
            >
              <CaretLeft size={28} weight="bold" />
            </button>
          )}
        </div>

        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onBack}>
          <div className="bg-emerald-500 p-2.5 rounded-xl shadow-emerald-200 shadow-lg">
            <Heartbeat size={28} weight="fill" className="text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-800">SafeMed</span>
        </div>

        {/* Profile Button or Spacer */}
        <div className="w-12">
          {appState !== AppState.ONBOARDING && (
            <button
              onClick={onBack}
              className="p-3 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors"
              aria-label="View profile"
            >
              <User size={28} weight="duotone" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
