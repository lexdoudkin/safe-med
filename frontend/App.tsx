import React, { useState } from 'react';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import DrugInput from './components/DrugInput';
import AnalysisResult from './components/AnalysisResult';
import { AppState, UserProfile, AnalysisResult as AnalysisResultType } from './types';
import { analyzeDrugSafety } from './services/hybridAnalysisService';

const DEFAULT_PROFILE: UserProfile = {
  age: 0,
  gender: 'Male',
  weight: 0,
  height: 0,
  ethnicity: '',
  conditions: []
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startOnboarding = () => setAppState(AppState.PROFILE);
  const handleProfileSave = (data: UserProfile) => {
    setProfile(data);
    setAppState(AppState.INPUT);
  };

  const handleAnalyze = async (text: string, image?: File) => {
    setAppState(AppState.ANALYZING);
    setError(null);
    try {
      const data = await analyzeDrugSafety(profile, text, image);
      setResult(data);
      setAppState(AppState.RESULTS);
    } catch (err) {
      setError((err as Error).message);
      setAppState(AppState.INPUT);
    }
  };

  const handleReset = () => {
    setResult(null);
    setAppState(AppState.INPUT);
  };

  const handleBack = () => {
    if (appState === AppState.RESULTS) setAppState(AppState.INPUT);
    else if (appState === AppState.INPUT) setAppState(AppState.PROFILE);
    else if (appState === AppState.PROFILE) setAppState(AppState.ONBOARDING);
  };

  return (
    <div className="container-app">
      <Header onBack={appState !== AppState.ONBOARDING ? handleBack : undefined} appState={appState} />

      <main className="scroll-container">
        <div className="content-padding" style={{ paddingTop: '16px', paddingBottom: '32px' }}>
          {/* ONBOARDING */}
          {appState === AppState.ONBOARDING && (
            <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingTop: '32px' }}>
              {/* Hero */}
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  margin: '0 auto 16px',
                  background: 'linear-gradient(135deg, #FF3B30, #FF9500)',
                  borderRadius: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(255, 59, 48, 0.3)'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h1 style={{ fontSize: '32px', fontWeight: '700', color: '#FFFFFF', margin: 0 }}>SafeMed</h1>
                <p style={{ fontSize: '17px', color: '#8E8E93', margin: '8px 0 0 0' }}>
                  Check if medications are safe for you
                </p>
              </div>

              {/* Features */}
              <div className="card">
                <Feature
                  icon={<LockIcon />}
                  iconBg="#34C759"
                  title="Private"
                  desc="Your data stays on your device"
                />
                <Feature
                  icon={<DnaIcon />}
                  iconBg="#5856D6"
                  title="Personalized"
                  desc="Based on your health profile"
                />
                <Feature
                  icon={<ChartIcon />}
                  iconBg="#007AFF"
                  title="Evidence-Based"
                  desc="Powered by clinical data"
                />
              </div>

              {/* CTA */}
              <button onClick={startOnboarding} className="btn-primary">
                Get Started
              </button>

              <div className="disclaimer">
                Always consult your doctor before taking medication
              </div>
            </div>
          )}

          {/* PROFILE */}
          {appState === AppState.PROFILE && (
            <ProfileForm initialProfile={profile} onSave={handleProfileSave} />
          )}

          {/* INPUT */}
          {appState === AppState.INPUT && (
            <>
              {error && (
                <div style={{
                  marginBottom: '16px',
                  padding: '16px',
                  background: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.2)',
                  borderRadius: '12px',
                  color: '#FF3B30',
                  textAlign: 'center',
                  fontSize: '15px'
                }}>
                  {error}
                </div>
              )}
              <DrugInput onAnalyze={handleAnalyze} />
            </>
          )}

          {/* ANALYZING */}
          {appState === AppState.ANALYZING && (
            <div className="animate-in" style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingTop: '80px',
              gap: '24px'
            }}>
              <div className="spinner" />
              <div style={{ textAlign: 'center' }}>
                <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#FFFFFF', margin: 0 }}>
                  Analyzing...
                </h2>
                <p style={{ fontSize: '15px', color: '#8E8E93', margin: '8px 0 0 0' }}>
                  Checking safety for your profile
                </p>
              </div>
            </div>
          )}

          {/* RESULTS */}
          {appState === AppState.RESULTS && result && (
            <AnalysisResult result={result} onReset={handleReset} />
          )}
        </div>
      </main>
    </div>
  );
};

// Feature row component
const Feature: React.FC<{ icon: React.ReactNode; iconBg: string; title: string; desc: string }> = ({ icon, iconBg, title, desc }) => (
  <div className="list-item">
    <div className="list-icon" style={{ background: iconBg }}>
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>{title}</div>
      <div style={{ fontSize: '14px', color: '#8E8E93' }}>{desc}</div>
    </div>
  </div>
);

// Icons
const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const DnaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M4 2h2v2c0 .87.19 1.7.53 2.44C7.31 6.23 8.14 6 9 6h6c.86 0 1.69.23 2.47.44.34-.74.53-1.57.53-2.44V2h2v2c0 1.16-.33 2.24-.91 3.17.35.39.67.82.94 1.29.62 1.07 1.12 2.22 1.39 3.42.12.55-.31 1.12-.89 1.12h-1.72c-.88 0-1.59-.72-1.59-1.6 0-.44-.09-.86-.25-1.25-.45.64-1.13 1.15-1.97 1.45V12h-6v-.4c-.84-.3-1.52-.81-1.97-1.45-.16.39-.25.81-.25 1.25 0 .88-.71 1.6-1.59 1.6H3.47c-.58 0-1.01-.57-.89-1.12.27-1.2.77-2.35 1.39-3.42.27-.47.59-.9.94-1.29C4.33 6.24 4 5.16 4 4V2zm5 8h6v2H9v-2zm0 4h6v2H9v-2zm0 4h6v2H9v-2z"/>
  </svg>
);

const ChartIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h2v10H7V7zm4 4h2v6h-2v-6zm4-2h2v8h-2V9z"/>
  </svg>
);

export default App;
