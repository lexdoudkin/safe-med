import React from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';
import { AlertTriangle, CheckCircle, ShieldAlert, BookOpen, AlertCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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

  const scoreData = [
    { name: 'Safe', value: result.safetyScore },
    { name: 'Risk', value: 100 - result.safetyScore }
  ];

  const scoreColor = getScoreColor(result.safetyScore);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in">
      {/* Top Card: Score */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        <div className="p-8 text-center bg-gradient-to-b from-slate-50 to-white">
          <h2 className="text-2xl font-bold text-slate-800 mb-1">{result.drugName}</h2>
          <p className="text-slate-500 text-sm mb-6">Personalized Impact Analysis</p>
          
          <div className="relative w-48 h-48 mx-auto mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={scoreData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
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
            <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
              <span className="text-5xl font-bold" style={{ color: scoreColor }}>{result.safetyScore}</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Safety Score</span>
            </div>
          </div>
          
          <p className="text-slate-600 leading-relaxed max-w-lg mx-auto">
            {result.summary}
          </p>
        </div>
      </div>

      {/* Actionable Recommendation */}
      <div className={`p-5 rounded-2xl border-l-4 shadow-sm flex items-start gap-4 ${
          result.safetyScore > 80 ? 'bg-emerald-50 border-emerald-500' :
          result.safetyScore > 50 ? 'bg-amber-50 border-amber-500' : 'bg-red-50 border-red-500'
      }`}>
        <div className="mt-1">
            {result.safetyScore > 80 ? <CheckCircle className="text-emerald-600 w-6 h-6" /> :
             result.safetyScore > 50 ? <AlertTriangle className="text-amber-600 w-6 h-6" /> :
             <ShieldAlert className="text-red-600 w-6 h-6" />}
        </div>
        <div>
            <h3 className={`font-bold ${
                 result.safetyScore > 80 ? 'text-emerald-900' :
                 result.safetyScore > 50 ? 'text-amber-900' : 'text-red-900'
            }`}>Recommendation</h3>
            <p className={`text-sm mt-1 ${
                 result.safetyScore > 80 ? 'text-emerald-800' :
                 result.safetyScore > 50 ? 'text-amber-800' : 'text-red-800'
            }`}>{result.recommendation}</p>
        </div>
      </div>

      {/* Contraindications */}
      {result.contraindications.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100">
            <h3 className="font-bold text-red-600 flex items-center gap-2 mb-4">
                <ShieldAlert className="w-5 h-5" />
                Contraindications
            </h3>
            <ul className="space-y-2">
                {result.contraindications.map((c, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-red-50/50 rounded-lg">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 flex-shrink-0" />
                        <span className="text-slate-700 text-sm">{c}</span>
                    </li>
                ))}
            </ul>
          </div>
      )}

      {/* Specific Risks */}
      <div className="space-y-4">
        <h3 className="font-bold text-slate-800 text-lg px-2">Individual Effects</h3>
        {result.risks.map((risk, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
            <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-slate-800">{risk.condition}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    risk.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                    risk.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                    risk.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-slate-100 text-slate-600'
                }`}>
                    {risk.severity} Risk
                </span>
            </div>
            <div className="flex items-center gap-2 mb-3">
                <div className="h-1.5 flex-1 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                        className={`h-full rounded-full ${
                             risk.severity === 'Critical' ? 'bg-red-500 w-[90%]' :
                             risk.severity === 'High' ? 'bg-orange-500 w-[70%]' :
                             risk.severity === 'Medium' ? 'bg-yellow-500 w-[40%]' :
                             'bg-emerald-500 w-[15%]'
                        }`} 
                    />
                </div>
                <span className="text-xs font-mono text-slate-500">{risk.probability}</span>
            </div>
            <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-100">
                {risk.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* References */}
      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
        <h3 className="font-bold text-slate-600 flex items-center gap-2 mb-3 text-sm">
            <BookOpen className="w-4 h-4" />
            Scientific References
        </h3>
        <ul className="text-xs text-slate-500 space-y-1">
            {result.references.map((ref, i) => (
                <li key={i} className="truncate">• {ref}</li>
            ))}
        </ul>
      </div>

      <button 
        onClick={onReset}
        className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-700 transition-all"
      >
        Analyze Another Drug
      </button>
    </div>
  );
};

export default AnalysisResult;
