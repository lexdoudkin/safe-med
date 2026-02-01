import React, { useState } from 'react';
import Header from './components/Header';
import ProfileForm from './components/ProfileForm';
import DrugInput from './components/DrugInput';
import AnalysisResult from './components/AnalysisResult';
import TrustedPartners from './components/TrustedPartners';
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

// Icons
const HeartIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
  </svg>
);

const LockIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
  </svg>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>
  </svg>
);

const LeafIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17 8C8 10 5.9 16.17 3.82 21.34l1.89.66.95-2.3c.48.17.98.3 1.34.3C19 20 22 3 22 3c-1 2-8 2.25-13 3.25S2 11.5 2 13.5s1.75 3.75 1.75 3.75C7 8 17 8 17 8z"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
  </svg>
);

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
      {appState !== AppState.ONBOARDING && (
        <Header onBack={handleBack} appState={appState} />
      )}

      {/* ONBOARDING - Apple Health-inspired landing */}
      {appState === AppState.ONBOARDING && (
        <div style={{ height: '100%', position: 'relative', overflow: 'hidden' }}>
          {/* Animated Gradient Background */}
          <div className="gradient-bg">
            <div className="gradient-blob blob-red blob-glow" />
            <div className="gradient-blob blob-blue blob-glow" />
            <div className="gradient-blob blob-green blob-glow" />
            <div className="gradient-blob blob-teal blob-glow" />
            <div className="gradient-blob blob-pink blob-glow" />
            <div className="gradient-blob blob-orange blob-glow" />
            <div className="gradient-mesh" />
            <div className="gradient-noise" />
          </div>

          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-between',
            textAlign: 'center',
            padding: '48px 24px 24px',
            position: 'relative',
            zIndex: 10
          }}>
            {/* Top Section: Hero + Title + CTA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Hero Icon with glow */}
              <div className="animate-fade-up" style={{ position: 'relative', marginBottom: '24px' }}>
                <div style={{
                  width: '80px',
                  height: '80px',
                  background: 'linear-gradient(135deg, var(--health-red), var(--health-pink))',
                  borderRadius: '22px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 20px 60px rgba(255, 59, 48, 0.4)'
                }}>
                  <HeartIcon />
                </div>
                <div style={{
                  position: 'absolute',
                  bottom: '-8px',
                  right: '-8px',
                  width: '36px',
                  height: '36px',
                  background: 'var(--health-green)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(52, 199, 89, 0.4)'
                }}>
                  <ShieldIcon />
                </div>
              </div>

              {/* Title */}
              <div className="animate-fade-up animate-delay-1" style={{ marginBottom: '24px' }}>
                <h1 style={{
                  fontSize: '40px',
                  fontWeight: '700',
                  color: '#FFFFFF',
                  margin: '0 0 12px 0',
                  lineHeight: '1.1',
                  letterSpacing: '-0.02em'
                }}>
                  Your medicine.
                  <br />
                  <span style={{
                    background: 'linear-gradient(90deg, var(--health-red), var(--health-pink), var(--health-orange))',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}>
                    Your safety.
                  </span>
                </h1>
                <p style={{
                  fontSize: '17px',
                  color: 'var(--text-secondary)',
                  margin: 0,
                  maxWidth: '320px',
                  lineHeight: '1.5',
                  fontWeight: '400'
                }}>
                  AI-powered medication safety checks personalized to your unique health profile.
                </p>
              </div>

              {/* CTA Button */}
              <button
                onClick={startOnboarding}
                className="btn-shine animate-fade-up animate-delay-2"
                style={{
                  padding: '16px 32px',
                  borderRadius: '50px',
                  border: 'none',
                  fontSize: '17px',
                  fontWeight: '600',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '24px',
                  boxShadow: '0 12px 40px rgba(0, 122, 255, 0.4)'
                }}
              >
                <span>Get Started</span>
                <ArrowRightIcon />
              </button>

              {/* Trust badges */}
              <div className="animate-fade-up animate-delay-3" style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '20px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)' }}>
                  <span style={{ color: 'var(--health-green)' }}><LockIcon /></span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Private</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)' }}>
                  <span style={{ color: 'var(--health-blue)' }}><SparkleIcon /></span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>AI-Powered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-tertiary)' }}>
                  <span style={{ color: 'var(--health-teal)' }}><LeafIcon /></span>
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>Science-Based</span>
                </div>
              </div>
            </div>

            {/* Trusted Partners */}
            <TrustedPartners />

            {/* Disclaimer */}
            <p className="animate-fade-up animate-delay-5" style={{
              fontSize: '12px',
              color: 'var(--text-tertiary)',
              margin: 0,
              maxWidth: '300px'
            }}>
              SafeMed provides guidance only. Always consult your doctor before starting any medication.
            </p>
          </div>
        </div>
      )}

      {/* Other states */}
      {appState !== AppState.ONBOARDING && (
        <main className="scroll-container">
          <div className="content-padding" style={{ paddingTop: '16px', paddingBottom: '32px' }}>
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
                  <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#000000', margin: 0 }}>
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
      )}
    </div>
  );
};

export default App;
