import React, { useState, useMemo } from 'react';
import { AnalysisResult as AnalysisResultType } from '../types';

interface AnalysisResultProps {
  result: AnalysisResultType;
  onReset: () => void;
}

// Treemap layout algorithm (squarified)
interface TreemapNode {
  name: string;
  value: number;
  severity: string;
  explanation: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

const squarify = (
  items: { name: string; value: number; severity: string; explanation: string }[],
  width: number,
  height: number
): TreemapNode[] => {
  if (items.length === 0) return [];

  const total = items.reduce((sum, item) => sum + item.value, 0);
  const nodes: TreemapNode[] = [];
  let x = 0, y = 0, remainingWidth = width, remainingHeight = height;

  const getColor = (severity: string) => {
    switch (severity) {
      case 'Critical': return '#FF3B30';
      case 'High': return '#FF9500';
      case 'Medium': return '#FFCC00';
      default: return '#34C759';
    }
  };

  // Simple row-based layout
  const sorted = [...items].sort((a, b) => b.value - a.value);
  let row: typeof sorted = [];
  let rowTotal = 0;
  const rowHeight = height / Math.ceil(Math.sqrt(items.length));

  sorted.forEach((item, idx) => {
    row.push(item);
    rowTotal += item.value;

    const isLastItem = idx === sorted.length - 1;
    const rowFull = row.length >= Math.ceil(Math.sqrt(items.length));

    if (rowFull || isLastItem) {
      let rowX = x;
      row.forEach(rowItem => {
        const itemWidth = (rowItem.value / rowTotal) * remainingWidth;
        nodes.push({
          ...rowItem,
          x: rowX,
          y,
          width: Math.max(itemWidth - 2, 10),
          height: Math.max(rowHeight - 2, 10),
          color: getColor(rowItem.severity),
        });
        rowX += itemWidth;
      });
      y += rowHeight;
      row = [];
      rowTotal = 0;
    }
  });

  return nodes;
};

const Treemap: React.FC<{
  data: { name: string; value: number; severity: string; explanation: string }[];
  width: number;
  height: number;
  onSelect: (item: TreemapNode | null) => void;
  selected: TreemapNode | null;
}> = ({ data, width, height, onSelect, selected }) => {
  const nodes = useMemo(() => squarify(data, width, height), [data, width, height]);

  return (
    <svg width={width} height={height} className="rounded-xl overflow-hidden">
      {nodes.map((node, idx) => (
        <g key={idx} onClick={() => onSelect(selected?.name === node.name ? null : node)}>
          <rect
            x={node.x}
            y={node.y}
            width={node.width}
            height={node.height}
            fill={node.color}
            rx={8}
            className="treemap-cell"
            opacity={selected && selected.name !== node.name ? 0.4 : 1}
          />
          {node.width > 60 && node.height > 30 && (
            <text
              x={node.x + node.width / 2}
              y={node.y + node.height / 2}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="white"
              fontSize={Math.min(12, node.width / 8)}
              fontWeight="600"
              className="pointer-events-none"
            >
              {node.name.length > 15 ? node.name.slice(0, 12) + '...' : node.name}
            </text>
          )}
        </g>
      ))}
    </svg>
  );
};

const AnalysisResult: React.FC<AnalysisResultProps> = ({ result, onReset }) => {
  const [selectedRisk, setSelectedRisk] = useState<TreemapNode | null>(null);

  const scoreColor = result.safetyScore >= 70 ? 'text-[#34C759]' :
                     result.safetyScore >= 40 ? 'text-[#FF9500]' : 'text-[#FF3B30]';

  const scoreLabel = result.safetyScore >= 70 ? 'Low Risk' :
                     result.safetyScore >= 40 ? 'Moderate Risk' : 'High Risk';

  const scoreBg = result.safetyScore >= 70 ? 'bg-[#34C759]' :
                  result.safetyScore >= 40 ? 'bg-[#FF9500]' : 'bg-[#FF3B30]';

  // Prepare treemap data
  const treemapData = result.risks.map(risk => ({
    name: risk.condition,
    value: risk.severity === 'Critical' ? 100 :
           risk.severity === 'High' ? 70 :
           risk.severity === 'Medium' ? 40 : 20,
    severity: risk.severity,
    explanation: risk.explanation,
  }));

  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (result.safetyScore / 100) * circumference;

  return (
    <div className="animate-in space-y-4">
      {/* Header Card */}
      <div className="card p-5">
        <div className="flex items-center gap-4">
          {/* Score Ring */}
          <div className="relative w-24 h-24 flex-shrink-0">
            <svg className="w-24 h-24 ring-progress">
              <circle
                cx="48" cy="48" r="45"
                fill="none"
                stroke="#E5E5EA"
                strokeWidth="6"
              />
              <circle
                cx="48" cy="48" r="45"
                fill="none"
                stroke={result.safetyScore >= 70 ? '#34C759' : result.safetyScore >= 40 ? '#FF9500' : '#FF3B30'}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="ring-animate"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-bold ${scoreColor}`}>{result.safetyScore}</span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-black truncate">{result.drugName}</h1>
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold text-white mt-1 ${scoreBg}`}>
              {scoreLabel}
            </div>
            <p className="text-[#8E8E93] text-sm mt-2 line-clamp-2">{result.summary}</p>
          </div>
        </div>
      </div>

      {/* Treemap Card */}
      {treemapData.length > 0 && (
        <div className="card p-4">
          <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide mb-3">
            Risk Factors
          </h2>
          <Treemap
            data={treemapData}
            width={340}
            height={180}
            onSelect={setSelectedRisk}
            selected={selectedRisk}
          />

          {/* Selected Risk Detail */}
          {selectedRisk && (
            <div className="mt-3 p-3 bg-[#F2F2F7] rounded-xl animate-in">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-black">{selectedRisk.name}</span>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                  style={{ backgroundColor: selectedRisk.color }}
                >
                  {selectedRisk.severity}
                </span>
              </div>
              <p className="text-sm text-[#3C3C43]">{selectedRisk.explanation}</p>
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {result.contraindications.length > 0 && (
        <div className="card p-4 border-l-4 border-[#FF3B30]">
          <h2 className="text-sm font-semibold text-[#FF3B30] uppercase tracking-wide mb-2">
            Warnings
          </h2>
          <ul className="space-y-2">
            {result.contraindications.map((c, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[#3C3C43]">
                <span className="text-[#FF3B30] mt-0.5">•</span>
                {c}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendation */}
      <div className="card p-4">
        <h2 className="text-sm font-semibold text-[#8E8E93] uppercase tracking-wide mb-2">
          Recommendation
        </h2>
        <p className="text-[#000000]">{result.recommendation}</p>
      </div>

      {/* Action */}
      <button
        onClick={onReset}
        className="w-full py-4 bg-[#007AFF] text-white font-semibold rounded-xl active:scale-[0.98] transition-transform"
      >
        Check Another
      </button>
    </div>
  );
};

export default AnalysisResult;
