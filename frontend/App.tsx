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
    <div className="h-screen flex flex-col bg-[#F2F2F7]">
      <Header onBack={appState !== AppState.ONBOARDING ? handleBack : undefined} appState={appState} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-lg mx-auto px-4 py-4">
          {/* ONBOARDING */}
          {appState === AppState.ONBOARDING && (
            <div className="animate-in space-y-6 pt-8">
              {/* Hero */}
              <div className="text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-[#FF3B30] to-[#FF9500] rounded-[22px] flex items-center justify-center shadow-lg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold text-black mb-2">SafeMed</h1>
                <p className="text-[#8E8E93] text-lg">
                  Check if medications are safe for you
                </p>
              </div>

              {/* Features */}
              <div className="card p-4 space-y-4">
                <Feature
                  icon="🔒"
                  title="Private"
                  desc="Your data stays on your device"
                />
                <Feature
                  icon="🧬"
                  title="Personalized"
                  desc="Based on your health profile"
                />
                <Feature
                  icon="📊"
                  title="Evidence-Based"
                  desc="Powered by clinical data"
                />
              </div>

              {/* CTA */}
              <button
                onClick={startOnboarding}
                className="w-full py-4 bg-[#007AFF] text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
              >
                Get Started
              </button>

              <p className="text-center text-xs text-[#8E8E93]">
                Always consult your doctor before taking medication
              </p>
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
                <div className="mb-4 p-4 bg-[#FF3B30]/10 border border-[#FF3B30]/20 rounded-xl text-[#FF3B30] text-center">
                  {error}
                </div>
              )}
              <DrugInput onAnalyze={handleAnalyze} />
            </>
          )}

          {/* ANALYZING */}
          {appState === AppState.ANALYZING && (
            <div className="flex flex-col items-center justify-center py-20 animate-in">
              <div className="relative mb-6">
                <div className="w-16 h-16 border-4 border-[#E5E5EA] border-t-[#007AFF] rounded-full animate-spin" />
              </div>
              <h2 className="text-xl font-semibold text-black mb-2">Analyzing...</h2>
              <p className="text-[#8E8E93]">Checking safety for your profile</p>
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

const Feature: React.FC<{ icon: string; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="flex items-center gap-4">
    <div className="w-10 h-10 bg-[#F2F2F7] rounded-full flex items-center justify-center text-xl">
      {icon}
    </div>
    <div>
      <h3 className="font-semibold text-black">{title}</h3>
      <p className="text-sm text-[#8E8E93]">{desc}</p>
    </div>
  </div>
);

export default App;
