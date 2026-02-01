import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import {
  Warning,
  CheckCircle,
  ShieldWarning,
  ShieldCheck,
  BookOpen,
  Pill,
  Heartbeat,
  XCircle,
  CaretRight,
  HandHeart,
  Info,
  Stethoscope,
} from '@phosphor-icons/react';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return { bg: 'bg-teal', light: 'bg-teal-light', text: 'text-teal', border: 'border-teal' };
    if (score >= 50) return { bg: 'bg-gold', light: 'bg-gold-light', text: 'text-gold', border: 'border-gold' };
    return { bg: 'bg-coral', light: 'bg-coral-light', text: 'text-coral', border: 'border-coral' };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Looking good!';
    if (score >= 50) return 'Some caution needed';
    return 'Talk to your doctor';
  };

  const colors = getScoreColor(result.safetyScore);

  // SVG arc for score
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (result.safetyScore / 100) * circumference * 0.5;

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-fade-in-up">
      {/* Score Card */}
      <div className="card-organic shadow-lifted overflow-hidden">
        <div className="p-8 md:p-10 text-center bg-gradient-to-b from-white to-cream">
          {/* Drug Name */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className={`p-2 ${colors.light} rounded-xl`}>
              <Pill size={28} weight="duotone" className={colors.text} />
            </div>
            <h2 className="font-display text-2xl md:text-3xl font-bold text-navy">{result.drugName}</h2>
          </div>

          {/* Score Ring */}
          <div className="relative w-52 h-32 mx-auto mb-6">
            <svg className="w-full h-full" viewBox="0 0 180 100">
              {/* Background arc */}
              <path
                d="M 10 90 A 70 70 0 0 1 170 90"
                fill="none"
                stroke="#F5EDE6"
                strokeWidth="12"
                strokeLinecap="round"
              />
              {/* Score arc */}
              <path
                d="M 10 90 A 70 70 0 0 1 170 90"
                fill="none"
                stroke={result.safetyScore >= 80 ? '#1A5F5A' : result.safetyScore >= 50 ? '#D4A853' : '#FF6B5B'}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${(result.safetyScore / 100) * 220} 220`}
                className="score-ring"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
              <span className={`text-6xl font-bold font-display ${colors.text}`}>{result.safetyScore}</span>
            </div>
          </div>

          {/* Score Label */}
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-lg font-semibold ${colors.light} ${colors.text}`}>
            {result.safetyScore >= 80 ? <ShieldCheck size={24} weight="fill" /> :
             result.safetyScore >= 50 ? <Warning size={24} weight="fill" /> :
             <ShieldWarning size={24} weight="fill" />}
            {getScoreLabel(result.safetyScore)}
          </div>

          {/* Summary */}
          <p className="text-navy/70 text-lg leading-relaxed max-w-md mx-auto mt-6">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Recommendation Card */}
      <div className={`card-organic p-6 border-l-4 ${colors.border} ${colors.light}`}>
        <div className="flex gap-4">
          <div className={`p-3 ${colors.bg} rounded-xl self-start`}>
            {result.safetyScore >= 80 ? <HandHeart size={28} weight="fill" className="text-white" /> :
             result.safetyScore >= 50 ? <Info size={28} weight="fill" className="text-white" /> :
             <Stethoscope size={28} weight="fill" className="text-white" />}
          </div>
          <div>
            <h3 className="font-display text-xl font-bold text-navy mb-2">Our advice for you</h3>
            <p className="text-navy/70 text-lg">{result.recommendation}</p>
          </div>
        </div>
      </div>

      {/* Warnings */}
      {result.contraindications.length > 0 && (
        <div className="card-organic p-6 border border-coral/20 bg-coral-light/30">
          <h3 className="font-display text-xl font-bold text-coral flex items-center gap-3 mb-4">
            <XCircle size={26} weight="fill" />
            Important to know
          </h3>
          <ul className="space-y-3">
            {result.contraindications.map((c, i) => (
              <li key={i} className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                <Warning size={22} weight="fill" className="text-coral flex-shrink-0 mt-0.5" />
                <span className="text-navy/80">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Individual Effects */}
      <div className="space-y-4">
        <h3 className="font-display text-xl font-bold text-navy flex items-center gap-3 px-1">
          <Heartbeat size={26} weight="duotone" className="text-coral" />
          Based on your health profile
        </h3>

        {result.risks.map((risk, idx) => {
          const severityColors = {
            Critical: { bg: 'bg-coral', light: 'bg-coral-light', text: 'text-coral' },
            High: { bg: 'bg-coral', light: 'bg-coral-light/70', text: 'text-coral' },
            Medium: { bg: 'bg-gold', light: 'bg-gold-light', text: 'text-gold' },
            Low: { bg: 'bg-sage', light: 'bg-sage-light', text: 'text-sage' },
          }[risk.severity] || { bg: 'bg-sage', light: 'bg-sage-light', text: 'text-sage' };

          const widthPercent = risk.severity === 'Critical' ? '90%' :
                              risk.severity === 'High' ? '70%' :
                              risk.severity === 'Medium' ? '45%' : '20%';

          return (
            <div key={idx} className="card-organic p-5 shadow-soft hover:shadow-lifted transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <h4 className="font-semibold text-lg text-navy">{risk.condition}</h4>
                <span className={`chip px-3 py-1 text-sm font-bold ${severityColors.light} ${severityColors.text}`}>
                  {risk.severity}
                </span>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-2.5 flex-1 bg-cream-dark rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${severityColors.bg} transition-all`}
                    style={{ width: widthPercent }}
                  />
                </div>
                <span className="text-sm font-semibold text-navy/50 min-w-[50px] text-right">{risk.probability}</span>
              </div>

              <p className="text-navy/60 bg-cream p-4 rounded-xl">{risk.explanation}</p>
            </div>
          );
        })}
      </div>

      {/* References */}
      <details className="card-organic p-5 group">
        <summary className="flex items-center justify-between cursor-pointer list-none">
          <div className="flex items-center gap-3 text-navy/60">
            <BookOpen size={22} weight="duotone" />
            <span className="font-medium">Scientific references</span>
          </div>
          <CaretRight size={20} className="text-navy/40 group-open:rotate-90 transition-transform" />
        </summary>
        <ul className="mt-4 space-y-2 text-sm text-navy/50">
          {result.references.map((ref, i) => (
            <li key={i} className="flex items-start gap-2">
              <span className="text-navy/30">•</span>
              <span>{ref}</span>
            </li>
          ))}
        </ul>
      </details>

      {/* Check Another */}
      <button
        onClick={onReset}
        className="w-full py-5 bg-navy hover:bg-navy/80 text-white font-semibold text-xl rounded-full shadow-lg transition-all flex items-center justify-center gap-3"
      >
        <Pill size={26} weight="duotone" />
        Check another medicine
      </button>
    </div>
  );
};

export default AnalysisResult;
