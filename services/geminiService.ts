
import { GoogleGenAI, Type } from "@google/genai";
import { JobType, SafetyAnalysis } from "../types";
import { ANALYSIS_SYSTEM_INSTRUCTION, JOB_REQUIREMENTS } from "../constants";

export const analyzeSafety = async (base64Image: string, jobType: JobType): Promise<SafetyAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Contexto de Trabalho: ${jobType}.
    Requisitos básicos de EPI para este trabalho: ${JOB_REQUIREMENTS[jobType]}.
    Analise a imagem e forneça o relatório de segurança detalhado citando as NRs brasileiras pertinentes.
  `;

  const imagePart = {
    inlineData: {
      mimeType: "image/jpeg",
      data: base64Image.split(",")[1], // Remove the data:image/jpeg;base64, prefix
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [imagePart, { text: prompt }] }],
      config: {
        systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            workerDetected: { type: Type.BOOLEAN },
            jobContext: { type: Type.STRING },
            identifiedPPE: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  status: { type: Type.STRING },
                  observation: { type: Type.STRING },
                },
                required: ["name", "status", "observation"]
              }
            },
            missingCriticalPPE: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            complianceScore: { type: Type.NUMBER },
            relevantNRs: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            finalVerdict: { type: Type.STRING },
            recommendations: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["workerDetected", "jobContext", "identifiedPPE", "missingCriticalPPE", "complianceScore", "relevantNRs", "finalVerdict", "recommendations"]
        }
      },
    });

    const result = JSON.parse(response.text || "{}");
    return result as SafetyAnalysis;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("Falha ao analisar a imagem. Verifique sua conexão e tente novamente.");
  }
};
