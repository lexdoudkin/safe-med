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
        height: '100vh',
        background: '#FFFFFF',
        overflowX: 'hidden',
        overflowY: 'auto',
        position: 'relative'
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #f5576c 75%, #4facfe 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 15s ease infinite',
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <style>{`
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.4; transform: scale(1); }
            50% { opacity: 0.6; transform: scale(1.05); }
          }
        `}</style>

        {/* Floating Orbs */}
        <div style={{
          position: 'fixed',
          top: '10%',
          left: '5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,59,48,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'fixed',
          top: '60%',
          right: '10%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,122,255,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '-3s',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'fixed',
          bottom: '20%',
          left: '15%',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(52,199,89,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 12s ease-in-out infinite',
          animationDelay: '-5s',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'fixed',
          top: '30%',
          right: '20%',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,149,0,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'pulse 6s ease-in-out infinite',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        {/* Navigation */}
        <nav style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,0,0,0.06)'
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
          background: 'linear-gradient(180deg, rgba(248,249,250,0.9) 0%, rgba(255,255,255,0.95) 100%)',
          position: 'relative',
          zIndex: 1
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

            {/* Right: App Preview - iPhone 15 Pro Frame */}
            <div style={{ flex: '1 1 400px', minWidth: '300px', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '260px',
                height: '540px',
                position: 'relative'
              }}>
                {/* Titanium Frame */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(145deg, #3a3a3c 0%, #2c2c2e 50%, #1c1c1e 100%)',
                  borderRadius: '40px',
                  boxShadow: `
                    0 0 0 1px rgba(255,255,255,0.1),
                    0 25px 50px rgba(0,0,0,0.3),
                    0 50px 100px rgba(0,0,0,0.2),
                    inset 0 1px 0 rgba(255,255,255,0.1)
                  `
                }} />

                {/* Side Buttons - Left */}
                <div style={{
                  position: 'absolute',
                  left: '-2px',
                  top: '128px',
                  width: '3px',
                  height: '22px',
                  background: 'linear-gradient(180deg, #4a4a4c, #2a2a2c)',
                  borderRadius: '2px 0 0 2px'
                }} />
                <div style={{
                  position: 'absolute',
                  left: '-2px',
                  top: '170px',
                  width: '3px',
                  height: '44px',
                  background: 'linear-gradient(180deg, #4a4a4c, #2a2a2c)',
                  borderRadius: '2px 0 0 2px'
                }} />
                <div style={{
                  position: 'absolute',
                  left: '-2px',
                  top: '228px',
                  width: '3px',
                  height: '44px',
                  background: 'linear-gradient(180deg, #4a4a4c, #2a2a2c)',
                  borderRadius: '2px 0 0 2px'
                }} />

                {/* Side Button - Right (Power) */}
                <div style={{
                  position: 'absolute',
                  right: '-2px',
                  top: '185px',
                  width: '3px',
                  height: '58px',
                  background: 'linear-gradient(180deg, #4a4a4c, #2a2a2c)',
                  borderRadius: '0 2px 2px 0'
                }} />

                {/* Screen Container */}
                <div style={{
                  position: 'absolute',
                  top: '7px',
                  left: '7px',
                  right: '7px',
                  bottom: '7px',
                  background: '#F2F2F7',
                  borderRadius: '34px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Dynamic Island */}
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90px',
                    height: '26px',
                    background: '#000',
                    borderRadius: '14px',
                    zIndex: 30,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    paddingRight: '10px'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'radial-gradient(circle at 30% 30%, #2a3a50, #0a1520)',
                      boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)'
                    }} />
                  </div>

                  {/* Status Bar */}
                  <div style={{
                    height: '42px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-between',
                    padding: '0 22px 6px',
                    flexShrink: 0
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: '600', color: '#000', letterSpacing: '-0.3px' }}>9:41</span>
                    <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
                      <svg width="14" height="10" viewBox="0 0 17 12" fill="#000">
                        <rect x="0" y="7" width="3" height="5" rx="0.5"/>
                        <rect x="4.5" y="5" width="3" height="7" rx="0.5"/>
                        <rect x="9" y="2.5" width="3" height="9.5" rx="0.5"/>
                        <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
                      </svg>
                      <svg width="13" height="10" viewBox="0 0 16 12" fill="#000">
                        <path d="M8 1C4.7 1 1.7 2.3 0 4.5l1.4 1.4C2.9 4.1 5.3 3 8 3s5.1 1.1 6.6 2.9L16 4.5C14.3 2.3 11.3 1 8 1zm0 4c-2 0-3.8.8-5.1 2.1l1.5 1.5C5.3 7.6 6.6 7 8 7s2.7.6 3.6 1.6l1.5-1.5C11.8 5.8 10 5 8 5zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                      </svg>
                      <svg width="20" height="10" viewBox="0 0 27 13" fill="#000">
                        <rect x="0.5" y="0.5" width="23" height="12" rx="3" stroke="#000" strokeWidth="1" fill="none" opacity="0.35"/>
                        <rect x="2" y="2" width="19" height="9" rx="2" fill="#000"/>
                        <path d="M25 4.5v4c1 0 2-.9 2-2s-1-2-2-2z" opacity="0.4"/>
                      </svg>
                    </div>
                  </div>

                  {/* App Content */}
                  <div style={{
                    flex: 1,
                    padding: '8px 14px 14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    overflow: 'hidden'
                  }}>
                    {/* Mock Result Card */}
                    <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#E8F5E9', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <span style={{ fontSize: '16px', fontWeight: '700', color: '#34C759' }}>85</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>Ibuprofen</div>
                          <div style={{ fontSize: '11px', color: '#34C759', fontWeight: '500' }}>Generally Safe</div>
                        </div>
                      </div>
                      <div style={{ fontSize: '11px', color: '#6B7280', lineHeight: '1.4' }}>
                        Safe for your profile with minor precautions.
                      </div>
                    </div>

                    {/* Mock Risk Bars */}
                    <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '600', color: '#8E8E93', marginBottom: '8px' }}>SIDE EFFECT RISKS</div>
                      {[
                        { name: 'Stomach upset', pct: 15, color: '#FF9500' },
                        { name: 'Heartburn', pct: 12, color: '#FF9500' },
                        { name: 'Dizziness', pct: 5, color: '#FFCC00' },
                      ].map((item, i) => (
                        <div key={i} style={{ marginBottom: '8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '3px' }}>
                            <span style={{ color: '#000', fontWeight: '500' }}>{item.name}</span>
                            <span style={{ color: item.color, fontWeight: '600' }}>{item.pct}%</span>
                          </div>
                          <div style={{ height: '5px', background: '#E5E5EA', borderRadius: '2.5px' }}>
                            <div style={{ width: `${item.pct * 2}%`, height: '100%', background: item.color, borderRadius: '2.5px' }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Mock Alternative */}
                    <div style={{ background: '#FFFFFF', borderRadius: '14px', padding: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      <div style={{ fontSize: '10px', fontWeight: '600', color: '#8E8E93', marginBottom: '6px' }}>RECOMMENDATION</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '24px', height: '24px', background: '#34C759', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                          </svg>
                        </div>
                        <span style={{ fontSize: '12px', color: '#000', fontWeight: '500' }}>Safe to take as directed</span>
                      </div>
                    </div>
                  </div>

                  {/* Home Indicator */}
                  <div style={{
                    height: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <div style={{
                      width: '100px',
                      height: '4px',
                      background: '#000',
                      borderRadius: '100px',
                      opacity: 0.15
                    }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Partner Logos Scrolling Banner */}
          <div style={{
            marginTop: '40px',
            width: '100%',
            overflow: 'hidden',
            maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)'
          }}>
            <div style={{
              display: 'flex',
              gap: '40px',
              alignItems: 'center',
              animation: 'scrollPartners 25s linear infinite',
              width: 'max-content'
            }}>
              {[...Array(2)].map((_, setIndex) => (
                <React.Fragment key={setIndex}>
                  {/* Stanford */}
                  <img src="https://identity.stanford.edu/wp-content/uploads/sites/3/2020/07/stanford-university-stacked.png" alt="Stanford" style={{ height: '40px', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.7 }} />
                  {/* Google DeepMind */}
                  <img src="/logos/Google_DeepMind_logo.png" alt="Google DeepMind" style={{ height: '36px', objectFit: 'contain' }} />
                  {/* Gemini */}
                  <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Google_Gemini_logo.svg/512px-Google_Gemini_logo.svg.png" alt="Gemini" style={{ height: '32px', objectFit: 'contain', filter: 'grayscale(100%)', opacity: 0.7 }} />
                  {/* Tunisia Ministry of Public Health */}
                  <img src="/logos/Tunisia-Ministere-De-La-Sante-Publique.png" alt="Ministère de la Santé Publique - Tunisie" style={{ height: '44px', objectFit: 'contain' }} />
                  {/* European Cancer Centers */}
                  <img src="/logos/european-cancer-centers.png" alt="European Cancer Centers" style={{ height: '40px', objectFit: 'contain' }} />
                  {/* AP-HP */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(0,51,102,0.1)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#003366' }}>AP-HP</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>Paris</span>
                  </div>
                  {/* HMPIT */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'rgba(139,0,0,0.1)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#8B0000' }}>HMPIT</span>
                    <span style={{ fontSize: '12px', color: '#666' }}>Tunis</span>
                  </div>
                  {/* Leader Santé */}
                  <div style={{ padding: '8px 16px', background: 'rgba(0,166,81,0.1)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#00A651' }}>Leader Santé</span>
                  </div>
                  {/* Aprium */}
                  <div style={{ padding: '8px 16px', background: 'rgba(227,25,55,0.1)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#E31937' }}>Aprium</span>
                  </div>
                  {/* X-FAB */}
                  <div style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.05)', borderRadius: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700', color: '#00B4D8' }}>X-FAB</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes scrollPartners {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        {/* Features Section */}
        <section style={{ padding: '80px 24px', background: 'rgba(255,255,255,0.95)', position: 'relative', zIndex: 1 }}>
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
        <section style={{ padding: '80px 24px', background: 'rgba(248,249,250,0.95)', position: 'relative', zIndex: 1 }}>
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
        <section style={{ padding: '80px 24px', background: 'linear-gradient(135deg, #007AFF 0%, #5856D6 100%)', position: 'relative', zIndex: 1 }}>
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
        <footer style={{ padding: '40px 24px', background: 'rgba(248,249,250,0.98)', borderTop: '1px solid rgba(0,0,0,0.06)', position: 'relative', zIndex: 1 }}>
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

  // App Experience (after landing) - wrapped in iPhone emulator
  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle background glow */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(50,50,60,0.5) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* iPhone 15 Pro Frame */}
      <div style={{
        width: '393px',
        height: '852px',
        maxHeight: 'calc(100vh - 40px)',
        maxWidth: 'calc(100vw - 40px)',
        position: 'relative',
        zIndex: 10
      }}>
        {/* Titanium Frame */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(145deg, #3a3a3c 0%, #2c2c2e 50%, #1c1c1e 100%)',
          borderRadius: '55px',
          boxShadow: `
            0 0 0 1px rgba(255,255,255,0.1),
            0 25px 50px rgba(0,0,0,0.5),
            0 50px 100px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,255,255,0.1)
          `
        }} />

        {/* Side Buttons - Left (Silent/Action + Volume) */}
        <div style={{
          position: 'absolute',
          left: '-2px',
          top: '180px',
          width: '3px',
          height: '30px',
          background: 'linear-gradient(180deg, #4a4a4c, #2a2a2c)',
          borderRadius: '2px 0 0 2px'
        }} />
        <div style={{
          position: 'absolute',
          left: '-2px',
          top: '240px',
          width: '3px',
          height: '60px',
          background: 'linear-gradient(180deg, #4a4a4c, #2a2a2c)',
          borderRadius: '2px 0 0 2px'
        }} />
        <div style={{
          position: 'absolute',
          left: '-2px',
          top: '320px',
          width: '3px',
          height: '60px',
          background: 'linear-gradient(180deg, #4a4a4c, #2a2a2c)',
          borderRadius: '2px 0 0 2px'
        }} />

        {/* Side Button - Right (Power) */}
        <div style={{
          position: 'absolute',
          right: '-2px',
          top: '260px',
          width: '3px',
          height: '80px',
          background: 'linear-gradient(180deg, #4a4a4c, #2a2a2c)',
          borderRadius: '0 2px 2px 0'
        }} />

        {/* Screen Container */}
        <div style={{
          position: 'absolute',
          top: '10px',
          left: '10px',
          right: '10px',
          bottom: '10px',
          background: '#F2F2F7',
          borderRadius: '47px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Dynamic Island */}
          <div style={{
            position: 'absolute',
            top: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '126px',
            height: '37px',
            background: '#000',
            borderRadius: '20px',
            zIndex: 30,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            paddingRight: '14px'
          }}>
            {/* Camera dot */}
            <div style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: 'radial-gradient(circle at 30% 30%, #2a3a50, #0a1520)',
              boxShadow: 'inset 0 0 2px rgba(255,255,255,0.2)'
            }} />
          </div>

          {/* Status Bar */}
          <div style={{
            height: '59px',
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            padding: '0 32px 8px',
            flexShrink: 0,
            background: 'transparent'
          }}>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#000', letterSpacing: '-0.3px' }}>9:41</span>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              {/* Cellular */}
              <svg width="17" height="12" viewBox="0 0 17 12" fill="#000">
                <rect x="0" y="7" width="3" height="5" rx="0.5"/>
                <rect x="4.5" y="5" width="3" height="7" rx="0.5"/>
                <rect x="9" y="2.5" width="3" height="9.5" rx="0.5"/>
                <rect x="13.5" y="0" width="3" height="12" rx="0.5"/>
              </svg>
              {/* WiFi */}
              <svg width="16" height="12" viewBox="0 0 16 12" fill="#000">
                <path d="M8 1C4.7 1 1.7 2.3 0 4.5l1.4 1.4C2.9 4.1 5.3 3 8 3s5.1 1.1 6.6 2.9L16 4.5C14.3 2.3 11.3 1 8 1zm0 4c-2 0-3.8.8-5.1 2.1l1.5 1.5C5.3 7.6 6.6 7 8 7s2.7.6 3.6 1.6l1.5-1.5C11.8 5.8 10 5 8 5zm0 4c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
              {/* Battery */}
              <svg width="27" height="13" viewBox="0 0 27 13" fill="#000">
                <rect x="0.5" y="0.5" width="23" height="12" rx="3" stroke="#000" strokeWidth="1" fill="none" opacity="0.35"/>
                <rect x="2" y="2" width="19" height="9" rx="2" fill="#000"/>
                <path d="M25 4.5v4c1 0 2-.9 2-2s-1-2-2-2z" opacity="0.4"/>
              </svg>
            </div>
          </div>

          {/* App Content */}
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <Header onBack={handleBack} appState={appState} />

            <main className="scroll-container">
              <div className="content-padding" style={{ paddingTop: '16px', paddingBottom: '32px' }}>
                {appState === AppState.PROFILE && (
                  <ProfileForm initialProfile={profile} onSave={handleProfileSave} onHealthImport={handleHealthImport} />
                )}

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

                {appState === AppState.RESULTS && result && (
                  <AnalysisResult result={result} onReset={handleReset} />
                )}
              </div>
            </main>
          </div>

          {/* Home Indicator */}
          <div style={{
            height: '34px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <div style={{
              width: '140px',
              height: '5px',
              background: '#000',
              borderRadius: '100px',
              opacity: 0.15
            }} />
          </div>
        </div>
      </div>

      {/* Back button - bottom corner */}
      <button
        onClick={() => setAppState(AppState.ONBOARDING)}
        style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          padding: '10px 16px',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: '10px',
          color: 'rgba(255,255,255,0.6)',
          fontSize: '13px',
          cursor: 'pointer',
          zIndex: 20,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backdropFilter: 'blur(10px)'
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
        </svg>
        Back
      </button>
    </div>
  );
};

export default App;
