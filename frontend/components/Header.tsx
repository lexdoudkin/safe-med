import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  onBack?: () => void;
  appState: AppState;
}

const Header: React.FC<HeaderProps> = ({ onBack, appState }) => {
  const showBack = appState !== AppState.ONBOARDING;

  return (
    <header className="sticky top-0 z-50 bg-[#F2F2F7]/80 backdrop-blur-xl">
      <div className="max-w-lg mx-auto px-4 h-12 flex items-center justify-between">
        {/* Back */}
        <div className="w-16">
          {showBack && onBack && (
            <button
              onClick={onBack}
              className="text-[#007AFF] font-medium flex items-center gap-1"
            >
              <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
                <path d="M10.59 16.59L6.42 12.42a.996.996 0 010-1.41L10.59 6.59 9.17 5.17 3.59 10.75a.996.996 0 000 1.41l5.58 5.59 1.42-1.16z"/>
              </svg>
              Back
            </button>
          )}
        </div>

        {/* Title */}
        <h1 className="font-semibold text-[17px] text-black">SafeMed</h1>

        {/* Spacer */}
        <div className="w-16" />
      </div>
    </header>
  );
};

export default Header;
