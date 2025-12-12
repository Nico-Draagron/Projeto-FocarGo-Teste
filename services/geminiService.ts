

import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult, ChatMessage } from "../types";

// Initialize Gemini with safe environment variable access
const apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION_ANALYSIS = `
   You are an expert in recycling and waste management. 
   Analyze the provided waste (image, audio, or text description) using advanced reasoning.
   Respond in ENGLISH.
   
   ANALYSIS PROCESS:
   1. IDENTIFICATION: Object, material (PET, Glass, etc), condition.
   2. CONTAMINATION: Detect dirt or organic waste.
   3. CATEGORIZATION: Standard recycling colors (Blue=Paper, Red=Plastic, Yellow=Metal, Green=Glass, Brown=Organic, Gray=General, etc).
   4. EDUCATION: Explain why and scientific curiosity.
   5. IMPACT: Estimate CO2 saved and value for cooperative.
   6. STORYTELLING: Create a micro-story about the lifecycle of this item.
   
   If the input is AUDIO or TEXT, infer visual characteristics based on description.
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
        parts.push({ text: "Analyze the audio where I describe a waste item." });
    }

    if (input.text) {
        parts.push({ text: `Waste description: ${input.text}` });
    }

    parts.push({ text: "Analyze this waste and return structured JSON following the schema." });

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
                systemInstruction: "You are EcoBot, an accessible, friendly, and expert recycling virtual assistant. Help users (including those who are blind or have low vision) by visually describing concepts when necessary. Your responses should be clear, encouraging, and ready to be read aloud (TTS). Use emojis moderately. Respond in English.",
            }
        });

        const messageContent: any[] = [];
        
        if (input.audio) {
            const cleanAudio = input.audio.replace(/^data:audio\/(webm|mp3|wav|ogg);base64,/, "");
            messageContent.push({ inlineData: { mimeType: "audio/webm", data: cleanAudio } });
            messageContent.push({ text: "Listen and respond to this audio in English." });
        }
        
        if (input.text) {
            messageContent.push({ text: input.text });
        }

        const result = await chat.sendMessage({ message: messageContent });

        return result.text || "Sorry, I didn't understand. Can you repeat?";
    } catch (error) {
        console.error("Chat Error:", error);
        return "I'm having trouble connecting. Please try again!";
    }
};

const createFallbackResult = (): ScanResult => ({
    material: "Unknown",
    material_details: "Unidentified",
    category: "General",
    bin_color: "Gray",
    bin_emoji: "🗑️",
    recyclable: false,
    contamination_detected: false,
    contamination_details: null,
    cleaning_required: false,
    cleaning_instructions: null,
    educational_explanation: "Could not analyze the item. Please try again.",
    scientific_fact: "Recycling reduces the need for extraction of new raw materials.",
    environmental_impact: {
      co2_saved_kg: "0",
      energy_saved: "0",
      recycling_time: "-",
      water_saved: null
    },
    journey_story: "Try capturing again.",
    cooperative_impact: "$ 0.00",
    ecoins_earned: 0,
    tips: [],
    confidence_score: 0
});
