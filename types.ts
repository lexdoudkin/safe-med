export interface UserProfile {
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number; // kg
  height: number; // cm
  ethnicity: string;
  bloodType?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-' | '';
  conditions: string[];
}

export const COMMON_CONDITIONS = [
  'Hypertension',
  'Pregnancy',
  'Asthma',
  'Diabetes',
  'Heart Disease',
  'Kidney Disease',
  'Liver Disease',
  'Allergies',
  'High Cholesterol',
  'Thyroid Disorder',
] as const;

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
