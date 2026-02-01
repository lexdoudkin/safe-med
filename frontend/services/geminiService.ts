import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { UserProfile, AnalysisResult } from '../types';

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || '');

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
    - Ethnicity: ${profile.ethnicity || 'Not specified'}
    - Blood Type: ${profile.bloodType || 'Unknown'}
    - Existing Conditions: ${profile.conditions.join(', ') || 'None reported'}

    TASK:
    1. Identify the drug from the user's input (text or image).
    2. Analyze specific risks, side effects, and contraindications FOR THIS SPECIFIC PATIENT based on their profile (especially conditions, age, weight, ethnicity).
    3. Calculate a personalized "Safety Score" (0-100, where 100 is completely safe/benign and 0 is deadly/severe contraindication).
    4. Provide clear, concise, consumer-friendly explanations with scientific validity.
    5. Cite general medical references or guidelines where applicable.

    IMPORTANT: Be thorough but accessible. Patients need to understand their personal risks clearly.
  `;

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemInstruction,
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: SchemaType.OBJECT,
        properties: {
          drugName: { type: SchemaType.STRING },
          safetyScore: { type: SchemaType.NUMBER, description: "0 to 100 integer score of safety for this user" },
          summary: { type: SchemaType.STRING, description: "A short paragraph summary of the analysis" },
          risks: {
            type: SchemaType.ARRAY,
            items: {
              type: SchemaType.OBJECT,
              properties: {
                condition: { type: SchemaType.STRING, description: "The specific side effect or interaction" },
                probability: { type: SchemaType.STRING, description: "e.g., 'High', '10%', 'Rare'" },
                severity: { type: SchemaType.STRING, enum: ['Low', 'Medium', 'High', 'Critical'] },
                explanation: { type: SchemaType.STRING, description: "Why this profile is at risk" }
              },
              required: ['condition', 'probability', 'severity', 'explanation']
            }
          },
          contraindications: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
          recommendation: { type: SchemaType.STRING, description: "Actionable advice (e.g., 'Consult doctor', 'Safe to take')" },
          references: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } }
        },
        required: ['drugName', 'safetyScore', 'summary', 'risks', 'contraindications', 'recommendation', 'references']
      }
    }
  });

  try {
    let result;

    if (drugImage) {
      const imagePart = await fileToGenerativePart(drugImage);
      result = await model.generateContent([
        imagePart,
        { text: `Analyze the drug shown in this image. Additional context: ${drugText || "None"}` }
      ]);
    } else {
      result = await model.generateContent(`Analyze the drug named: "${drugText}"`);
    }

    const response = result.response;
    const text = response.text();

    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Failed to analyze drug safety. Please check your API key and try again.");
  }
};
