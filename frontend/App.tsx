import React, { useState } from 'react';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import DrugInput from './components/DrugInput';
import AnalysisResult from './components/AnalysisResult';
import { AppState, UserProfile, AnalysisResult as AnalysisResultType } from './types';
import { analyzeDrugSafety } from './services/geminiService';
import {
  Heartbeat,
  ShieldCheck,
  Sparkle,
  Lock,
  ArrowRight,
  HandHeart,
  Star,
  Leaf,
} from '@phosphor-icons/react';

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
    <div className="h-screen flex flex-col bg-cream text-navy overflow-hidden">
      <Header onBack={appState !== AppState.ONBOARDING ? handleBack : undefined} appState={appState} />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-4">
        {/* ONBOARDING - Warm, inviting landing */}
        {appState === AppState.ONBOARDING && (
          <div className="h-full flex flex-col items-center justify-center text-center px-2 py-4">
            {/* Decorative blobs */}
            <div className="absolute top-20 left-10 w-64 h-64 bg-coral-light blob opacity-50 blur-3xl -z-10" />
            <div className="absolute bottom-20 right-10 w-80 h-80 bg-sage-light blob-2 opacity-50 blur-3xl -z-10" />

            {/* Hero Icon */}
            <div className="relative mb-6 animate-fade-in-up">
              <div className="relative">
                <div className="w-24 h-24 md:w-28 md:h-28 bg-gradient-to-br from-coral to-coral-dark rounded-full flex items-center justify-center shadow-warm animate-float">
                  <HandHeart size={48} weight="fill" className="text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lifted">
                  <ShieldCheck size={24} weight="fill" className="text-teal" />
                </div>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-3 mb-6 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
              <h1 className="font-display text-4xl md:text-5xl font-bold text-navy leading-tight">
                Your medicine,
                <br />
                <span className="text-coral underline-hand">your safety</span>
              </h1>
              <p className="text-lg md:text-xl text-navy/70 max-w-md mx-auto leading-relaxed font-light">
                We check if medications are safe for
                <span className="font-semibold text-navy"> your unique body</span>.
              </p>
            </div>

            {/* CTA Button */}
            <button
              onClick={startOnboarding}
              className="btn-primary px-8 py-4 text-white text-lg font-semibold flex items-center gap-3 mb-6 animate-fade-in-up shadow-warm"
              style={{ animationDelay: '0.2s' }}
            >
              <span>Let's get started</span>
              <ArrowRight size={22} weight="bold" />
            </button>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex items-center gap-2 text-navy/50">
                <Lock size={18} weight="duotone" />
                <span className="text-sm font-medium">100% Private</span>
              </div>
              <div className="flex items-center gap-2 text-navy/50">
                <Sparkle size={18} weight="duotone" />
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
              <div className="flex items-center gap-2 text-navy/50">
                <Leaf size={18} weight="duotone" />
                <span className="text-sm font-medium">Science-Based</span>
              </div>
            </div>

            {/* Disclaimer */}
            <p className="text-xs text-navy/40 mt-6 max-w-sm">
              SafeMed provides guidance only. Always consult your doctor before starting any medication.
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
              <div className="mb-6 p-5 bg-coral-light border-2 border-coral/30 text-coral-dark rounded-2xl text-center text-lg">
                <strong>Oops!</strong> {error}
              </div>
            )}
            <DrugInput onAnalyze={handleAnalyze} />
          </>
        )}

        {/* ANALYZING */}
        {appState === AppState.ANALYZING && (
          <div className="h-full flex flex-col items-center justify-center text-center py-4">
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-coral-light rounded-full flex items-center justify-center animate-pulse-glow">
                <Heartbeat size={48} weight="duotone" className="text-coral animate-pulse" />
              </div>
              <div className="absolute inset-0 w-24 h-24 border-4 border-coral/30 rounded-full animate-ping" />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy mb-3">
              Checking your medicine...
            </h2>
            <p className="text-base text-navy/60 max-w-sm">
              Analyzing safety based on your profile
              {profile.conditions.length > 0 && (
                <span className="block mt-2 text-teal font-medium">
                  {profile.conditions.slice(0, 3).join(', ')}
                  {profile.conditions.length > 3 && ` +${profile.conditions.length - 3} more`}
                </span>
              )}
            </p>
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

export default App;
