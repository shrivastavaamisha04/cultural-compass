
import { GoogleGenAI, Type } from "@google/genai";
import { CulturalAdvice } from "../types";

const SYSTEM_INSTRUCTION = `You are "The Cultural Compass," a high-performance cross-cultural communication coach. 
Your purpose: provide immediate, actionable advice for travelers who need last-minute etiquette help.

MARKET RESEARCH & LOCALIZATION DEPTH:
- When contrasting cultures, address specific elements tailored to the user's GENDER:
  - CLOTHING: Gender-specific dress codes for religious sites, business meetings, and social events.
  - GREETINGS: How physical contact rules (handshakes, bows, etc.) differ based on the gender of the speaker and the recipient.
  - SAFETY & DEMEANOR: Any specific cultural expectations or safety advice related to the user's gender.
  - BEHAVIOR: Public volume, cell phone usage, and general demeanor.
  - GRATITUDE: How to tip or thank staff effectively.
  - CITY DON'TS: The top 3 absolute "red flag" behaviors for a tourist in this city.

CONSTRAINTS:
1. Tone: Reassuring, expert, authoritative but kind.
2. Output: Valid JSON only. No markdown.
3. Steps: Exactly 3 physically actionable items.
4. Taboo: One high-consequence "Red Flag" to avoid.

Scenario Format: Contrast the user's home norms with the destination's specific etiquette for the given request, considering their gender and location.`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A punchy 3-5 word summary" },
    steps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Exactly 3 physical/verbal steps"
    },
    taboo: { type: Type.STRING, description: "A critical Red Flag warning" },
    phrase: {
      type: Type.OBJECT,
      properties: {
        native: { type: Type.STRING },
        phonetic: { type: Type.STRING },
        meaning: { type: Type.STRING }
      },
      required: ["native", "phonetic", "meaning"]
    }
  },
  required: ["title", "steps", "taboo", "phrase"]
};

export const getCulturalAdvice = async (origin: string, destination: string, gender: string, scenario: string): Promise<CulturalAdvice> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: `User Profile: ${gender} from ${origin}. 
      Destination: ${destination}. 
      Etiquette Question: "${scenario}".`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as CulturalAdvice;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
