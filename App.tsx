import React, { useState } from 'react';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import DrugInput from './components/DrugInput';
import AnalysisResult from './components/AnalysisResult';
import { AppState, UserProfile, AnalysisResult as AnalysisResultType } from './types';
import { analyzeDrugSafety } from './services/geminiService';
import { Activity } from 'lucide-react';

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
          <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8 animate-fade-in">
            <div className="bg-emerald-100 p-6 rounded-full shadow-emerald-200 shadow-xl mb-4">
              <Activity className="w-16 h-16 text-emerald-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Personalized <span className="text-emerald-600">Medicine</span> Safety
            </h1>
            <p className="text-lg text-slate-600 max-w-md mx-auto leading-relaxed">
              SafeMed uses AI to analyze how medications interact with <span className="font-bold text-slate-800">your unique body</span>, conditions, and biomarkers.
            </p>
            <button 
              onClick={startOnboarding}
              className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              Build My Health Profile
            </button>
            <p className="text-xs text-slate-400 mt-8">Secure • Private • AI-Powered</p>
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
              <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-center">
                {error}
              </div>
            )}
            <DrugInput onAnalyze={handleAnalyze} />
          </>
        )}

        {/* State: Analyzing */}
        {appState === AppState.ANALYZING && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-pulse">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-emerald-500 rounded-full border-t-transparent animate-spin"></div>
              <Activity className="absolute inset-0 m-auto text-emerald-500 w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Analyzing Interactions...</h2>
            <p className="text-slate-500">Cross-referencing with your profile: {profile.conditions.join(', ') || 'General health'}</p>
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
