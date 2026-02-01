/**
 * Backend API Service
 * Communicates with the SafeMed Python backend for evidence-based drug risk assessment.
 */

// Backend API types (match Python models)
export interface BackendUserProfile {
  age: number;
  sex: 'male' | 'female' | 'unknown';
  weight_kg?: number;
  pregnant: boolean;
  pregnancy_trimester?: number;
  breastfeeding: boolean;
  conditions: string[];
  current_medications: string[];
  allergies: string[];
  smoker: boolean;
  alcohol_use: 'none' | 'light' | 'moderate' | 'heavy';
  egfr?: number;
  potassium?: number;
  heart_rate?: number;
  history_gi_bleed: boolean;
  history_mi: boolean;
  history_stroke: boolean;
  history_arrhythmia: boolean;
  history_seizures: boolean;
}

export interface BackendHardStop {
  type: string;
  reason: string;
  detail: string;
  severity: string;
}

export interface BackendWarning {
  type: string;
  reason?: string;
  factor?: string;
  detail?: string;
  interacting_drug?: string;
  effect?: string;
  mechanism?: string;
  recommendation?: string;
  severity?: string;
  risk_multiplier?: number;
}

export interface BackendSideEffect {
  name: string;
  base_severity: string;
  personalized_frequency: number;
  risk_multiplier: number;
  relevant_factors: string[];
}

export interface BackendRiskAssessment {
  drug_name: string;
  overall_risk_level: 'safe' | 'caution' | 'warning' | 'danger' | 'contraindicated';
  risk_score: number;
  can_take: boolean;
  hard_stops: BackendHardStop[];
  warnings: BackendWarning[];
  cautions: BackendWarning[];
  personalized_side_effects: BackendSideEffect[];
  recommended_max_dose?: string;
  monitoring_required: string[];
  alternatives_to_consider: string[];
  detailed_breakdown: {
    contraindication_score: number;
    interaction_score: number;
    demographic_score: number;
    condition_score: number;
    total_score: number;
    factors: string[];
  };
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

/**
 * Check if the backend is healthy and available.
 */
export const checkBackendHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BACKEND_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * Get list of drugs supported by the backend.
 */
export const getAvailableDrugs = async (): Promise<string[]> => {
  const response = await fetch(`${BACKEND_URL}/api/v1/drugs`, {
    method: 'GET',
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch available drugs');
  }

  const data = await response.json();
  return data.drugs || [];
};

/**
 * Assess drug risk using the backend engine.
 */
export const assessDrugRisk = async (
  drugName: string,
  profile: BackendUserProfile
): Promise<BackendRiskAssessment> => {
  const response = await fetch(`${BACKEND_URL}/api/v1/assess`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      drug_name: drugName,
      profile: profile,
    }),
    signal: AbortSignal.timeout(10000), // 10 second timeout
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    if (error.detail?.error === 'drug_not_supported') {
      throw new Error(`Drug not supported: ${drugName}`);
    }
    throw new Error(error.detail?.message || error.detail || 'Risk assessment failed');
  }

  return response.json();
};

/**
 * Quick check with minimal profile info.
 */
export const quickCheck = async (
  drugName: string,
  age: number,
  medications: string[] = [],
  conditions: string[] = [],
  pregnant: boolean = false
): Promise<{ can_take: boolean; risk_level: string; risk_score: number }> => {
  const response = await fetch(`${BACKEND_URL}/api/v1/quick-check`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      drug_name: drugName,
      age,
      medications,
      conditions,
      pregnant,
    }),
    signal: AbortSignal.timeout(5000),
  });

  if (!response.ok) {
    throw new Error('Quick check failed');
  }

  return response.json();
};
