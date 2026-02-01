import React from 'react';
import { Heartbeat, User, CaretLeft, HandHeart } from '@phosphor-icons/react';
import { AppState } from '../types';

interface HeaderProps {
  onBack?: () => void;
  appState: AppState;
}

const Header: React.FC<HeaderProps> = ({ onBack, appState }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-cream/80 backdrop-blur-lg border-b border-navy/5">
      <div className="max-w-3xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Back Button */}
        <div className="w-14">
          {appState !== AppState.ONBOARDING && onBack && (
            <button
              onClick={onBack}
              className="p-3 text-navy/60 hover:text-coral hover:bg-coral-light rounded-full transition-all"
              aria-label="Go back"
            >
              <CaretLeft size={28} weight="bold" />
            </button>
          )}
        </div>

        {/* Logo */}
        <div
          className="flex items-center gap-3 cursor-pointer group"
          onClick={() => appState !== AppState.ONBOARDING && onBack?.()}
        >
          <div className="relative">
            <div className="w-11 h-11 bg-gradient-to-br from-coral to-coral-dark rounded-2xl flex items-center justify-center shadow-warm group-hover:scale-105 transition-transform">
              <HandHeart size={24} weight="fill" className="text-white" />
            </div>
          </div>
          <span className="font-display font-bold text-2xl text-navy tracking-tight">
            Safe<span className="text-coral">Med</span>
          </span>
        </div>

        {/* Profile */}
        <div className="w-14 flex justify-end">
          {appState !== AppState.ONBOARDING && appState !== AppState.PROFILE && (
            <button
              onClick={onBack}
              className="p-3 text-navy/40 hover:text-teal hover:bg-teal-light rounded-full transition-all"
              aria-label="View profile"
            >
              <User size={26} weight="duotone" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
