
import { GoogleGenAI, Type } from "@google/genai";
import { Product } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const analyzeInventoryWithGemini = async (inventory: Product[], userQuery: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Voici l'inventaire actuel de l'alimentation: ${JSON.stringify(inventory)}. 
      L'utilisateur demande: "${userQuery}".
      Réponds de manière concise et professionnelle en français.`,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Désolé, je ne peux pas traiter votre demande pour le moment.";
  }
};

export const suggestStockAdjustments = async (inventory: Product[], salesHistory: any[]) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyse l'inventaire et les ventes pour suggérer des réapprovisionnements. 
      Inventaire: ${JSON.stringify(inventory)}. 
      Ventes: ${JSON.stringify(salesHistory)}.
      Donne tes recommandations au format JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            suggestions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  productName: { type: Type.STRING },
                  reason: { type: Type.STRING },
                  recommendedQuantity: { type: Type.NUMBER }
                },
                required: ["productName", "reason", "recommendedQuantity"]
              }
            }
          }
        }
      }
    });
    return JSON.parse(response.text || '{"suggestions": []}');
  } catch (error) {
    console.error("Gemini Suggestion Error:", error);
    return { suggestions: [] };
  }
};
