/**
 * Hybrid Analysis Service
 * Orchestrates between backend (evidence-based) and Gemini (AI) for drug analysis.
 *
 * Strategy:
 * 1. For supported drugs (ibuprofen, salbutamol): Use backend for structured risk data
 * 2. For unsupported drugs: Fall back to Gemini AI
 * 3. For image input: Use Gemini to extract drug name, then route appropriately
 */

import { UserProfile, AnalysisResult } from '../types';
import { analyzeDrugSafety as geminiAnalyze } from './geminiService';
import { checkBackendHealth, getAvailableDrugs, assessDrugRisk } from './backendService';
import { mapUserProfileToBackend, mapRiskAssessmentToAnalysisResult } from './mappingService';

// Cache for backend state
let backendAvailable: boolean | null = null;
let availableDrugs: string[] | null = null;
let lastBackendCheck: number = 0;
const BACKEND_CHECK_INTERVAL = 60000; // Re-check every minute

/**
 * Check and cache backend availability.
 */
const ensureBackendState = async (): Promise<boolean> => {
  const now = Date.now();

  // Re-check if cache is stale or never checked
  if (backendAvailable === null || now - lastBackendCheck > BACKEND_CHECK_INTERVAL) {
    lastBackendCheck = now;
    backendAvailable = await checkBackendHealth();

    if (backendAvailable) {
      try {
        availableDrugs = await getAvailableDrugs();
        console.log('[SafeMed] Backend available. Supported drugs:', availableDrugs);
      } catch (err) {
        console.warn('[SafeMed] Backend health OK but failed to fetch drugs:', err);
        backendAvailable = false;
        availableDrugs = null;
      }
    } else {
      console.log('[SafeMed] Backend unavailable, will use Gemini fallback');
      availableDrugs = null;
    }
  }

  return backendAvailable;
};

/**
 * Find matching drug name from available drugs.
 */
const findMatchingDrug = (drugText: string): string | null => {
  if (!availableDrugs || availableDrugs.length === 0) return null;

  const normalized = drugText.toLowerCase().trim();

  // Direct match
  if (availableDrugs.includes(normalized)) {
    return normalized;
  }

  // Partial match (e.g., "ibuprofen 400mg" should match "ibuprofen")
  for (const drug of availableDrugs) {
    if (normalized.includes(drug) || drug.includes(normalized)) {
      return drug;
    }
  }

  // Common brand name mappings
  const brandMappings: Record<string, string> = {
    advil: 'ibuprofen',
    motrin: 'ibuprofen',
    nurofen: 'ibuprofen',
    brufen: 'ibuprofen',
    ventolin: 'salbutamol',
    proventil: 'salbutamol',
    albuterol: 'salbutamol',
  };

  for (const [brand, generic] of Object.entries(brandMappings)) {
    if (normalized.includes(brand) && availableDrugs.includes(generic)) {
      return generic;
    }
  }

  return null;
};

/**
 * Main analysis function - routes to backend or Gemini based on drug support.
 */
export const analyzeDrugSafety = async (
  profile: UserProfile,
  drugText: string,
  drugImage?: File
): Promise<AnalysisResult> => {
  // Step 1: Check backend availability
  const isBackendReady = await ensureBackendState();

  // Step 2: Handle image input
  // If we have an image but no text, we must use Gemini to extract the drug name
  if (drugImage && !drugText.trim()) {
    console.log('[SafeMed] Image provided without text, using Gemini for extraction');
    const geminiResult = await geminiAnalyze(profile, '', drugImage);

    // Try to enhance with backend if the extracted drug is supported
    if (isBackendReady) {
      const matchedDrug = findMatchingDrug(geminiResult.drugName);
      if (matchedDrug) {
        console.log(`[SafeMed] Gemini extracted "${geminiResult.drugName}", matched to backend drug "${matchedDrug}"`);
        try {
          const backendProfile = mapUserProfileToBackend(profile);
          const assessment = await assessDrugRisk(matchedDrug, backendProfile);
          return mapRiskAssessmentToAnalysisResult(assessment);
        } catch (err) {
          console.warn('[SafeMed] Backend assessment failed, using Gemini result:', err);
        }
      }
    }

    return geminiResult;
  }

  // Step 3: Text-based lookup
  const drugName = drugText.trim();

  // Step 4: Try backend for supported drugs
  if (isBackendReady) {
    const matchedDrug = findMatchingDrug(drugName);

    if (matchedDrug) {
      console.log(`[SafeMed] Using backend for "${matchedDrug}"`);
      try {
        const backendProfile = mapUserProfileToBackend(profile);
        const assessment = await assessDrugRisk(matchedDrug, backendProfile);
        return mapRiskAssessmentToAnalysisResult(assessment);
      } catch (err) {
        console.warn('[SafeMed] Backend assessment failed, falling back to Gemini:', err);
      }
    } else {
      console.log(`[SafeMed] Drug "${drugName}" not supported by backend, using Gemini`);
    }
  }

  // Step 5: Fall back to Gemini
  console.log('[SafeMed] Using Gemini for analysis');
  return geminiAnalyze(profile, drugText, drugImage);
};

/**
 * Get list of drugs with enhanced (backend) support.
 */
export const getSupportedDrugs = async (): Promise<string[]> => {
  await ensureBackendState();
  return availableDrugs || [];
};

/**
 * Check if a specific drug has backend support.
 */
export const isDrugSupported = async (drugName: string): Promise<boolean> => {
  await ensureBackendState();
  return findMatchingDrug(drugName) !== null;
};
