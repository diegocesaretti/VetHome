import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { TriageData, UrgencyLevel, ParsedResponse } from "../types";

let chatSession: Chat | null = null;
let genAI: GoogleGenAI | null = null;

export const initializeChat = (): void => {
  if (!process.env.API_KEY) {
    console.error("API_KEY is missing from environment variables.");
    return;
  }
  
  try {
    genAI = new GoogleGenAI({ apiKey: process.env.API_KEY });
    chatSession = genAI.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Balance between creativity and consistency
      },
    });
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
  }
};

export const sendMessageToGemini = async (message: string): Promise<ParsedResponse> => {
  if (!chatSession) {
    initializeChat();
    if (!chatSession) {
      throw new Error("Chat session could not be initialized.");
    }
  }

  try {
    const response = await chatSession.sendMessage({ message });
    const text = response.text || "";
    return parseGeminiResponse(text);
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw error;
  }
};

const parseGeminiResponse = (responseText: string): ParsedResponse => {
  if (!responseText.includes("[FIN_TRIAJE]")) {
    return {
      visibleMessage: responseText,
      triageData: null
    };
  }

  const parts = responseText.split("[FIN_TRIAJE]");
  const visibleMessage = parts[0].trim();
  const summaryBlock = parts[1].trim();

  const nameMatch = summaryBlock.match(/Dueño:\s*(.*)/i);
  const phoneMatch = summaryBlock.match(/Teléfono:\s*(.*)/i);
  const addressMatch = summaryBlock.match(/Dirección:\s*(.*)/i);
  const petMatch = summaryBlock.match(/Mascota:\s*(.*)/i);
  const symptomsMatch = summaryBlock.match(/Síntomas:\s*(.*)/i);
  const urgencyMatch = summaryBlock.match(/Urgencia:\s*(.*)/i);

  const urgencyStr = urgencyMatch ? urgencyMatch[1].trim().toUpperCase() : "DESCONOCIDA";
  
  let urgency: UrgencyLevel = UrgencyLevel.UNKNOWN;
  if (urgencyStr.includes("ALTA")) urgency = UrgencyLevel.HIGH;
  else if (urgencyStr.includes("MEDIA")) urgency = UrgencyLevel.MEDIUM;
  else if (urgencyStr.includes("BAJA")) urgency = UrgencyLevel.LOW;

  const triageData: TriageData = {
    name: nameMatch ? nameMatch[1].trim() : "",
    phone: phoneMatch ? phoneMatch[1].trim() : "",
    address: addressMatch ? addressMatch[1].trim() : "",
    pet: petMatch ? petMatch[1].trim() : "",
    symptoms: symptomsMatch ? symptomsMatch[1].trim() : "",
    urgency,
    fullSummary: summaryBlock
  };

  return {
    visibleMessage,
    triageData
  };
};
