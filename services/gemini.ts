import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_ID = "gemini-2.5-flash";

export const generateEDISample = async (description: string): Promise<string> => {
  try {
    const prompt = `
      You are an expert EDI (Electronic Data Interchange) instructor.
      The user will provide a business scenario (e.g., "Buy 100 widgets").
      Your task is to generate a VALID, concise ANSI X12 EDI segment snippet representing this.
      Focus on the relevant segments (like PO1 for orders).
      
      Rules:
      1. Output ONLY the EDI code block. 
      2. Use '*' as delimiter and '~' as segment terminator.
      3. Make it realistic but simplified for teaching.
      4. Do not add markdown backticks.
      
      Scenario: ${description}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating EDI:", error);
    return "ST*850*0001~PO1*1*100*EA*10.00**VP*ITEM~SE*10*0001~"; // Fallback
  }
};

export const explainEDI = async (ediCode: string): Promise<string> => {
  try {
    const prompt = `
      You are a friendly supply chain professor.
      Explain the following EDI code snippet to a student in Chinese (Simplified).
      Break down the key segments (e.g., ST, BEG, PO1, N1).
      Keep it brief and educational.
      
      EDI Code:
      ${ediCode}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    return response.text;
  } catch (error) {
    console.error("Error explaining EDI:", error);
    return "无法连接到 AI 助教进行解释，请检查网络设置。";
  }
};