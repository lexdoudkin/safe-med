import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const isDanger = result.safetyScore < 40;
  const isCaution = result.safetyScore >= 40 && result.safetyScore < 70;
  const isSafe = result.safetyScore >= 70;

  const verdictText = isDanger ? 'Do Not Take' : isCaution ? 'Use Caution' : 'Generally Safe';
  const verdictColor = isDanger ? '#FF3B30' : isCaution ? '#FF9500' : '#34C759';

  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (result.safetyScore / 100) * circumference;

  // Get color for risk percentage
  const getRiskColor = (probability: string) => {
    const value = parseFloat(probability);
    if (value >= 15) return '#FF9500';
    if (value >= 10) return '#FF9500';
    if (value >= 5) return '#FFCC00';
    return '#34C759';
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* YOUR RISK ASSESSMENT */}
      <div className="card">
        <div className="section-header">
          <div className="section-icon" style={{ background: 'linear-gradient(135deg, #5856D6, #AF52DE)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M3 3v18h18V3H3zm16 16H5V5h14v14zM7 7h2v10H7V7zm4 4h2v6h-2v-6zm4-2h2v8h-2V9z"/>
            </svg>
          </div>
          <span className="section-title">Your Risk Assessment</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Score Ring */}
          <div style={{ position: 'relative', width: '88px', height: '88px', flexShrink: 0 }}>
            <svg width="88" height="88" className="ring-progress">
              <circle cx="44" cy="44" r="40" fill="none" stroke="#3A3A3C" strokeWidth="6" />
              <circle
                cx="44" cy="44" r="40"
                fill="none"
                stroke={verdictColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="ring-animate"
              />
            </svg>
            <div style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <span style={{ fontSize: '28px', fontWeight: '700', color: verdictColor }}>{result.safetyScore}</span>
              <span style={{ fontSize: '11px', color: '#8E8E93' }}>of 100</span>
            </div>
          </div>

          {/* Verdict Text */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: verdictColor, margin: 0 }}>
              {verdictText}
            </h2>
            <p style={{ fontSize: '14px', color: '#8E8E93', margin: '4px 0 0 0', lineHeight: 1.4 }}>
              Based on your age, medications, and health history
            </p>
          </div>
        </div>

        {/* Verdict Banner */}
        <div className={`verdict-banner ${isDanger ? 'danger' : isCaution ? 'caution' : 'safe'}`}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: verdictColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {isDanger ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            ) : isCaution ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 2L1 21h22L12 2zm0 3.99L19.53 19H4.47L12 5.99zM11 10v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            )}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '17px', fontWeight: '600', color: '#FFFFFF' }}>{verdictText}</div>
            <div style={{ fontSize: '14px', color: '#8E8E93' }}>
              {isDanger ? 'Contraindicated for your profile' : isCaution ? 'Review warnings before use' : 'Safe for your profile'}
            </div>
          </div>
        </div>

        {/* Personalized Info */}
        <div className="personalized-banner">
          <span style={{ fontSize: '14px' }}>
            <strong style={{ color: '#FF9500' }}>Personalized for you:</strong>
            <span style={{ color: '#8E8E93', marginLeft: '6px' }}>{result.summary}</span>
          </span>
        </div>
      </div>

      {/* CRITICAL WARNINGS */}
      {result.contraindications.length > 0 && (
        <div className="card">
          <div className="section-header">
            <div className="section-icon" style={{ background: '#FF3B30' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-2h-2v2zm0-4h2V7h-2v6z"/>
              </svg>
            </div>
            <span className="section-title">Critical Warnings</span>
          </div>

          {result.contraindications.map((warning, idx) => (
            <div key={idx} className="list-item">
              <div className="list-icon" style={{ background: 'rgba(255, 59, 48, 0.15)' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#FF3B30">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                </svg>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>{warning}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* YOUR SIDE EFFECT RISKS */}
      {result.risks.length > 0 && (
        <div className="card">
          <div className="section-header">
            <div className="section-icon" style={{ background: 'linear-gradient(135deg, #5AC8FA, #007AFF)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM7 10h2v7H7zm4-3h2v10h-2zm4 6h2v4h-2z"/>
              </svg>
            </div>
            <span className="section-title">Your Side Effect Risks</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result.risks.map((risk, idx) => {
              const probability = parseFloat(risk.probability) || 5;
              const color = getRiskColor(risk.probability);
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: '#FFFFFF' }}>{risk.condition}</span>
                    <span style={{ fontSize: '15px', fontWeight: '600', color: color }}>{risk.probability}</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${Math.min(probability * 2, 100)}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ALTERNATIVES TO CONSIDER */}
      {result.alternatives && result.alternatives.length > 0 && (
        <div className="card">
          <div className="section-header">
            <div className="section-icon" style={{ background: '#34C759' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
              </svg>
            </div>
            <span className="section-title">Alternatives to Consider</span>
          </div>

          {result.alternatives.map((alt, idx) => (
            <div key={idx} className="list-item">
              <div className="list-icon" style={{ background: '#34C759' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              </div>
              <span style={{ fontSize: '16px', fontWeight: '600', color: '#FFFFFF' }}>{alt}</span>
            </div>
          ))}
        </div>
      )}

      {/* RECOMMENDATION */}
      <div className="card">
        <div className="section-header">
          <div className="section-icon" style={{ background: '#007AFF' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <span className="section-title">Recommendation</span>
        </div>
        <p style={{ fontSize: '15px', color: '#EBEBF5', lineHeight: 1.5, margin: 0 }}>
          {result.recommendation}
        </p>
      </div>

      {/* CHECK ANOTHER */}
      <button className="btn-primary" onClick={onReset}>
        Check Another Medication
      </button>

      {/* DISCLAIMER */}
      <div className="disclaimer">
        For informational purposes only.<br />
        Always consult your healthcare provider.
      </div>
    </div>
  );
};

export default AnalysisResult;
