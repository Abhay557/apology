
import { GoogleGenAI, Type } from "@google/genai";

export const generateApologyMessage = async (recipient: string, reason: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Write a super cute, short, and heartwarming apology poem or message for ${recipient}. The reason is: ${reason}. Make it sound like it's from someone who really cares. Keep it under 60 words.`,
      config: {
        temperature: 0.9,
        topP: 0.95,
      },
    });

    return response.text || "I'm so sorry, please forgive me! ❤️";
  } catch (error) {
    console.error("Error generating message:", error);
    return "I'm really sorry from the bottom of my heart. I promise to make it up to you! ❤️";
  }
};
