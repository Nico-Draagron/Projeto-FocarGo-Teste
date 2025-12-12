import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, Lesson } from "../types";

// Initialize Gemini
// Note: In a real app, strict error handling for missing key is needed.
// The key is injected via process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// ... (Existing analyzeWasteImage function remains the same) ...
export const analyzeWasteImage = async (base64Image: string): Promise<ScanResult> => {
  try {
    // Remove header if present
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const SYSTEM_INSTRUCTION = `
   Você é um especialista em reciclagem e gestão de resíduos no Brasil. 
   Analise imagens de resíduos usando raciocínio avançado (chain-of-thought) 
   e forneça educação científica precisa.
   
   PROCESSO DE ANÁLISE:
   
   1. IDENTIFICAÇÃO (Vision API)
      - Identifique o objeto na imagem
      - Determine material: plástico, vidro, metal, papel, orgânico, eletrônico
      - Tipo específico (PET, PEAD, PP para plástico; alumínio, aço para metal, etc)
      - Condição física (intacto, quebrado, sujo)
   
   2. CONTAMINAÇÃO (Reasoning)
      - Detecte: restos de comida, óleo, líquidos, sujeira
      - Determine se está limpo o suficiente para reciclar
      - Instruções de limpeza se necessário
   
   3. CATEGORIZAÇÃO (Conhecimento regional - Brasil)
      - Lixeira correta segundo padrão brasileiro:
        * Azul = Papel/Papelão
        * Verde = Vidro
        * Vermelho = Plástico
        * Amarelo = Metal
        * Marrom = Orgânico
        * Cinza = Não reciclável
      - Considere infraestrutura brasileira
   
   4. EDUCAÇÃO (Text Generation)
      - Explique POR QUÊ esta categoria (ciência simples)
      - Dê curiosidade científica interessante
      - Conecte ao impacto ambiental
   
   5. IMPACTO (Data-driven)
      - CO₂ economizado vs. novo (kg + comparação tangível)
      - Energia economizada (% + exemplo prático)
      - Valor econômico para cooperativa (R$)
   
   6. STORYTELLING (Human connection)
      - Narre a jornada: coleta → processamento → novo produto
      - Inclua contexto humano: "João da Cooperativa Vila Mariana"
      - Torne tangível e emocional
   `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", 
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: cleanBase64 } },
          { text: "Analise este resíduo e retorne JSON estruturado." }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        temperature: 0.2,
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            material: { type: Type.STRING },
            material_details: { type: Type.STRING },
            category: { type: Type.STRING },
            bin_color: { type: Type.STRING },
            bin_emoji: { type: Type.STRING },
            recyclable: { type: Type.BOOLEAN },
            contamination_detected: { type: Type.BOOLEAN },
            contamination_details: { type: Type.STRING, nullable: true },
            cleaning_required: { type: Type.BOOLEAN },
            cleaning_instructions: { type: Type.STRING, nullable: true },
            educational_explanation: { type: Type.STRING },
            scientific_fact: { type: Type.STRING },
            environmental_impact: {
              type: Type.OBJECT,
              properties: {
                co2_saved_kg: { type: Type.STRING },
                energy_saved: { type: Type.STRING },
                recycling_time: { type: Type.STRING },
                water_saved: { type: Type.STRING, nullable: true },
              }
            },
            journey_story: { type: Type.STRING },
            cooperative_impact: { type: Type.STRING },
            ecoins_earned: { type: Type.NUMBER },
            tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            confidence_score: { type: Type.NUMBER }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ScanResult;
    } else {
      throw new Error("No response text from Gemini");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    // Fallback for demo stability
    return {
      material: "Item Desconhecido",
      material_details: "Não foi possível identificar",
      category: "Desconhecido",
      bin_color: "Cinza",
      bin_emoji: "🗑️",
      recyclable: false,
      contamination_detected: false,
      contamination_details: null,
      cleaning_required: false,
      cleaning_instructions: null,
      educational_explanation: "Tente tirar uma foto mais clara do item.",
      scientific_fact: "A reciclagem economiza recursos naturais.",
      environmental_impact: {
        co2_saved_kg: "0",
        energy_saved: "0",
        recycling_time: "N/A",
        water_saved: null
      },
      journey_story: "Não conseguimos traçar a jornada deste item.",
      cooperative_impact: "R$ 0,00",
      ecoins_earned: 0,
      tips: ["Limpe a lente da câmera", "Garanta boa iluminação"],
      confidence_score: 0
    };
  }
};

export const generateLessonContent = async (topic: string, difficulty: string): Promise<any> => {
    // Placeholder for on-demand lesson generation using Gemini
    // In a production app, this would generate the Lesson JSON structure dynamically.
    return null;
}