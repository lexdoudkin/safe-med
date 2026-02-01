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
  CaretRight,
} from '@phosphor-icons/react';
import { MedicalIllustrations } from './components/HealthIcons';

// Default empty profile
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

  const startOnboarding = () => {
    setAppState(AppState.PROFILE);
  };

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
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-10">
      <Header onBack={appState !== AppState.ONBOARDING ? handleBack : undefined} appState={appState} />

      <main className="max-w-3xl mx-auto px-4 pt-8">
        {/* State: Onboarding Landing */}
        {appState === AppState.ONBOARDING && (
          <div className="flex flex-col items-center justify-center min-h-[75vh] text-center space-y-8 animate-fade-in px-2">
            {/* Hero Illustration */}
            <div className="relative">
              <div className="bg-gradient-to-br from-emerald-100 to-emerald-50 p-8 rounded-full shadow-xl shadow-emerald-100">
                <Heartbeat size={80} weight="duotone" className="text-emerald-600" />
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-lg">
                <ShieldCheck size={36} weight="fill" className="text-emerald-500" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight">
                Personalized
                <span className="text-emerald-600 block md:inline"> Medicine Safety</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 max-w-lg mx-auto leading-relaxed">
                Check if your medications are safe for <span className="font-bold text-slate-800">your unique body</span> and health conditions.
              </p>
            </div>

            {/* CTA Button - Extra large for seniors */}
            <button
              onClick={startOnboarding}
              className="px-10 py-5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xl font-bold rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-emerald-200 transition-all transform hover:-translate-y-1 flex items-center gap-3"
            >
              <span>Get Started</span>
              <CaretRight size={28} weight="bold" />
            </button>

            {/* Trust indicators */}
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              <div className="flex items-center gap-2 text-slate-500">
                <Lock size={24} weight="duotone" className="text-slate-400" />
                <span className="text-base">Private & Secure</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <Sparkle size={24} weight="duotone" className="text-slate-400" />
                <span className="text-base">AI-Powered Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500">
                <ShieldCheck size={24} weight="duotone" className="text-slate-400" />
                <span className="text-base">Science-Based</span>
              </div>
            </div>

            <p className="text-sm text-slate-400 mt-4 max-w-sm">
              SafeMed provides general guidance only. Always consult your doctor or pharmacist before starting any medication.
            </p>
          </div>
        )}

        {/* State: Profile */}
        {appState === AppState.PROFILE && (
          <ProfileForm initialProfile={profile} onSave={handleProfileSave} />
        )}

        {/* State: Input */}
        {appState === AppState.INPUT && (
          <>
            {error && (
              <div className="mb-6 p-5 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-center text-lg">
                <strong>Error:</strong> {error}
              </div>
            )}
            <DrugInput onAnalyze={handleAnalyze} />
          </>
        )}

        {/* State: Analyzing */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[65vh] text-center animate-pulse px-2">
            <div className="relative w-32 h-32 mb-10">
              <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
              <Heartbeat className="absolute inset-0 m-auto text-emerald-500 w-12 h-12" weight="duotone" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-3">Analyzing Your Medicine...</h2>
            <p className="text-lg text-slate-500 max-w-md">
              Checking safety based on your profile:
              <span className="font-semibold text-slate-700 block mt-1">
                {profile.conditions.length > 0 ? profile.conditions.join(', ') : 'General health'}
              </span>
            </p>
          </div>
        )}

        {/* State: Results */}
        {appState === AppState.RESULTS && result && (
          <AnalysisResult result={result} onReset={handleReset} />
        )}
      </main>
    </div>
  );
};

export default App;
