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

// Mock data from Apple Health
const APPLE_HEALTH_MOCK: UserProfile = {
  age: 45,
  gender: 'Female',
  weight: 68,
  height: 165,
  ethnicity: 'Caucasian',
  bloodType: 'A+',
  conditions: ['Hypertension', 'High Cholesterol']
};

// Mock data from Health Connect (Android)
const HEALTH_CONNECT_MOCK: UserProfile = {
  age: 62,
  gender: 'Male',
  weight: 82,
  height: 178,
  ethnicity: 'Asian',
  bloodType: 'O+',
  conditions: ['Diabetes', 'Heart Disease', 'Kidney Disease']
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ONBOARDING);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [result, setResult] = useState<AnalysisResultType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startOnboarding = () => setAppState(AppState.PROFILE);

  const handleHealthImport = (source: 'apple' | 'android') => {
    const mockData = source === 'apple' ? APPLE_HEALTH_MOCK : HEALTH_CONNECT_MOCK;
    setProfile(mockData);
    setAppState(AppState.INPUT);
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

  // Landing Page (Web)
  if (appState === AppState.ONBOARDING) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#FFFFFF',
        overflowX: 'hidden'
      }}>
        {/* Navigation */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid #E5E5EA'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                background: 'linear-gradient(135deg, #FF3B30, #FF9500)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span style={{ fontSize: '20px', fontWeight: '700', color: '#000' }}>SafeMed</span>
            </div>
            <button
              onClick={startOnboarding}
              style={{
                padding: '10px 24px',
                background: '#007AFF',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Get Started
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <section style={{
          paddingTop: '120px',
          paddingBottom: '80px',
          background: 'linear-gradient(180deg, #F8F9FA 0%, #FFFFFF 100%)'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '60px',
            flexWrap: 'wrap'
          }}>
            {/* Left: Text */}
            <div style={{ flex: '1 1 500px', minWidth: '300px' }}>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 16px',
                background: 'rgba(52, 199, 89, 0.1)',
                borderRadius: '20px',
                marginBottom: '24px'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#34C759">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#34C759' }}>
                  Trusted by 10,000+ users
                </span>
              </div>

              <h1 style={{
                fontSize: 'clamp(36px, 5vw, 56px)',
                fontWeight: '700',
                color: '#000000',
                lineHeight: '1.1',
                margin: '0 0 24px 0',
                letterSpacing: '-0.02em'
              }}>
                Know if your medicine is{' '}
                <span style={{ color: '#FF3B30' }}>safe for you</span>
              </h1>

              <p style={{
                fontSize: '18px',
                color: '#6B7280',
                lineHeight: '1.6',
                margin: '0 0 32px 0',
                maxWidth: '500px'
              }}>
                AI-powered medication safety checks personalized to your unique health profile. Get instant risk assessments based on your conditions, age, and medications.
              </p>

              <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '32px' }}>
                <button
                  onClick={startOnboarding}
                  style={{
                    padding: '16px 32px',
                    background: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '17px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(0, 122, 255, 0.4)'
                  }}
                >
                  Start Free Check
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8-8-8z"/>
                  </svg>
                </button>
              </div>

              {/* Trust Indicators */}
              <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#34C759">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"/>
                  </svg>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>100% Private</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#007AFF">
                    <path d="M12 2L9.5 9.5 2 12l7.5 2.5L12 22l2.5-7.5L22 12l-7.5-2.5L12 2z"/>
                  </svg>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>AI-Powered</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF9500">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>Evidence-Based</span>
                </div>
              </div>
            </div>

            {/* Right: App Preview */}
            <div style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '280px',
                height: '560px',
                background: '#1C1C1E',
                borderRadius: '40px',
                padding: '12px',
                boxShadow: '0 50px 100px rgba(0, 0, 0, 0.25)'
              }}>
                <div style={{
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(180deg, #F2F2F7 0%, #FFFFFF 100%)',
                  borderRadius: '32px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px'
                }}>
                  {/* Mock Result Card */}
                  <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                      <div style={{ width: '48px', height: '48px', background: '#E8F5E9', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ fontSize: '20px', fontWeight: '700', color: '#34C759' }}>85</span>
                      </div>
                      <div>
                        <div style={{ fontSize: '16px', fontWeight: '600', color: '#000' }}>Ibuprofen</div>
                        <div style={{ fontSize: '13px', color: '#34C759', fontWeight: '500' }}>Generally Safe</div>
                      </div>
                    </div>
                    <div style={{ fontSize: '13px', color: '#6B7280', lineHeight: '1.4' }}>
                      Safe for your profile with minor precautions.
                    </div>
                  </div>

                  {/* Mock Risk Bars */}
                  <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#8E8E93', marginBottom: '12px' }}>SIDE EFFECT RISKS</div>
                    {[
                      { name: 'Stomach upset', pct: 15, color: '#FF9500' },
                      { name: 'Heartburn', pct: 12, color: '#FF9500' },
                      { name: 'Dizziness', pct: 5, color: '#FFCC00' },
                    ].map((item, i) => (
                      <div key={i} style={{ marginBottom: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                          <span style={{ color: '#000', fontWeight: '500' }}>{item.name}</span>
                          <span style={{ color: item.color, fontWeight: '600' }}>{item.pct}%</span>
                        </div>
                        <div style={{ height: '6px', background: '#E5E5EA', borderRadius: '3px' }}>
                          <div style={{ width: `${item.pct * 2}%`, height: '100%', background: item.color, borderRadius: '3px' }} />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mock Alternative */}
                  <div style={{ background: '#FFFFFF', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#8E8E93', marginBottom: '8px' }}>RECOMMENDATION</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '28px', height: '28px', background: '#34C759', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                        </svg>
                      </div>
                      <span style={{ fontSize: '14px', color: '#000', fontWeight: '500' }}>Safe to take as directed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section style={{ padding: '80px 24px', background: '#FFFFFF' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#000', margin: '0 0 16px 0' }}>
                How SafeMed Works
              </h2>
              <p style={{ fontSize: '18px', color: '#6B7280', maxWidth: '600px', margin: '0 auto' }}>
                Three simple steps to check if a medication is safe for you
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
              {[
                { step: '1', title: 'Enter Your Profile', desc: 'Add your age, conditions, and current medications. Your data stays private on your device.', color: '#007AFF', icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' },
                { step: '2', title: 'Check a Medication', desc: 'Type a drug name or snap a photo of the pill bottle. We identify it instantly.', color: '#FF9500', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
                { step: '3', title: 'Get Your Results', desc: 'See personalized risks, warnings, and alternatives based on your unique health profile.', color: '#34C759', icon: 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z' },
              ].map((item, i) => (
                <div key={i} style={{
                  background: '#F8F9FA',
                  borderRadius: '20px',
                  padding: '32px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '64px',
                    height: '64px',
                    background: item.color,
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    boxShadow: `0 8px 24px ${item.color}40`
                  }}>
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                      <path d={item.icon}/>
                    </svg>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: item.color, marginBottom: '8px' }}>
                    STEP {item.step}
                  </div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#000', margin: '0 0 12px 0' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '15px', color: '#6B7280', lineHeight: '1.5', margin: 0 }}>
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Health Integration Section */}
        <section style={{ padding: '80px 24px', background: '#F8F9FA' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#000', margin: '0 0 16px 0' }}>
              Import Your Health Data
            </h2>
            <p style={{ fontSize: '18px', color: '#6B7280', marginBottom: '40px' }}>
              Connect with Apple Health or Health Connect to auto-fill your profile
            </p>

            <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {/* Apple Health */}
              <button
                onClick={() => handleHealthImport('apple')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 28px',
                  background: '#FFFFFF',
                  border: '2px solid #E5E5EA',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '280px'
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #FF2D55, #FF375F)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(255, 45, 85, 0.3)'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#000' }}>Apple Health</div>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>Import from iPhone</div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#C7C7CC" style={{ marginLeft: 'auto' }}>
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>

              {/* Health Connect */}
              <button
                onClick={() => handleHealthImport('android')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '20px 28px',
                  background: '#FFFFFF',
                  border: '2px solid #E5E5EA',
                  borderRadius: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  minWidth: '280px'
                }}
              >
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #4285F4, #34A853)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 12px rgba(66, 133, 244, 0.3)'
                }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '18px', fontWeight: '600', color: '#000' }}>Health Connect</div>
                  <div style={{ fontSize: '14px', color: '#6B7280' }}>Import from Android</div>
                </div>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#C7C7CC" style={{ marginLeft: 'auto' }}>
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)' }}>
          <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <h2 style={{ fontSize: '36px', fontWeight: '700', color: '#FFFFFF', margin: '0 0 16px 0' }}>
              Ready to check your medications?
            </h2>
            <p style={{ fontSize: '18px', color: 'rgba(255,255,255,0.85)', marginBottom: '32px' }}>
              It's free, private, and takes less than a minute.
            </p>
            <button
              onClick={startOnboarding}
              style={{
                padding: '18px 40px',
                background: '#FFFFFF',
                color: '#007AFF',
                border: 'none',
                borderRadius: '14px',
                fontSize: '18px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 8px 30px rgba(0,0,0,0.2)'
              }}
            >
              Get Started Free
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer style={{ padding: '40px 24px', background: '#F8F9FA', borderTop: '1px solid #E5E5EA' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                background: 'linear-gradient(135deg, #FF3B30, #FF9500)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#000' }}>SafeMed</span>
            </div>
            <p style={{ fontSize: '14px', color: '#6B7280', margin: '0 0 8px 0' }}>
              SafeMed provides guidance only. Always consult your healthcare provider before taking any medication.
            </p>
            <p style={{ fontSize: '13px', color: '#9CA3AF', margin: 0 }}>
              © 2026 SafeMed. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // App Experience (after landing)
  return (
    <div className="container-app">
      <Header onBack={handleBack} appState={appState} />

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
    </div>
  );
};

export default App;
