import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const getStarInfo = async (starName: string, constellation: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      あなたはプロの天文学者で、かつ親しみやすいガイドです。
      星「${starName}」（星座：${constellation}）について、150文字以内で、
      1. 基本的な特徴（色、距離など）
      2. 面白い豆知識や神話
      を日本語で教えてください。専門用語は噛み砕いてください。
      出力はテキストのみで、マークダウンは含めないでください。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "情報の取得に失敗しました。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "現在、星の情報にアクセスできません。";
  }
};

export const getTonightForecast = async (dateStr: string, location: string): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    const prompt = `
      日付: ${dateStr}
      場所: ${location}
      
      今夜の星空予報を、200文字程度の「今日の見どころ」として作成してください。
      季節の星座、見える惑星、もしあれば流星群などに触れて、
      「空を見上げたくなる」ようなワクワクする文章にしてください。
      カジュアルでロマンチックなトーンで。
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "予報の生成に失敗しました。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "星空予報の読み込みに失敗しました。";
  }
};