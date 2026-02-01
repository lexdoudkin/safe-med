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
  const verdictBg = isDanger ? 'rgba(255,59,48,0.12)' : isCaution ? 'rgba(255,149,0,0.12)' : 'rgba(52,199,89,0.12)';

  const circumference = 2 * Math.PI * 36;
  const strokeDashoffset = circumference - (result.safetyScore / 100) * circumference;

  const getRiskColor = (probability: string) => {
    const value = parseFloat(probability);
    if (value >= 15) return '#FF3B30';
    if (value >= 8) return '#FF9500';
    if (value >= 3) return '#FFCC00';
    return '#34C759';
  };

  const actionButtonStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '10px 16px',
    background: '#F5F5F7',
    border: 'none',
    borderRadius: '10px',
    fontSize: '14px',
    fontWeight: '600' as const,
    color: '#007AFF',
    cursor: 'pointer',
    flex: 1
  };

  return (
    <div className="animate-in" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

      {/* MAIN VERDICT CARD */}
      <div className="card" style={{ padding: '20px', textAlign: 'center' }}>
        {/* Drug Name */}
        <div style={{ marginBottom: '16px' }}>
          <div style={{
            fontSize: '12px',
            fontWeight: '600',
            color: '#8E8E93',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            marginBottom: '4px'
          }}>
            {result.drugName || 'Medication'}
          </div>
        </div>

        {/* Score Ring */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
          <div style={{ position: 'relative', width: '100px', height: '100px' }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="36" fill="none" stroke="#E5E5EA" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="36"
                fill="none"
                stroke={verdictColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 1s ease-out' }}
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
              <span style={{ fontSize: '32px', fontWeight: '700', color: '#000' }}>
                {result.safetyScore}
              </span>
            </div>
          </div>
        </div>

        {/* Verdict Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 20px',
          background: verdictBg,
          borderRadius: '24px',
          marginBottom: '12px'
        }}>
          {isDanger ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={verdictColor}>
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
            </svg>
          ) : isCaution ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={verdictColor}>
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={verdictColor}>
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          )}
          <span style={{ fontSize: '17px', fontWeight: '700', color: verdictColor }}>
            {verdictText}
          </span>
        </div>

        {/* Summary */}
        <p style={{ fontSize: '14px', color: '#6B7280', lineHeight: 1.5, margin: '0 0 16px 0' }}>
          {result.summary}
        </p>

        {/* Quick Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={actionButtonStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#007AFF">
              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
            </svg>
            Share
          </button>
          <button style={actionButtonStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#007AFF">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
            </svg>
            Save
          </button>
          <button style={actionButtonStyle}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#007AFF">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/>
            </svg>
            Ask Doctor
          </button>
        </div>
      </div>

      {/* PRIMARY ACTION CARD */}
      {isDanger && (
        <div style={{
          background: 'linear-gradient(135deg, #FF3B30, #FF6B6B)',
          borderRadius: '16px',
          padding: '16px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>Stop - Do Not Take</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>This medication is not safe for you</div>
            </div>
          </div>
          <button style={{
            width: '100%',
            padding: '12px',
            background: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#FF3B30',
            cursor: 'pointer'
          }}>
            Find Safe Alternatives
          </button>
        </div>
      )}

      {isCaution && (
        <div style={{
          background: 'linear-gradient(135deg, #FF9500, #FFAC33)',
          borderRadius: '16px',
          padding: '16px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>Proceed With Caution</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Review the warnings below carefully</div>
            </div>
          </div>
          <button style={{
            width: '100%',
            padding: '12px',
            background: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#FF9500',
            cursor: 'pointer'
          }}>
            Consult Your Doctor First
          </button>
        </div>
      )}

      {isSafe && (
        <div style={{
          background: 'linear-gradient(135deg, #34C759, #5DD879)',
          borderRadius: '16px',
          padding: '16px',
          color: 'white'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '700' }}>Safe to Take</div>
              <div style={{ fontSize: '13px', opacity: 0.9 }}>Follow the recommended dosage</div>
            </div>
          </div>
          <button style={{
            width: '100%',
            padding: '12px',
            background: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '15px',
            fontWeight: '600',
            color: '#34C759',
            cursor: 'pointer'
          }}>
            Set Medication Reminder
          </button>
        </div>
      )}

      {/* CRITICAL WARNINGS */}
      {result.contraindications.length > 0 && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: '#FF3B30',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-2h2v2h-2zm0-4V7h2v6h-2z"/>
                </svg>
              </div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#000' }}>
                Critical Warnings ({result.contraindications.length})
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.contraindications.map((warning, idx) => (
              <div key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: 'rgba(255,59,48,0.08)',
                borderRadius: '10px'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#FF3B30" style={{ flexShrink: 0 }}>
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#000', flex: 1 }}>
                  {warning}
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#8E8E93">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIDE EFFECT RISKS */}
      {result.risks.length > 0 && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #5AC8FA, #007AFF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/>
                </svg>
              </div>
              <span style={{ fontSize: '15px', fontWeight: '600', color: '#000' }}>
                Side Effect Risks
              </span>
            </div>
            <span style={{ fontSize: '13px', color: '#8E8E93' }}>Tap for details</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {result.risks.map((risk, idx) => {
              const probability = parseFloat(risk.probability) || 5;
              const color = getRiskColor(risk.probability);
              return (
                <div key={idx} style={{
                  padding: '12px',
                  background: '#F8F8FA',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#000' }}>
                      {risk.condition}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{
                        fontSize: '13px',
                        fontWeight: '700',
                        color: color,
                        background: `${color}18`,
                        padding: '3px 10px',
                        borderRadius: '12px'
                      }}>
                        {risk.probability}
                      </span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="#C7C7CC">
                        <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{
                    height: '6px',
                    background: '#E5E5EA',
                    borderRadius: '3px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${Math.min(probability * 3, 100)}%`,
                      height: '100%',
                      background: color,
                      borderRadius: '3px',
                      transition: 'width 0.5s ease-out'
                    }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SAFER ALTERNATIVES */}
      {result.alternatives && result.alternatives.length > 0 && (
        <div className="card" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '8px',
              background: '#34C759',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1v-1H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/>
              </svg>
            </div>
            <span style={{ fontSize: '15px', fontWeight: '600', color: '#000' }}>
              Safer Alternatives
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {result.alternatives.map((alt, idx) => (
              <button key={idx} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px',
                background: 'rgba(52,199,89,0.08)',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                width: '100%',
                textAlign: 'left'
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#34C759">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
                <span style={{ fontSize: '14px', fontWeight: '500', color: '#000', flex: 1 }}>
                  {alt}
                </span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: '#34C759' }}>
                  Check
                </span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#34C759">
                  <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                </svg>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* RECOMMENDATION */}
      <div className="card" style={{ padding: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: '#007AFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '600', color: '#000' }}>
            Doctor's Recommendation
          </span>
        </div>
        <p style={{ fontSize: '14px', color: '#3C3C43', lineHeight: 1.5, margin: 0 }}>
          {result.recommendation}
        </p>
      </div>

      {/* CHECK ANOTHER */}
      <button
        className="btn-primary"
        onClick={onReset}
        style={{ marginTop: '4px' }}
      >
        Check Another Medication
      </button>

      {/* DISCLAIMER */}
      <p style={{
        fontSize: '11px',
        color: '#8E8E93',
        textAlign: 'center',
        lineHeight: 1.4,
        margin: '0 0 8px 0'
      }}>
        For informational purposes only. Always consult your healthcare provider.
      </p>
    </div>
  );
};

export default AnalysisResult;
