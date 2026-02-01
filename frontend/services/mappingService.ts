/**
 * Mapping Service
 * Converts between frontend and backend data types.
 */

import { UserProfile, AnalysisResult, RiskFactor } from '../types';
import { BackendUserProfile, BackendRiskAssessment } from './backendService';

/**
 * Map frontend UserProfile to backend format.
 */
export const mapUserProfileToBackend = (profile: UserProfile): BackendUserProfile => {
  const conditionsLower = profile.conditions.map(c => c.toLowerCase());

  return {
    age: profile.age,
    sex: profile.gender === 'Male' ? 'male' : profile.gender === 'Female' ? 'female' : 'unknown',
    weight_kg: profile.weight || undefined,
    pregnant: conditionsLower.some(c => c.includes('pregnan')),
    pregnancy_trimester: undefined,
    breastfeeding: conditionsLower.some(c => c.includes('breastfeed') || c.includes('lactation')),
    conditions: profile.conditions,
    current_medications: [],
    allergies: conditionsLower.filter(c => c.includes('allerg')),
    smoker: false,
    alcohol_use: 'none',
    egfr: undefined,
    potassium: undefined,
    heart_rate: undefined,
    history_gi_bleed: conditionsLower.some(c => c.includes('gi bleed') || c.includes('ulcer')),
    history_mi: conditionsLower.some(c => c.includes('heart') || c.includes('mi') || c.includes('infarction')),
    history_stroke: conditionsLower.some(c => c.includes('stroke')),
    history_arrhythmia: conditionsLower.some(c => c.includes('arrhythmia') || c.includes('afib') || c.includes('atrial')),
    history_seizures: conditionsLower.some(c => c.includes('seizure') || c.includes('epilep')),
  };
};

/**
 * Map severity multiplier to frontend severity level.
 */
const mapMultiplierToSeverity = (multiplier: number): 'Low' | 'Medium' | 'High' | 'Critical' => {
  if (multiplier >= 3.0) return 'Critical';
  if (multiplier >= 2.0) return 'High';
  if (multiplier >= 1.5) return 'Medium';
  return 'Low';
};

/**
 * Map backend risk level to frontend severity.
 */
const mapRiskLevelToSeverity = (level: string): 'Low' | 'Medium' | 'High' | 'Critical' => {
  switch (level) {
    case 'contraindicated':
    case 'danger':
      return 'Critical';
    case 'warning':
      return 'High';
    case 'caution':
      return 'Medium';
    default:
      return 'Low';
  }
};

/**
 * Generate a human-readable summary from backend assessment.
 */
const generateSummary = (assessment: BackendRiskAssessment): string => {
  const riskLevelText: Record<string, string> = {
    safe: 'appears safe for your profile',
    caution: 'may be used with some caution',
    warning: 'has notable concerns for your health profile',
    danger: 'poses significant risks given your health profile',
    contraindicated: 'is not recommended for you',
  };

  let summary = `${assessment.drug_name} ${riskLevelText[assessment.overall_risk_level] || 'requires evaluation'}. `;

  if (assessment.hard_stops.length > 0) {
    summary += `There ${assessment.hard_stops.length === 1 ? 'is' : 'are'} ${assessment.hard_stops.length} contraindication(s) to be aware of. `;
  } else if (assessment.warnings.length > 0) {
    summary += `There ${assessment.warnings.length === 1 ? 'is' : 'are'} ${assessment.warnings.length} warning(s) to consider. `;
  } else if (assessment.cautions.length > 0) {
    summary += `Minor precautions apply based on your profile. `;
  } else {
    summary += `No major concerns were identified based on available data. `;
  }

  return summary.trim();
};

/**
 * Generate recommendation text from backend assessment.
 */
const generateRecommendation = (assessment: BackendRiskAssessment): string => {
  if (!assessment.can_take) {
    if (assessment.alternatives_to_consider.length > 0) {
      return `Do not take this medication. Consider these alternatives: ${assessment.alternatives_to_consider.slice(0, 2).join(', ')}. Consult your healthcare provider.`;
    }
    return 'Do not take this medication. Please consult your healthcare provider for safer alternatives.';
  }

  if (assessment.recommended_max_dose) {
    let rec = `You may take this medication. Recommended: ${assessment.recommended_max_dose}`;
    if (assessment.monitoring_required.length > 0) {
      rec += `. Monitor: ${assessment.monitoring_required.slice(0, 2).join(', ')}`;
    }
    return rec;
  }

  if (assessment.overall_risk_level === 'warning') {
    return 'Use with caution and consult your healthcare provider before taking.';
  }

  if (assessment.overall_risk_level === 'caution') {
    return 'Generally safe to use, but follow package directions and stop if you experience adverse effects.';
  }

  return 'This medication appears safe for you. Follow standard dosing guidelines.';
};

/**
 * Map backend RiskAssessment to frontend AnalysisResult.
 */
export const mapRiskAssessmentToAnalysisResult = (
  assessment: BackendRiskAssessment
): AnalysisResult => {
  // Invert risk score: backend 0=safe -> frontend 100=safe
  const safetyScore = Math.max(0, Math.min(100, 100 - assessment.risk_score));

  // Map personalized_side_effects to RiskFactor[]
  const risks: RiskFactor[] = assessment.personalized_side_effects.map(se => ({
    condition: se.name,
    probability: `${(se.personalized_frequency * 100).toFixed(1)}%`,
    severity: mapMultiplierToSeverity(se.risk_multiplier),
    explanation: se.relevant_factors.length > 0
      ? `Risk elevated due to: ${se.relevant_factors.join(', ')}`
      : 'Based on medication profile',
  }));

  // Add warnings as high-severity risks
  assessment.warnings.forEach(w => {
    const condition = w.reason || w.factor || w.interacting_drug || 'Warning';
    const explanation = w.detail || w.effect || w.mechanism || '';

    // Avoid duplicates
    if (!risks.some(r => r.condition === condition)) {
      risks.push({
        condition,
        probability: 'Elevated',
        severity: 'High',
        explanation,
      });
    }
  });

  // Combine hard_stops into contraindications
  const contraindications: string[] = [
    ...assessment.hard_stops.map(hs => `${hs.reason}: ${hs.detail}`),
    ...assessment.warnings
      .filter(w => w.type === 'drug_interaction' && w.interacting_drug)
      .map(w => `Drug interaction with ${w.interacting_drug}: ${w.effect || w.detail || 'Use caution'}`),
  ];

  // Generate alternatives based on safety score
  const alternatives: string[] = assessment.alternatives_to_consider || [];

  // Add common alternatives if none provided and drug is risky
  if (alternatives.length === 0 && safetyScore < 50) {
    if (assessment.drug_name.toLowerCase().includes('ibuprofen') ||
        assessment.drug_name.toLowerCase().includes('aspirin')) {
      alternatives.push('Acetaminophen (Tylenol)', 'Topical creams', 'Heat/ice therapy');
    }
  }

  return {
    drugName: assessment.drug_name,
    safetyScore,
    summary: generateSummary(assessment),
    risks: risks.slice(0, 10), // Limit to 10 risks
    contraindications,
    alternatives: alternatives.length > 0 ? alternatives : undefined,
    recommendation: generateRecommendation(assessment),
    references: [
      'SIDER 4.1 - Side Effect Resource',
      'FDA Drug Label Database',
      'Clinical Pharmacology Guidelines',
    ],
  };
};
