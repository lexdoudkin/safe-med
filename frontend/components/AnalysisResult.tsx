import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import {
  Warning,
  CheckCircle,
  ShieldWarning,
  ShieldCheck,
  BookOpen,
  Pill,
  XCircle,
  CaretRight,
  Stethoscope,
  SealCheck,
  SealWarning,
  Prohibit,
  ThumbsUp,
  ThumbsDown,
} from '@phosphor-icons/react';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const getScoreConfig = (score: number) => {
    if (score >= 80) return {
      bg: 'bg-teal',
      light: 'bg-teal-light',
      text: 'text-teal',
      border: 'border-teal',
      label: 'Safe for you',
      Icon: SealCheck,
      ThumbIcon: ThumbsUp
    };
    if (score >= 50) return {
      bg: 'bg-gold',
      light: 'bg-gold-light',
      text: 'text-gold',
      border: 'border-gold',
      label: 'Use with caution',
      Icon: SealWarning,
      ThumbIcon: Warning
    };
    return {
      bg: 'bg-coral',
      light: 'bg-coral-light',
      text: 'text-coral',
      border: 'border-coral',
      label: 'Not recommended',
      Icon: Prohibit,
      ThumbIcon: ThumbsDown
    };
  };

  const config = getScoreConfig(result.safetyScore);
  const ScoreIcon = config.Icon;

  const getSeverityConfig = (severity: string) => {
    switch(severity) {
      case 'Critical':
        return { bg: 'bg-coral', light: 'bg-coral-light', text: 'text-coral', Icon: XCircle, iconColor: 'text-coral' };
      case 'High':
        return { bg: 'bg-coral/80', light: 'bg-coral-light/70', text: 'text-coral', Icon: Warning, iconColor: 'text-coral' };
      case 'Medium':
        return { bg: 'bg-gold', light: 'bg-gold-light', text: 'text-gold', Icon: Warning, iconColor: 'text-gold' };
      default:
        return { bg: 'bg-sage', light: 'bg-sage-light', text: 'text-sage', Icon: CheckCircle, iconColor: 'text-sage' };
    }
  };

  return (
    <div className="space-y-4 pb-4 animate-fade-in-up">
      {/* Compact Score Header */}
      <div className={`card-organic p-4 ${config.light} border ${config.border}`}>
        <div className="flex items-center gap-4">
          {/* Score Circle */}
          <div className={`w-20 h-20 ${config.bg} rounded-full flex flex-col items-center justify-center text-white shadow-lg flex-shrink-0`}>
            <span className="text-3xl font-bold font-display">{result.safetyScore}</span>
            <span className="text-xs opacity-80">/ 100</span>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Pill size={20} weight="duotone" className={config.text} />
              <h2 className="font-display text-xl font-bold text-navy truncate">{result.drugName}</h2>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${config.light} ${config.text}`}>
              <ScoreIcon size={18} weight="fill" />
              {config.label}
            </div>
            <p className="text-navy/60 text-sm mt-2 line-clamp-2">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`card-organic p-4 border-l-4 ${config.border} bg-white`}>
        <div className="flex gap-3">
          <Stethoscope size={24} weight="duotone" className={config.text} />
          <div>
            <h3 className="font-semibold text-navy text-sm mb-1">Recommendation</h3>
            <p className="text-navy/70 text-sm">{result.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Contraindications (if any) */}
      {result.contraindications.length > 0 && (
        <div className="card-organic p-4 bg-coral-light/50 border border-coral/20">
          <h3 className="font-semibold text-coral flex items-center gap-2 mb-2 text-sm">
            <Prohibit size={20} weight="fill" />
            Important Warnings
          </h3>
          <ul className="space-y-2">
            {result.contraindications.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <XCircle size={16} weight="fill" className="text-coral flex-shrink-0 mt-0.5" />
                <span className="text-navy/80">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Risk Factors - Compact List */}
      <div className="card-organic p-4">
        <h3 className="font-semibold text-navy flex items-center gap-2 mb-3 text-sm">
          <ShieldWarning size={20} weight="duotone" className="text-coral" />
          Based on Your Health Profile
        </h3>

        <div className="space-y-2">
          {result.risks.map((risk, idx) => {
            const sevConfig = getSeverityConfig(risk.severity);
            const SevIcon = sevConfig.Icon;

            return (
              <details key={idx} className="group">
                <summary className="flex items-center gap-3 p-3 bg-cream rounded-xl cursor-pointer hover:bg-cream-dark transition-colors list-none">
                  <SevIcon size={22} weight="fill" className={sevConfig.iconColor} />
                  <span className="flex-1 font-medium text-navy text-sm">{risk.condition}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${sevConfig.light} ${sevConfig.text}`}>
                    {risk.severity}
                  </span>
                  <CaretRight size={16} className="text-navy/40 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="mt-2 ml-9 mr-3 p-3 bg-white rounded-lg text-sm text-navy/70 border border-cream-dark">
                  <div className="flex items-center gap-2 text-xs text-navy/50 mb-1">
                    <span>Risk: {risk.probability}</span>
                  </div>
                  {risk.explanation}
                </div>
              </details>
            );
          })}
        </div>
      </div>

      {/* References - Collapsed */}
      <details className="card-organic p-3 group">
        <summary className="flex items-center justify-between cursor-pointer list-none">
          <div className="flex items-center gap-2 text-navy/50 text-sm">
            <BookOpen size={18} weight="duotone" />
            <span className="font-medium">{result.references.length} Scientific References</span>
          </div>
          <CaretRight size={16} className="text-navy/40 group-open:rotate-90 transition-transform" />
        </summary>
        <ul className="mt-3 space-y-1 text-xs text-navy/50">
          {result.references.map((ref, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-navy/30">{i + 1}.</span>
              <span>{ref}</span>
            </li>
          ))}
        </ul>
      </details>

      {/* Check Another Button */}
      <button
        onClick={onReset}
        className="w-full py-4 bg-navy hover:bg-navy/80 text-white font-semibold text-lg rounded-full shadow-lg transition-all flex items-center justify-center gap-2"
      >
        <Pill size={22} weight="duotone" />
        Check another medicine
      </button>
    </div>
  );
};

export default AnalysisResult;
