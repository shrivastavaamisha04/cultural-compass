
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

// Fallback data generator for when API is unavailable
const generateFallbackAdvice = (origin: string, destination: string, gender: string, scenario: string): CulturalAdvice => {
  console.log("🔄 Using fallback mechanism - API unavailable");

  // Generic but helpful fallback advice
  const fallbackData: CulturalAdvice = {
    title: "Cultural Etiquette Guide",
    steps: [
      `Research ${destination}'s customs online before your visit to understand local expectations`,
      "Observe locals' behavior and follow their lead in social situations",
      "When in doubt, be polite, smile, and ask locals for guidance - most appreciate the effort"
    ],
    taboo: `Avoid making assumptions based on ${origin}'s culture - what's normal at home may be offensive in ${destination}`,
    phrase: {
      native: "Hello / Thank you",
      phonetic: "Learn basic greetings locally",
      meaning: "Basic courtesy phrases go a long way"
    }
  };

  // Add scenario-specific guidance
  const scenarioLower = scenario.toLowerCase();

  if (scenarioLower.includes('greet') || scenarioLower.includes('hello')) {
    fallbackData.title = "Greeting Etiquette Tips";
    fallbackData.steps = [
      "Research appropriate greetings for your destination (bow, handshake, or verbal)",
      "Observe the level of physical contact locals use and match it",
      "Use formal titles and last names unless invited to use first names"
    ];
    fallbackData.taboo = "Don't assume physical contact (hugs, kisses) is welcome - many cultures prefer distance";
  } else if (scenarioLower.includes('eat') || scenarioLower.includes('food') || scenarioLower.includes('dining')) {
    fallbackData.title = "Dining Etiquette Essentials";
    fallbackData.steps = [
      "Wait to be seated and observe how locals use utensils before starting",
      "Pace yourself with others at the table - don't rush or finish too quickly",
      "Learn if tipping is expected, offensive, or included in the bill"
    ];
    fallbackData.taboo = "Never start eating before your host or elders, and avoid pointing utensils at people";
  } else if (scenarioLower.includes('dress') || scenarioLower.includes('wear') || scenarioLower.includes('clothing')) {
    fallbackData.title = "Dress Code Guidelines";
    fallbackData.steps = [
      `Research ${destination}'s modesty standards for ${gender} travelers`,
      "Pack conservative options for religious sites and formal occasions",
      "Observe what locals wear and adjust your wardrobe accordingly"
    ];
    fallbackData.taboo = "Avoid revealing clothing in conservative areas - it can be deeply offensive and unsafe";
  } else if (scenarioLower.includes('gift') || scenarioLower.includes('present')) {
    fallbackData.title = "Gift-Giving Protocol";
    fallbackData.steps = [
      "Research culturally appropriate gifts and colors for your destination",
      "Present gifts with both hands and avoid opening them immediately unless asked",
      "Quality matters more than quantity - choose thoughtful over expensive"
    ];
    fallbackData.taboo = "Never give clocks, sharp objects, or white flowers without researching - they can symbolize death";
  } else if (scenarioLower.includes('business') || scenarioLower.includes('meeting')) {
    fallbackData.title = "Business Meeting Etiquette";
    fallbackData.steps = [
      "Arrive on time (or early) and dress formally unless told otherwise",
      "Exchange business cards with both hands and take time to read them",
      "Let senior members speak first and avoid interrupting"
    ];
    fallbackData.taboo = "Don't rush to business talk - many cultures value relationship-building first";
  }

  return fallbackData;
};

// Rate limiting tracker
let lastRequestTime = 0;
let requestCount = 0;
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_REQUESTS_PER_MINUTE = 10;

export const getCulturalAdvice = async (origin: string, destination: string, gender: string, scenario: string): Promise<CulturalAdvice> => {
  // Debug: Log all available environment variables
  console.log('🔍 Environment Debug:', {
    'import.meta.env.VITE_GEMINI_API_KEY': import.meta.env.VITE_GEMINI_API_KEY ? 'SET' : 'MISSING',
    'import.meta.env.API_KEY': import.meta.env.API_KEY ? 'SET' : 'MISSING',
    'All env keys': Object.keys(import.meta.env),
    'Mode': import.meta.env.MODE,
    'Prod': import.meta.env.PROD
  });

  // Try multiple sources for the API key
  const apiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    import.meta.env.API_KEY ||
    (import.meta.env as any).GEMINI_API_KEY ||
    '';

  console.log("Initializing Gemini with Key:", apiKey ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "MISSING");

  if (!apiKey) {
    console.warn("⚠️ API Key missing - using fallback data");
    console.warn("💡 Tip: Make sure API_KEY is set in Vercel environment variables");
    return generateFallbackAdvice(origin, destination, gender, scenario);
  }

  // Client-side rate limiting
  const now = Date.now();
  if (now - lastRequestTime > RATE_LIMIT_WINDOW) {
    requestCount = 0;
    lastRequestTime = now;
  }

  requestCount++;

  if (requestCount > MAX_REQUESTS_PER_MINUTE) {
    console.warn("⚠️ Client-side rate limit reached - using fallback");
    return generateFallbackAdvice(origin, destination, gender, scenario);
  }

  const prompt = `${SYSTEM_INSTRUCTION}

User Profile: ${gender} from ${origin}. 
Destination: ${destination}. 
Etiquette Question: "${scenario}".

Provide your response as valid JSON only, following the exact format specified above.`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
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
        }),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;

      // Handle specific error types
      if (response.status === 429) {
        console.warn("⚠️ API Rate limit exceeded (429) - using fallback");
        return generateFallbackAdvice(origin, destination, gender, scenario);
      } else if (response.status === 403) {
        console.warn("⚠️ API Key invalid or quota exceeded (403) - using fallback");
        return generateFallbackAdvice(origin, destination, gender, scenario);
      } else if (response.status >= 500) {
        console.warn("⚠️ Server error - using fallback");
        return generateFallbackAdvice(origin, destination, gender, scenario);
      }

      throw new Error(`API Error: ${errorMessage}`);
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.warn("⚠️ Empty API response - using fallback");
      return generateFallbackAdvice(origin, destination, gender, scenario);
    }

    // Clean up the response - remove markdown code blocks if present
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    try {
      return JSON.parse(cleanText) as CulturalAdvice;
    } catch (parseError) {
      console.warn("⚠️ Failed to parse API response - using fallback");
      return generateFallbackAdvice(origin, destination, gender, scenario);
    }
  } catch (error) {
    console.error("Gemini API Error:", error);

    // Check if it's a network error or timeout
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        console.warn("⚠️ Request timeout - using fallback");
      } else if (error.message.includes('fetch')) {
        console.warn("⚠️ Network error - using fallback");
      }
    }

    // Always return fallback data instead of throwing
    return generateFallbackAdvice(origin, destination, gender, scenario);
  }
};
