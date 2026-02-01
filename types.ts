export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number; // kg
  height: number; // cm
  ethnicity: string;
  bloodType?: string;
  conditions: string[];
}

export interface RiskFactor {
  condition: string;
  probability: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  explanation: string;
}

export interface AnalysisResult {
  drugName: string;
  safetyScore: number; // 0-100
  summary: string;
  risks: RiskFactor[];
  contraindications: string[];
  recommendation: string;
  references: string[];
}

export enum AppState {
  ONBOARDING = 'ONBOARDING',
  PROFILE = 'PROFILE',
  INPUT = 'INPUT',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
}
