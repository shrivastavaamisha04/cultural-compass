
import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
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
  type: SchemaType.OBJECT,
  properties: {
    title: { type: SchemaType.STRING, description: "A punchy 3-5 word summary" },
    steps: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
      description: "Exactly 3 physical/verbal steps"
    },
    taboo: { type: SchemaType.STRING, description: "A critical Red Flag warning" },
    phrase: {
      type: SchemaType.OBJECT,
      properties: {
        native: { type: SchemaType.STRING },
        phonetic: { type: SchemaType.STRING },
        meaning: { type: SchemaType.STRING }
      },
      required: ["native", "phonetic", "meaning"]
    }
  },
  required: ["title", "steps", "taboo", "phrase"]
};

export const getCulturalAdvice = async (origin: string, destination: string, gender: string, scenario: string): Promise<CulturalAdvice> => {
  // Debug log to check if key exists (first 4 chars only for security)
  const apiKey = process.env.API_KEY || '';
  console.log("Initializing Gemini with Key:", apiKey ? `${apiKey.substring(0, 4)}...` : "MISSING");

  if (!apiKey) {
    throw new Error("API Key is missing. Please check your settings.");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash-001",
    systemInstruction: SYSTEM_INSTRUCTION,
    // Removing strict schema to ensure compatibility with all model versions
    generationConfig: {
      responseMimeType: "application/json",
    }
  });

  try {
    const result = await model.generateContent(`User Profile: ${gender} from ${origin}. 
      Destination: ${destination}. 
      Etiquette Question: "${scenario}".`);

    const text = result.response.text();
    if (!text) throw new Error("No response from AI");

    return JSON.parse(text) as CulturalAdvice;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
