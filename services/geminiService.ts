import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const askReactorTutor = async (question: string, currentStage: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const systemInstruction = `You are a helpful, enthusiastic nuclear physics tutor guiding a student through a 3D visualization of a nuclear power plant. 
    The user is currently looking at the "${currentStage}" stage.
    Keep answers concise (under 80 words), easy to understand, and relevant to the visual context. 
    If the user asks about safety, emphasize the safety mechanisms like control rods and containment vessels.`;

    const response = await ai.models.generateContent({
      model,
      contents: question,
      config: {
        systemInstruction,
        thinkingConfig: { thinkingBudget: 0 } // Low latency for chat
      }
    });

    return response.text || "I'm having trouble analyzing the reactor data right now. Try again?";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Communications with the main computer are down. (Check API Key)";
  }
};
