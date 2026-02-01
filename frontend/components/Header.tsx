import React from 'react';
import { AppState } from '../types';

interface HeaderProps {
  onBack?: () => void;
  appState: AppState;
}

const Header: React.FC<HeaderProps> = ({ onBack, appState }) => {
  const showBack = appState !== AppState.ONBOARDING;

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(84, 84, 88, 0.35)'
    }}>
      <div style={{
        maxWidth: '428px',
        margin: '0 auto',
        padding: '0 16px',
        height: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Back */}
        <div style={{ width: '64px' }}>
          {showBack && onBack && (
            <button
              onClick={onBack}
              style={{
                background: 'none',
                border: 'none',
                color: '#007AFF',
                fontSize: '17px',
                fontWeight: '400',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                padding: 0
              }}
            >
              <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
                <path d="M11.67 1.77L9.9 0 0 10l9.9 10 1.77-1.77L3.54 10z"/>
              </svg>
              Back
            </button>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: '17px',
          fontWeight: '600',
          color: '#FFFFFF',
          margin: 0
        }}>
          SafeMed
        </h1>

        {/* Spacer */}
        <div style={{ width: '64px' }} />
      </div>
    </header>
  );
};

export default Header;
