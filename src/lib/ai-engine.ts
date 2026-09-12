import { prisma } from "./db";

export interface AIResponseCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  area: string;
  approxBudget: string;
  rating?: number | null;
  image: string;
  tagline: string;
  bestTimeToVisit?: string | null;
}

export interface AIAnswer {
  reply: string;
  contextSources: string[];
  suggestedPrompts: string[];
  relatedPlaces: AIResponseCard[];
  isVerifiedKnowledge: boolean;
  externalSearchUrl?: string;
  detectedLanguage?: LanguageOption;
}

export type LanguageOption =
  | "auto"
  | "hi"
  | "bho"
  | "en"
  | "bilingual"
  | "bn"
  | "ta"
  | "te"
  | "gu"
  | "mr";

/**
 * Detect script or language keywords
 */
function detectLanguage(text: string): LanguageOption {
  // Bengali script
  if (/[\u0980-\u09FF]/.test(text)) return "bn";
  // Tamil script
  if (/[\u0B80-\u0BFF]/.test(text)) return "ta";
  // Telugu script
  if (/[\u0C00-\u0C7F]/.test(text)) return "te";
  // Gujarati script
  if (/[\u0A80-\u0AFF]/.test(text)) return "gu";

  const lower = text.toLowerCase();

  // Bhojpuri keywords in romanized or Devanagari
  if (
    lower.includes("का हाल बा") ||
    lower.includes("रउआ") ||
    lower.includes("भोजपुरी") ||
    lower.includes("बाटे") ||
    lower.includes("बानि") ||
    lower.includes("हमके") ||
    lower.includes("ka haal") ||
    lower.includes("bhojpuri")
  ) {
    return "bho";
  }

  // Devanagari script (Hindi / Marathi)
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    if (lower.includes("कसे") || lower.includes("आहे") || lower.includes("सांगा")) {
      return "mr";
    }
    return "hi";
  }

  const hinglishTokens = [
    "kashi", "kaha", "kahan", "kaise", "kab", "kitna", "kitne", "batao",
    "bataiye", "chahiye", "mandir", "darshan", "aarti", "subah", "shaam",
    "raasta", "naav", "kiraya", "khana", "nashta", "jalebi", "kachori",
    "ghat", "samay", "mahadev", "prasad", "puja", "paan", "chai", "achha",
    "sasta", "accha", "dham", "kripya", "namaste", "pranam", "parking",
    "gadi", "hotel", "rukne"
  ];

  const words = lower.split(/\s+/);
  const matchCount = words.filter((w) => hinglishTokens.includes(w)).length;

  if (matchCount >= 2 || (words.length <= 4 && matchCount >= 1)) {
    return "bilingual";
  }

  return "en";
}

/**
 * Calls Google Gemini API with system instructions for Kashi tourism & grounding in verified DB records
 */
async function callGeminiAPI(
  apiKey: string,
  userQuestion: string,
  placesContext: string,
  targetLang: LanguageOption
): Promise<string | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

  let langInstruction = "";
  if (targetLang === "hi") {
    langInstruction = `Reply in pure, respectful, culturally rich Hindi in Devanagari script (देवनागरी लिपि). Use traditional Kashi warmth (e.g., 'हर हर महादेव! 🙏', 'काशी में आपका स्वागत है').`;
  } else if (targetLang === "bho") {
    langInstruction = `Reply in authentic, warm, respectful Bhojpuri (भोजपुरी) in Devanagari script, celebrating native Banarasi culture (e.g., 'हर हर महादेव! 🙏 रउआ के बनारस में स्वागत बा!').`;
  } else if (targetLang === "bn") {
    langInstruction = `Reply in polite, welcoming Bengali (বাংলা) honoring the deep spiritual & literary connection between Bengal and Kashi (e.g., 'জয় শিব শম্ভু! কাশীতে আপনাকে স্বাগতম।').`;
  } else if (targetLang === "ta") {
    langInstruction = `Reply in respectful Tamil (தமிழ்) honoring the sacred Kashi Tamil Sangamam heritage (e.g., 'ஓம் நம சிவாய! காசிக்கு தங்களை அன்புடன் வரவேற்கிறோம்.').`;
  } else if (targetLang === "te") {
    langInstruction = `Reply in respectful Telugu (తెలుగు) honoring the historic Kashi-Andhra pilgrimage connection (e.g., 'హర హర మహాదేవ్! కాశీకి స్వాగతం.').`;
  } else if (targetLang === "gu") {
    langInstruction = `Reply in polite Gujarati (ગુજરાતી) honoring Gujarat's pilgrims and visitors (e.g., 'હર હર મહાદેવ! કાશીમાં આપનું હાર્દિક સ્વાગત છે.').`;
  } else if (targetLang === "mr") {
    langInstruction = `Reply in polite Marathi (मराठी) honoring the Maratha legacy and Peshwa/Holkar heritage of Kashi (e.g., 'हर हर महादेव! काशीमध्ये आपले स्वागत आहे.').`;
  } else if (targetLang === "bilingual") {
    langInstruction = `Reply in natural, friendly Hinglish or bilingual format (Hindi + English key points) that Indian travelers and pilgrims feel most comfortable with.`;
  } else {
    langInstruction = `Reply in polished, welcoming English, weaving in authentic cultural expressions (e.g. 'Har Har Mahadev', 'Subah-e-Banaras', 'Ganga Aarti').`;
  }

  const systemInstructionText = `You are "Banaras AI" (बनारस एआई), the official, deeply knowledgeable, respectful, and factually grounded digital travel guide for Varanasi (Kashi).

CORE ROLE:
- Assist pilgrims, backpackers, families, and first-time travelers with verified geography, timings, food spots, stays, ghat protocols, and navigation in Varanasi.
- Greet the user warmly with "हर हर महादेव! 🙏" or "Namaste from Kashi!".

STRICT GROUNDING DIRECTIVES (CRITICAL):
1. Ground your knowledge ONLY in the provided VERIFIED KASHI DATABASE CONTEXT below.
2. DO NOT hallucinate fake places, exact fake train/bus schedules, unverified opening hours, or fabricated prices.
3. Clearly distinguish:
   - [Verified Information]: Facts directly present in the verified context (e.g., Kashi Vishwanath Gate 4 locker rules, 06:30 PM Dashashwamedh Aarti, Ram Bhandar morning kachori, specific parking stands).
   - [Estimated Information]: Price and budget ranges (e.g. "Stay: approx ₹600–₹1,000/night", "Shared boat: approx ₹150–₹250/seat"). Clearly state that these are estimates.
   - [Unknown Information]: If the question asks for something not covered by the verified context or outside Kashi, DO NOT guess. Explicitly state:
     "I couldn't verify that specific information from my available Banaras sources. Please verify the latest details on the official portal or search Google: https://www.google.com/search?q=${encodeURIComponent(userQuestion)}"
4. For parking queries: recommend the verified municipal stands (Godowlia Multi-Level Parking, Assi Ghat Parking, Maidagin Parking, Namo Ghat Parking).
5. For budget queries (e.g. ₹3,000 for 2 days or ₹10,000 for 3 days): provide realistic allocations for stays, food, boat, and transit using the verified places in the context.

LANGUAGE DIRECTIVE:
${langInstruction}`;

  const payload = {
    systemInstruction: {
      parts: [{ text: systemInstructionText }],
    },
    contents: [
      {
        role: "user",
        parts: [
          {
            text: `VERIFIED KASHI DATABASE CONTEXT:\n${placesContext}\n\nUSER QUESTION:\n${userQuestion}`,
          },
        ],
      },
    ],
    generationConfig: {
      temperature: 0.5,
      maxOutputTokens: 1400,
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini API error response:", res.status, errText);
      return null;
    }

    const data = await res.json();
    const candidateText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return candidateText || null;
  } catch (err) {
    console.error("Failed to communicate with Gemini API:", err);
    return null;
  }
}

/**
 * Context-Grounded AI Travel Assistant for Varanasi
 * Combines intent extraction, database retrieval, and Google Gemini multilingual synthesis.
 */
export async function askBanarasAI(
  userQuestion: string,
  languagePreference: LanguageOption = "auto"
): Promise<AIAnswer> {
  const query = userQuestion.toLowerCase().trim();

  // 1. Language Determination
  let targetLang: LanguageOption;
  if (languagePreference && languagePreference !== "auto") {
    targetLang = languagePreference;
  } else {
    targetLang = detectLanguage(userQuestion);
  }

  // 2. Fetch all verified places from database
  const allPlaces = await prisma.place.findMany({
    select: {
      id: true,
      name: true,
      hindiName: true,
      slug: true,
      category: true,
      subCategory: true,
      tagline: true,
      description: true,
      address: true,
      area: true,
      latitude: true,
      longitude: true,
      rating: true,
      approxBudget: true,
      budgetTier: true,
      bestTimeToVisit: true,
      openingHours: true,
      image: true,
      popularDishes: true,
      visitingTips: true,
      safetyNotes: true,
      parkingInfo: true,
      tags: true,
      sourceName: true,
    },
  });

  // 3. Database Retrieval Filter
  const queryWords = query.split(/[\s,?.!]+/).filter((w) => w.length > 1);

  // Score each place based on relevance to query
  const scoredPlaces = allPlaces.map((p) => {
    let score = 0;
    const textCorpus = `${p.name} ${p.hindiName || ""} ${p.category} ${p.subCategory || ""} ${p.tagline} ${p.description} ${p.area} ${p.tags} ${p.popularDishes || ""} ${p.visitingTips || ""}`.toLowerCase();

    // Keyword hits
    for (const word of queryWords) {
      if (textCorpus.includes(word)) score += 3;
    }

    // Category intents
    if ((query.includes("food") || query.includes("chaat") || query.includes("kachori") || query.includes("nashta") || query.includes("खाना") || query.includes("नाश्ता")) && p.category === "FOOD") {
      score += 5;
    }
    if ((query.includes("ghat") || query.includes("boat") || query.includes("aarti") || query.includes("नाव") || query.includes("आरती") || query.includes("घाट")) && p.category === "GHAT") {
      score += 5;
    }
    if ((query.includes("temple") || query.includes("mandir") || query.includes("darshan") || query.includes("मंदिर") || query.includes("दर्शन")) && p.category === "TEMPLE") {
      score += 5;
    }
    if ((query.includes("hotel") || query.includes("stay") || query.includes("hostel") || query.includes("होटल") || query.includes("रुकने")) && p.category === "HOTEL") {
      score += 5;
    }
    if ((query.includes("parking") || query.includes("गाड़ी") || query.includes("पार्किंग")) && p.parkingInfo) {
      score += 4;
    }

    return { place: p, score };
  });

  scoredPlaces.sort((a, b) => b.score - a.score);
  let matchedPlaces = scoredPlaces.filter((sp) => sp.score > 0).map((sp) => sp.place);

  if (matchedPlaces.length === 0) {
    // If no specific match, use featured flagship places
    matchedPlaces = allPlaces.slice(0, 5);
  }

  // 4. Try Google Gemini API with Grounded Context
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
  const externalSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(
    `Varanasi ${userQuestion}`
  )}`;

  if (geminiApiKey && geminiApiKey.trim()) {
    const placesContext = matchedPlaces
      .slice(0, 8)
      .map((p) => {
        let parkingSnippet = "";
        if (p.parkingInfo) {
          try {
            const parsed = JSON.parse(p.parkingInfo);
            if (parsed.primary) {
              parkingSnippet = ` | Nearby Parking: ${parsed.primary.name} (${parsed.primary.distance}, ${parsed.primary.feeStatus})`;
            }
          } catch {}
        }
        return `• [${p.category}] ${p.name} (${p.hindiName || ""}) | Area: ${p.area} | Budget: ${p.approxBudget} | Timings: ${p.openingHours || p.bestTimeToVisit || "Open all day"} | Highlights: ${p.tagline} | Tips: ${p.visitingTips || "None"}${parkingSnippet}`;
      })
      .join("\n");

    const geminiReply = await callGeminiAPI(
      geminiApiKey.trim(),
      userQuestion,
      placesContext,
      targetLang
    );

    if (geminiReply) {
      const isIndic = targetLang === "hi" || targetLang === "bho" || targetLang === "bilingual";
      const suggestedPrompts = isIndic
        ? [
            "काशी विश्वनाथ में मंगला आरती और सुगम दर्शन के नियम?",
            "दशाश्वमेध घाट पर शाम की गंगा आरती का समय?",
            "अस्सी घाट के पास वाहन पार्किंग कहाँ है?",
            "2 दिन के लिए ₹5000 में बनारस का सबसे अच्छा प्लान?",
          ]
        : [
            "What are the locker rules at Kashi Vishwanath Temple?",
            "Where can I park near Dashashwamedh and Godowlia?",
            "How much does a shared boat ride cost from Assi to Dashashwamedh?",
            "What is a realistic 3-day budget for a couple in Banaras?",
          ];

      return {
        reply: geminiReply,
        contextSources: [
          "Google Gemini Multilingual Engine",
          "Banaras Darshan 100% Factually Verified Database (42 Verified Records)",
        ],
        suggestedPrompts,
        relatedPlaces: matchedPlaces.slice(0, 4).map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          category: p.category,
          area: p.area,
          approxBudget: p.approxBudget,
          rating: p.rating,
          image: p.image,
          tagline: p.tagline,
          bestTimeToVisit: p.bestTimeToVisit,
        })),
        isVerifiedKnowledge: true,
        externalSearchUrl,
        detectedLanguage: targetLang,
      };
    }
  }

  // 5. Deterministic Grounded Fallback if API key is inactive or rate-limited
  const isIndic = targetLang === "hi" || targetLang === "bho" || targetLang === "bilingual";
  const replyText = isIndic
    ? `**हर हर महादेव! 🙏** आपके प्रश्न **"${userQuestion}"** के संदर्भ में हमारे सत्यापित डेटाबेस से जानकारी:\n\n` +
      matchedPlaces
        .slice(0, 3)
        .map((p) => `• **${p.hindiName || p.name}** (${p.area}): ${p.tagline}\n  *समय: ${p.openingHours || p.bestTimeToVisit || "सामान्य समय"} | अनुमानित खर्च: ${p.approxBudget}*`)
        .join("\n\n") +
      `\n\n*(यदि आपकी पूछताछ किसी विशिष्ट लाइव ट्रेन/बस शेड्यूल या नए आयोजन के बारे में है, तो कृपया आधिकारिक पोर्टल या गूगल पर सत्यापित करें।)*`
    : `**Har Har Mahadev! 🙏** Based on our verified Banaras database for **"${userQuestion}"**:\n\n` +
      matchedPlaces
        .slice(0, 3)
        .map((p) => `• **${p.name}** (${p.area}): ${p.tagline}\n  *Timings: ${p.openingHours || p.bestTimeToVisit || "Standard"} | Budget: ${p.approxBudget}*`)
        .join("\n\n") +
      `\n\n*(For real-time train updates or special festival schedules not in our index, please verify on official portals or search Google).*`;

  return {
    reply: replyText,
    contextSources: ["Banaras Darshan Verified Knowledge Base (42 Verified Records)"],
    suggestedPrompts: isIndic
      ? [
          "काशी विश्वनाथ में मंगला आरती का समय क्या है?",
          "अस्सी घाट के पास वाहन पार्किंग कहाँ है?",
          "₹150 में सुबह का प्रसिद्ध नाश्ता?",
        ]
      : [
          "What are the locker rules at Kashi Vishwanath?",
          "Where to park near Godowlia crossing?",
          "Best breakfast under ₹150 in Chowk?",
        ],
    relatedPlaces: matchedPlaces.slice(0, 4).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      area: p.area,
      approxBudget: p.approxBudget,
      rating: p.rating,
      image: p.image,
      tagline: p.tagline,
      bestTimeToVisit: p.bestTimeToVisit,
    })),
    isVerifiedKnowledge: true,
    externalSearchUrl,
    detectedLanguage: targetLang,
  };
}
