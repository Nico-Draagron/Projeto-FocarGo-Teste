
import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, ChatMessage } from "../types";

// Initialize Gemini with safe environment variable access
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION_ANALYSIS = `
   Você é um especialista em reciclagem e gestão de resíduos no Brasil. 
   Analise o resíduo fornecido (imagem, áudio ou descrição textual) usando raciocínio avançado.
   
   PROCESSO DE ANÁLISE:
   1. IDENTIFICAÇÃO: Objeto, material (PET, Vidro, etc), condição.
   2. CONTAMINAÇÃO: Detecte sujeira ou resíduos orgânicos.
   3. CATEGORIZAÇÃO: Cores da coleta seletiva no Brasil (Azul=Papel, Vermelho=Plástico, etc).
   4. EDUCAÇÃO: Explique o porquê e curiosidade científica.
   5. IMPACTO: Estime CO2 economizado e valor para cooperativa.
   6. STORYTELLING: Crie uma micro-história sobre o ciclo de vida deste item.
   
   Se a entrada for ÁUDIO ou TEXTO, infira as características visuais com base na descrição.
`;

const RESPONSE_SCHEMA_ANALYSIS = {
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
};

export const analyzeWasteMultimodal = async (input: { 
    image?: string, 
    audio?: string, 
    text?: string 
}): Promise<ScanResult> => {
  try {
    const parts: any[] = [];

    if (input.image) {
       const cleanBase64 = input.image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");
       parts.push({ inlineData: { mimeType: "image/jpeg", data: cleanBase64 } });
    }
    
    if (input.audio) {
        // Remove header if present
        const cleanAudio = input.audio.replace(/^data:audio\/(webm|mp3|wav|ogg);base64,/, "");
        parts.push({ inlineData: { mimeType: "audio/webm", data: cleanAudio } });
        parts.push({ text: "Analise o áudio onde descrevo um resíduo." });
    }

    if (input.text) {
        parts.push({ text: `Descrição do resíduo: ${input.text}` });
    }

    parts.push({ text: "Analise este resíduo e retorne JSON estruturado seguindo o schema." });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION_ANALYSIS,
        responseMimeType: "application/json",
        temperature: 0.2,
        responseSchema: RESPONSE_SCHEMA_ANALYSIS
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as ScanResult;
    } else {
      throw new Error("No response text from Gemini");
    }

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return createFallbackResult();
  }
};

// Legacy support wrapper
export const analyzeWasteImage = async (base64Image: string): Promise<ScanResult> => {
    return analyzeWasteMultimodal({ image: base64Image });
};

export const chatWithGemini = async (
    history: ChatMessage[], 
    input: { text?: string, audio?: string }
): Promise<string> => {
    try {
        // Prepare history correctly for the chat context
        const historyParts = history.map(msg => ({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
        }));

        const chat = ai.chats.create({
            model: "gemini-2.5-flash",
            history: historyParts,
            config: {
                systemInstruction: "Você é o EcoBot, um assistente virtual acessível, amigável e especialista em reciclagem. Ajude usuários (incluindo cegos ou com baixa visão) descrevendo visualmente conceitos quando necessário. Suas respostas devem ser claras, encorajadoras e prontas para serem lidas em voz alta (TTS). Use emojis com moderação.",
            }
        });

        const messageContent: any[] = [];
        
        if (input.audio) {
            const cleanAudio = input.audio.replace(/^data:audio\/(webm|mp3|wav|ogg);base64,/, "");
            messageContent.push({ inlineData: { mimeType: "audio/webm", data: cleanAudio } });
            messageContent.push({ text: "Ouça e responda a este áudio em português." });
        }
        
        if (input.text) {
            messageContent.push({ text: input.text });
        }

        const result = await chat.sendMessage({ message: messageContent });

        return result.text || "Desculpe, não entendi. Pode repetir?";
    } catch (error) {
        console.error("Chat Error:", error);
        return "Estou com dificuldades de conexão. Tente novamente!";
    }
};

const createFallbackResult = (): ScanResult => ({
    material: "Desconhecido",
    material_details: "Não identificado",
    category: "Geral",
    bin_color: "Cinza",
    bin_emoji: "🗑️",
    recyclable: false,
    contamination_detected: false,
    contamination_details: null,
    cleaning_required: false,
    cleaning_instructions: null,
    educational_explanation: "Não foi possível analisar o item. Tente novamente.",
    scientific_fact: "A reciclagem reduz a necessidade de extração de novas matérias-primas.",
    environmental_impact: {
      co2_saved_kg: "0",
      energy_saved: "0",
      recycling_time: "-",
      water_saved: null
    },
    journey_story: "Tente capturar novamente.",
    cooperative_impact: "R$ 0,00",
    ecoins_earned: 0,
    tips: [],
    confidence_score: 0
});
