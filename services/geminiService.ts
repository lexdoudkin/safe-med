import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to convert file to base64
export const fileToGenerativePart = async (file: File): Promise<{ inlineData: { data: string; mimeType: string } }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const base64Data = base64String.split(',')[1];
      resolve({
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const analyzeDrugSafety = async (
  profile: UserProfile, 
  drugText: string, 
  drugImage?: File
): Promise<AnalysisResult> => {
  
  const systemInstruction = `
    You are SafeMed AI, a world-class clinical pharmacologist and personalized medicine expert. 
    Your goal is to analyze a specific drug (identified via text or image) against a patient's specific health profile.
    
    PATIENT PROFILE:
    - Age: ${profile.age}
    - Gender: ${profile.gender}
    - Weight: ${profile.weight}kg
    - Height: ${profile.height}cm
    - Ethnicity: ${profile.ethnicity}
    - Blood Type: ${profile.bloodType || 'Unknown'}
    - Existing Conditions: ${profile.conditions.join(', ') || 'None reported'}

    TASK:
    1. Identify the drug from the user's input (text or image).
    2. Analyze specific risks, side effects, and contraindications FOR THIS SPECIFIC PATIENT based on their profile (especially conditions, age, weight, ethnicity).
    3. Calculate a personalized "Safety Score" (0-100, where 100 is completely safe/benign and 0 is deadly/severe contraindication).
    4. Provide clear, concise, consumer-friendly explanations with scientific validity.
    5. Cite general medical references or guidelines where applicable.
  `;

  const parts: any[] = [];
  
  if (drugImage) {
    const imagePart = await fileToGenerativePart(drugImage);
    parts.push(imagePart);
    parts.push({ text: `Analyze the drug shown in this image. Additional context: ${drugText || "None"}` });
  } else {
    parts.push({ text: `Analyze the drug named: "${drugText}"` });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Capable of multimodal inputs
      contents: {
        role: 'user',
        parts: parts
      },
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            drugName: { type: Type.STRING },
            safetyScore: { type: Type.NUMBER, description: "0 to 100 integer score of safety for this user" },
            summary: { type: Type.STRING, description: "A short paragraph summary of the analysis" },
            risks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  condition: { type: Type.STRING, description: "The specific side effect or interaction" },
                  probability: { type: Type.STRING, description: "e.g., 'High', '10%', 'Rare'" },
                  severity: { type: Type.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
                  explanation: { type: Type.STRING, description: "Why this profile is at risk" }
                }
              }
            },
            contraindications: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendation: { type: Type.STRING, description: "Actionable advice (e.g., 'Consult doctor', 'Safe to take')" },
            references: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze drug safety. Please try again.");
  }
};
