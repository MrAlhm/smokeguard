
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAnalysis } from "../types";

export const analyzeVehicleImage = async (base64Data: string): Promise<GeminiAnalysis> => {
  // Use 'gemini-3-flash-preview' for vision-based classification tasks
  const model = 'gemini-3-flash-preview';
  
  const prompt = `Analyze this vehicle image for emission monitoring. Identify:
  1. Vehicle Type (Car, Bus, Truck, Motorcycle)
  2. Vehicle Color
  3. Smoke/Emission Severity (Low, Moderate, High)
  4. Numerical Smoke Score (0.0 to 1.0)
  5. Confidence Level (0 to 100)
  6. Maintenance Tip: Based on the smoke color (Black, White, Blue/Gray), suggest what engine component might be failing (e.g., fuel injector, head gasket, oil leak).
  7. Environmental factors.`;

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      vehicleType: { type: Type.STRING },
      vehicleColor: { type: Type.STRING },
      smokeSeverity: { type: Type.STRING, enum: ['Low', 'Moderate', 'High'] },
      smokeScore: { type: Type.NUMBER },
      confidence: { type: Type.NUMBER },
      description: { type: Type.STRING },
      environmentalFactors: { type: Type.STRING },
      maintenanceTip: { type: Type.STRING }
    },
    required: ['vehicleType', 'vehicleColor', 'smokeSeverity', 'smokeScore', 'confidence', 'description', 'maintenanceTip']
  };

  try {
    // Initializing with named parameter as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: model,
      contents: [{
        parts: [
          { text: prompt },
          { inlineData: { mimeType: 'image/jpeg', data: base64Data.split(',')[1] || base64Data } }
        ]
      }],
      config: { responseMimeType: "application/json", responseSchema: responseSchema }
    });

    // Accessing text as a property
    const text = response.text || '{}';
    return JSON.parse(text.trim());
  } catch (error: any) {
    console.error('Gemini Analysis Error:', error);
    return {
      vehicleType: "Analysis Failed",
      vehicleColor: "N/A",
      smokeSeverity: "Low",
      smokeScore: 0,
      confidence: 0,
      description: `Error: ${error?.message}`,
      maintenanceTip: "Check engine diagnostic port for manual readout."
    };
  }
};

export const getPolicyAdvice = async (history: any[], message: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are the SmokeGuard AI Policy Consultant by team Black Dragon. You specialize in vehicle emission laws, BS-VI standards, and Indian environmental regulations. Be professional.",
      }
    });
    const result = await chat.sendMessage({ message });
    // Accessing text as a property
    return result.text;
  } catch (error) {
    return "I am currently processing high traffic. Please try again.";
  }
};
