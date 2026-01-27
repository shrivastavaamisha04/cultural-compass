
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

Scenario Format: Contrast the user's home norms with the destination's specific etiquette for the given request, considering their gender and location.

RESPONSE FORMAT (JSON):
{
  "title": "A punchy 3-5 word summary",
  "steps": ["Step 1", "Step 2", "Step 3"],
  "taboo": "A critical Red Flag warning",
  "phrase": {
    "native": "Native language phrase",
    "phonetic": "How to pronounce it",
    "meaning": "What it means in English"
  }
}`;

export const getCulturalAdvice = async (origin: string, destination: string, gender: string, scenario: string): Promise<CulturalAdvice> => {
  const apiKey = process.env.API_KEY || '';
  console.log("Initializing Gemini with Key:", apiKey ? `${apiKey.substring(0, 4)}...` : "MISSING");

  if (!apiKey) {
    throw new Error("API Key is missing. Please check your settings.");
  }

  const prompt = `${SYSTEM_INSTRUCTION}

User Profile: ${gender} from ${origin}. 
Destination: ${destination}. 
Etiquette Question: "${scenario}".

Provide your response as valid JSON only, following the exact format specified above.`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) throw new Error("No response from AI");

    // Clean up the response - remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    return JSON.parse(cleanText) as CulturalAdvice;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
