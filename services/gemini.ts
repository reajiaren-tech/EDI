import { GoogleGenAI } from "@google/genai";

const MODEL_ID = "gemini-2.5-flash";

let aiClient: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI | null => {
  if (!aiClient) {
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey.trim() === "") {
      // Don't log warn every time, just return null. The consumer will handle fallback.
      return null;
    }
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.error("Failed to initialize GoogleGenAI client:", e);
      return null;
    }
  }
  return aiClient;
};

// Fallback data for simulation mode
const MOCK_EDI = `ISA*00*          *00*          *ZZ*BUYERCODE      *ZZ*SUPPLIERCODE   *231025*1200*U*00401*000000001*0*P*>~
GS*PO*BUYERCODE*SUPPLIERCODE*20231025*1200*1*X*004010~
ST*850*0001~
BEG*00*NE*PO-DEMO-001**20231025~
N1*BY*演示买方*92*12345~
N1*SE*演示供应商*92*67890~
PO1*1*100*EA*45.00**VP*WIRELESS HEADSET~
CTT*1~
SE*8*0001~
GE*1*1~
IEA*1*000000001~`;

const MOCK_EXPLANATION = `
<p><strong>⚠️ 演示模式（未检测到 API Key）：</strong></p>
<p>这是一段标准的 EDI 850 采购订单示例解释：</p>
<ul class="list-disc pl-5 space-y-2">
  <li><strong>ISA/GS (信封头)</strong>：这些段就像信封上的地址，标识了发送方（买方）和接收方（供应商），以及传输的时间。</li>
  <li><strong>ST*850*0001</strong>：表示事务集开始。"850" 是采购订单的国际标准代码。</li>
  <li><strong>BEG</strong>：订单的起始段，包含了订单编号 (PO-DEMO-001) 和日期。</li>
  <li><strong>N1</strong>：名称段，N1*BY 表示买方信息，N1*SE 表示卖方信息。</li>
  <li><strong>PO1</strong>：这是核心的商品行信息。订购了 100 个单位 (EA)，单价 45.00。VP 标识后面的代码是供应商的产品型号。</li>
  <li><strong>SE/GE/IEA</strong>：这些是结束符，用于确保传输的数据完整无误，就像句号一样。</li>
</ul>
<p class="mt-2 text-sm text-gray-500">提示：要在实操练习中获得 AI 生成的实时反馈，请在 Vercel 部署设置中配置环境变量 <code>API_KEY</code>。</p>
`;

export const generateEDISample = async (description: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // If no AI client (missing key), return Mock Data immediately
    if (!ai) {
      console.warn("Using Mock EDI Data (No API Key found)");
      return MOCK_EDI;
    }

    const prompt = `
      You are an expert EDI (Electronic Data Interchange) instructor.
      The user will provide a business scenario details.
      Your task is to generate a VALID, concise ANSI X12 EDI segment snippet representing this.
      Focus on the relevant segments (like PO1 for orders).
      
      Rules:
      1. Output ONLY the EDI code block. 
      2. Use '*' as delimiter and '~' as segment terminator.
      3. Make it realistic but simplified for teaching.
      4. Do not add markdown backticks.
      
      Scenario Details: ${description}
    `;

    const response = await ai.models.generateContent({
      model: MODEL_ID,
      contents: prompt,
    });

    return response.text.trim();
  } catch (error) {
    console.error("Error generating EDI:", error);
    return MOCK_EDI;
  }
};

export const explainEDI = async (ediCode: string): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // If no AI client, return Mock Explanation
    if (!ai) {
      return MOCK_EXPLANATION;
    }

    const prompt = `
      You are a friendly supply chain professor.
      Explain the following EDI code snippet to a student in Chinese (Simplified).
      Break down the key segments (e.g., ST, BEG, PO1, N1).
      Keep it brief, easy to understand, and educational. Format with HTML tags (e.g., <b>, <ul>, <li>) for readability if needed, but do not use markdown blocks.
      
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
    return MOCK_EXPLANATION;
  }
};