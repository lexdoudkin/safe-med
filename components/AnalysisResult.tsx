import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import {
  Warning,
  CheckCircle,
  ShieldWarning,
  ShieldCheck,
  BookOpen,
  ArrowRight,
  Pill,
  Heart,
  Heartbeat,
  Info,
  XCircle,
  CaretRight,
} from '@phosphor-icons/react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Emerald 500
    if (score >= 50) return '#f59e0b'; // Amber 500
    return '#ef4444'; // Red 500
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Safe for You';
    if (score >= 50) return 'Use with Caution';
    return 'High Risk';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return ShieldCheck;
    if (score >= 50) return Warning;
    return ShieldWarning;
  };

  const scoreData = [
    { name: 'Safe', value: result.safetyScore },
    { name: 'Risk', value: 100 - result.safetyScore }
  ];

  const scoreColor = getScoreColor(result.safetyScore);
  const ScoreIcon = getScoreIcon(result.safetyScore);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 animate-fade-in px-2">
      {/* Top Card: Score */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 md:p-10 text-center bg-gradient-to-b from-slate-50 to-white">
          {/* Drug Name */}
          <div className="flex items-center justify-center gap-3 mb-2">
            <Pill size={32} weight="duotone" className="text-slate-600" />
            <h2 className="text-2xl md:text-3xl font-bold text-slate-800">{result.drugName}</h2>
          </div>
          <p className="text-slate-500 text-base mb-8">Personalized Safety Analysis</p>

          {/* Score Gauge */}
          <div className="relative w-52 h-52 md:w-60 md:h-60 mx-auto mb-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  startAngle={180}
                  endAngle={0}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell key="safe" fill={scoreColor} />
                  <Cell key="risk" fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-10">
              <span className="text-6xl md:text-7xl font-bold" style={{ color: scoreColor }}>{result.safetyScore}</span>
              <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">Safety Score</span>
            </div>
          </div>

          {/* Score Label */}
          <div className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-lg font-bold ${
            result.safetyScore >= 80 ? 'bg-emerald-100 text-emerald-700' :
            result.safetyScore >= 50 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
          }`}>
            <ScoreIcon size={24} weight="fill" />
            {getScoreLabel(result.safetyScore)}
          </div>

          {/* Summary */}
          <p className="text-slate-600 text-lg leading-relaxed max-w-lg mx-auto mt-6">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Actionable Recommendation */}
      <div className={`p-6 rounded-2xl border-l-4 shadow-sm flex items-start gap-4 ${
        result.safetyScore > 80 ? 'bg-emerald-50 border-emerald-500' :
        result.safetyScore > 50 ? 'bg-amber-50 border-amber-500' : 'bg-red-50 border-red-500'
      }`}>
        <div className={`p-3 rounded-xl ${
          result.safetyScore > 80 ? 'bg-emerald-100' :
          result.safetyScore > 50 ? 'bg-amber-100' : 'bg-red-100'
        }`}>
          {result.safetyScore > 80 ? <CheckCircle size={32} weight="fill" className="text-emerald-600" /> :
           result.safetyScore > 50 ? <Warning size={32} weight="fill" className="text-amber-600" /> :
           <ShieldWarning size={32} weight="fill" className="text-red-600" />}
        </div>
        <div className="flex-1">
          <h3 className={`text-xl font-bold ${
            result.safetyScore > 80 ? 'text-emerald-900' :
            result.safetyScore > 50 ? 'text-amber-900' : 'text-red-900'
          }`}>What You Should Do</h3>
          <p className={`text-lg mt-2 ${
            result.safetyScore > 80 ? 'text-emerald-800' :
            result.safetyScore > 50 ? 'text-amber-800' : 'text-red-800'
          }`}>{result.recommendation}</p>
        </div>
      </div>

      {/* Contraindications */}
      {result.contraindications.length > 0 && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-red-100">
          <h3 className="text-xl font-bold text-red-700 flex items-center gap-3 mb-5">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle size={28} weight="fill" className="text-red-600" />
            </div>
            Important Warnings
          </h3>
          <ul className="space-y-3">
            {result.contraindications.map((c, i) => (
              <li key={i} className="flex items-start gap-4 p-4 bg-red-50/50 rounded-xl">
                <Warning size={24} weight="fill" className="text-red-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 text-base">{c}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Specific Risks */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-800 flex items-center gap-3 px-2">
          <Heartbeat size={28} weight="duotone" className="text-slate-600" />
          Effects Based on Your Profile
        </h3>
        {result.risks.map((risk, idx) => (
          <div key={idx} className="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-bold text-lg text-slate-800">{risk.condition}</h4>
              <span className={`px-3 py-1.5 rounded-full text-sm font-bold ${
                risk.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                risk.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                'bg-slate-100 text-slate-600'
              }`}>
                {risk.severity} Risk
              </span>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-3 flex-1 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    risk.severity === 'Critical' ? 'bg-red-500' :
                    risk.severity === 'High' ? 'bg-orange-500' :
                    risk.severity === 'Medium' ? 'bg-yellow-500' :
                    'bg-emerald-500'
                  }`}
                  style={{
                    width: risk.severity === 'Critical' ? '90%' :
                           risk.severity === 'High' ? '70%' :
                           risk.severity === 'Medium' ? '40%' : '15%'
                  }}
                />
              </div>
              <span className="text-base font-semibold text-slate-600 min-w-[60px] text-right">{risk.probability}</span>
            </div>
            <p className="text-base text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
              {risk.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* References */}
      <div className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-700 flex items-center gap-3 mb-4 text-base">
          <BookOpen size={24} weight="duotone" className="text-slate-500" />
          Scientific References
        </h3>
        <ul className="text-sm text-slate-500 space-y-2">
          {result.references.map((ref, i) => (
            <li key={i} className="flex items-start gap-2">
              <CaretRight size={16} weight="bold" className="mt-0.5 flex-shrink-0" />
              <span className="break-words">{ref}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Check Another Drug Button */}
      <button
        onClick={onReset}
        className="w-full bg-slate-800 hover:bg-slate-700 active:bg-slate-900 text-white font-bold py-5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 text-xl"
      >
        <Pill size={28} weight="duotone" />
        Check Another Medicine
      </button>
    </div>
  );
};

export default AnalysisResult;
