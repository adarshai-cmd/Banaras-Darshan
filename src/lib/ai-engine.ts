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
  detectedLanguage?: "hi" | "en" | "hinglish";
}

export type LanguageOption = "auto" | "hi" | "en" | "bilingual";

/**
 * Detect whether text is in Hindi (Devanagari) or contains common Hindi romanized words
 */
function detectLanguage(text: string): "hi" | "hinglish" | "en" {
  // Check for Devanagari script
  const devanagariRegex = /[\u0900-\u097F]/;
  if (devanagariRegex.test(text)) {
    return "hi";
  }

  // Check for common Romanized Hindi / Hinglish terms
  const hinglishTokens = [
    "kashi", "kaha", "kahan", "kaise", "kab", "kitna", "kitne", "batao",
    "bataiye", "chahiye", "mandir", "darshan", "aarti", "subah", "shaam",
    "raasta", "naav", "kiraya", "khana", "nashta", "jalebi", "kachori",
    "ghat", "samay", "mahadev", "prasad", "puja", "paan", "chai", "achha",
    "sasta", "accha", "dham", "kripya", "namaste", "pranam"
  ];

  const lower = text.toLowerCase();
  const words = lower.split(/\s+/);
  const matchCount = words.filter((w) => hinglishTokens.includes(w)).length;

  if (matchCount >= 2 || (words.length <= 4 && matchCount >= 1)) {
    return "hinglish";
  }

  return "en";
}

/**
 * Calls Google Gemini API with system instructions for Kashi tourism & dual Hindi/English fluency
 */
async function callGeminiAPI(
  apiKey: string,
  userQuestion: string,
  placesContext: string,
  targetLang: "hi" | "en" | "hinglish" | "bilingual"
): Promise<string | null> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`;

  let langInstruction = "";
  if (targetLang === "hi") {
    langInstruction = `Reply in pure, respectful, culturally rich Hindi in Devanagari script (देवनागरी लिपि). Use traditional Kashi warmth (e.g., 'हर हर महादेव! 🙏', 'काशी में आपका स्वागत है').`;
  } else if (targetLang === "hinglish" || targetLang === "bilingual") {
    langInstruction = `Reply in natural, friendly Hinglish or bilingual format (Hindi + English key points) that Indian travelers and pilgrims feel most comfortable with.`;
  } else {
    langInstruction = `Reply in polished, welcoming English, weaving in authentic cultural expressions (e.g. 'Har Har Mahadev', 'Subah-e-Banaras', 'Ganga Aarti').`;
  }

  const systemInstructionText = `You are "Banaras AI" (बनारस एआई), the official, deeply knowledgeable, respectful, and authentic digital guide for Kashi (Varanasi), powered by verified heritage data.

CORE ROLE:
- You help pilgrims, backpackers, families, and travelers discover the sacred geography, living traditions, ghats, temples, food culture, and logistics of Varanasi.
- Greet the user respectfully with "हर हर महादेव! 🙏" or "Namaste from Kashi!".

LANGUAGE DIRECTIVE:
${langInstruction}
- You MUST be completely fluent in Hindi (हिंदी), English, and natural conversational Hinglish.
- If the user writes in Devanagari Hindi, ALWAYS reply in respectful Hindi.
- If the user writes in English, reply in English.
- If the user writes in Hinglish, reply in natural conversational Hinglish.

CONTENT RULES:
- Ground your advice in the provided VERIFIED KASHI DATABASE records whenever applicable.
- Give concrete, practical details: temple locker policies (no leather/phones at Kashi Vishwanath Gate 4), ghat Aarti timings (6:30 PM at Dashashwamedh), official boat fares (₹150-200 shared bajra), and food gems (Ram Bhandar kachori before 10 AM, Kashi Chaat Bhandar tamatar chaat).
- Keep replies structured, concise, and easy to read on mobile. Avoid robotic disclaimers.`;

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
      temperature: 0.7,
      maxOutputTokens: 1200,
    },
  };

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12000), // 12 second timeout
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

  // 1. Determine Effective Target Language
  let targetLang: "hi" | "en" | "hinglish" | "bilingual";
  if (languagePreference === "hi") {
    targetLang = "hi";
  } else if (languagePreference === "en") {
    targetLang = "en";
  } else if (languagePreference === "bilingual") {
    targetLang = "bilingual";
  } else {
    // Auto-detect based on question
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
      image: true,
      popularDishes: true,
      visitingTips: true,
      safetyNotes: true,
      tags: true,
      sourceName: true,
    },
  });

  // 3. Database Retrieval Filter
  const hasBudgetUnder150 =
    query.includes("150") ||
    query.includes("100") ||
    query.includes("cheap") ||
    query.includes("budget") ||
    query.includes("सस्ता") ||
    query.includes("बजट");
  const isBreakfast =
    query.includes("breakfast") ||
    query.includes("morning") ||
    query.includes("subah") ||
    query.includes("kachori") ||
    query.includes("नाश्ता") ||
    query.includes("कचौड़ी");
  const isFood =
    query.includes("food") ||
    query.includes("chaat") ||
    query.includes("lassi") ||
    query.includes("paan") ||
    query.includes("eat") ||
    query.includes("खाना") ||
    query.includes("चाट") ||
    query.includes("लस्सी") ||
    query.includes("पान") ||
    isBreakfast;
  const isGhat =
    query.includes("ghat") ||
    query.includes("boat") ||
    query.includes("sunset") ||
    query.includes("sunrise") ||
    query.includes("aarti") ||
    query.includes("river") ||
    query.includes("घाट") ||
    query.includes("आरती") ||
    query.includes("नाव");
  const isTemple =
    query.includes("temple") ||
    query.includes("mandir") ||
    query.includes("darshan") ||
    query.includes("shiva") ||
    query.includes("vishwanath") ||
    query.includes("bhairav") ||
    query.includes("hanuman") ||
    query.includes("मंदिर") ||
    query.includes("दर्शन") ||
    query.includes("विश्वनाथ");
  const isStay =
    query.includes("hotel") ||
    query.includes("hostel") ||
    query.includes("stay") ||
    query.includes("guesthouse") ||
    query.includes("होटल") ||
    query.includes("रुकने");
  const isNearAssi =
    query.includes("assi") ||
    query.includes("lanka") ||
    query.includes("bhu") ||
    query.includes("अस्सी");
  const isNearGodowlia =
    query.includes("godowlia") ||
    query.includes("chowk") ||
    query.includes("dashashwamedh") ||
    query.includes("गोदौलिया") ||
    query.includes("दशाश्वमेध");

  let matchedPlaces = allPlaces.filter((p) => {
    let score = 0;
    const placeText = `${p.name} ${p.hindiName || ""} ${p.tagline} ${p.description} ${p.area} ${p.tags} ${p.popularDishes || ""}`.toLowerCase();

    if (isFood && p.category === "FOOD") score += 3;
    if (isGhat && p.category === "GHAT") score += 3;
    if (isTemple && p.category === "TEMPLE") score += 3;
    if (isStay && p.category === "HOTEL") score += 3;
    if (isNearAssi && (p.area.toLowerCase().includes("assi") || p.area.toLowerCase().includes("lanka"))) score += 4;
    if (isNearGodowlia && (p.area.toLowerCase().includes("godowlia") || p.area.toLowerCase().includes("chowk"))) score += 4;

    const terms = query.split(/\s+/).filter((t) => t.length > 2);
    for (const term of terms) {
      if (placeText.includes(term)) score += 2;
    }

    return score > 0;
  });

  if (matchedPlaces.length === 0) {
    matchedPlaces = allPlaces.slice(0, 4);
  }

  // 4. Try Google Gemini API if API key is present
  const geminiApiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (geminiApiKey && geminiApiKey.trim()) {
    // Build context snippet for Gemini
    const placesContext = matchedPlaces
      .slice(0, 6)
      .map(
        (p) =>
          `• [${p.category}] ${p.name} (${p.hindiName || ""}) | Area: ${p.area} | Budget: ${p.approxBudget} | Best Time: ${p.bestTimeToVisit || "All Day"} | Highlights: ${p.tagline} | Tips: ${p.visitingTips || "None"}`
      )
      .join("\n");

    const geminiReply = await callGeminiAPI(
      geminiApiKey.trim(),
      userQuestion,
      placesContext,
      targetLang
    );

    if (geminiReply) {
      // Build dynamic suggested prompts matching the target language
      const isHi = targetLang === "hi" || targetLang === "hinglish";
      const suggestedPrompts = isHi
        ? [
            "काशी विश्वनाथ में मंगला आरती का समय क्या है?",
            "दशाश्वमेध घाट पर शाम की गंगा आरती कितने बजे होती है?",
            "अस्सी घाट से दशाश्वमेध नाव का सही किराया कितना है?",
            "₹150 के अंदर सबसे प्रसिद्ध बनारसी नाश्ता (कचौड़ी-जलेबी)?",
          ]
        : [
            "Best breakfast under ₹150 near Godowlia?",
            "What is the evening Aarti timing at Dashashwamedh Ghat?",
            "How much does a boat ride cost from Assi to Dashashwamedh?",
            "What are the locker rules at Kashi Vishwanath Temple?",
          ];

      return {
        reply: geminiReply,
        contextSources: [
          "Google Gemini 3.6 Multilingual Engine",
          "Banaras Darshan 100% Verified Heritage & Places Directory",
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
        detectedLanguage: targetLang === "hi" ? "hi" : targetLang === "hinglish" ? "hinglish" : "en",
      };
    }
  }

  // 5. Fallback: Local Verified Synthesis Engine (Offline / Backup)
  const isHindiResponse = targetLang === "hi" || targetLang === "hinglish";

  if (isBreakfast || (isFood && hasBudgetUnder150)) {
    const breakfastSpots = allPlaces.filter(
      (p) =>
        p.category === "FOOD" &&
        (p.tags.toLowerCase().includes("breakfast") ||
          p.name.includes("Ram Bhandar") ||
          p.name.includes("Kashi Chaat"))
    );

    const reply = isHindiResponse
      ? `**सत्यापित बनारसी नाश्ता एवं बजट फूड गाइड (₹150 से कम):**\n\n` +
        `पुराने बनारस की गलियों में सुबह के नाश्ते के प्रसिद्ध स्थान:\n` +
        `• **राम भंडार (ठठेरी बाज़ार, चौक):** बनारस का सबसे प्रतिष्ठित देसी घी का नाश्ता। खस्ता उड़द दाल की कचौड़ी, तीखी हींग-चने की सब्ज़ी और गरमा-गरम केसरिया जलेबी पत्तल पर परोसी जाती है। सुबह 7:30 बजे तक पहुँचें (~₹70-90)।\n` +
        `• **काशी चाट भंडार (गोदौलिया / गिरजा घर):** देसी घी में बनी गरमा-गरम प्रसिद्ध **टमाटर चाट** और कुरकुरी पालक पत्ता चाट (~₹140)।\n` +
        `• **ब्लू लस्सी शॉप (मणिकर्णिका के पास):** मिट्टी के कुल्हड़ में ताज़ा फलों के साथ मलाईदार लस्सी (~₹100)।\n\n` +
        `*सुझाव: बनारस में सुबह कचौड़ी की दुकानें सुबह 6:30 बजे खुलती हैं और 10:30 बजे तक स्टॉक समाप्त हो जाता है।*`
      : `**Verified Banaras Breakfast & Budget Food Guide (< ₹150):**\n\n` +
        `Across the Old City lanes, these are the legendary culinary icons:\n` +
        `• **Ram Bhandar (Thatheri Bazaar, Chowk):** The holy grail of Banaras breakfasts. Crisp desi ghee urad dal kachoris with spiced hing-chana sabzi and sizzling saffron jalebis (~₹70-90).\n` +
        `• **Kashi Chaat Bhandar (Godowlia / Girja Ghar):** Famous for authentic bubbling hot **Tamatar Chaat** cooked in desi ghee with cashews, plus crispy Palak Patta chaat (~₹140).\n` +
        `• **Blue Lassi Shop (near Manikarnika):** Hand-churned thick clay-pot lassis with fresh fruit toppings (~₹100).\n\n` +
        `*Tip: Morning kachori shops usually open at 6:30 AM and wrap up by 10:30 AM.*`;

    return {
      reply,
      contextSources: [
        "Varanasi Food & Heritage Database",
        "Ram Bhandar & Kashi Chaat Bhandar verified timings",
      ],
      suggestedPrompts: isHindiResponse
        ? [
            "असली बनारसी टमाटर चाट में क्या होता है?",
            "सर्दियों में मलइयो कहाँ मिलता है?",
            "दशाश्वमेध घाट के पास सबसे अच्छे रेस्टोरेंट?",
          ]
        : [
            "What is in authentic Banarasi Tamatar Chaat?",
            "Where can I find winter Malaiyo?",
            "Best restaurants near Dashashwamedh Ghat?",
          ],
      relatedPlaces: (breakfastSpots.length > 0 ? breakfastSpots : matchedPlaces)
        .slice(0, 4)
        .map((p) => ({
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
      detectedLanguage: isHindiResponse ? "hi" : "en",
    };
  }

  // Generic fallback
  const reply = isHindiResponse
    ? `**हर हर महादेव!** आपके प्रश्न **"${userQuestion}"** के संदर्भ में सत्यापित जानकारी:\n\n` +
      matchedPlaces
        .slice(0, 3)
        .map(
          (p) =>
            `• **${p.hindiName || p.name}** (${p.area}): ${p.tagline} *अनुमानित खर्च: ${p.approxBudget}*`
        )
        .join("\n\n") +
      `\n\nआप किसी भी मंदिर के दर्शन के नियम, घाट की नाव का किराया या नाश्ते के बारे में विस्तृत जानकारी पूछ सकते हैं!`
    : `**Har Har Mahadev!** Based on our verified Banaras database for **"${userQuestion}"**:\n\n` +
      matchedPlaces
        .slice(0, 3)
        .map(
          (p) =>
            `• **${p.name}** (${p.area}): ${p.tagline} *Budget: ${p.approxBudget}*`
        )
        .join("\n\n") +
      `\n\nFeel free to ask specific questions about ritual protocols, boat fares, breakfast spots under ₹150, or customized itineraries!`;

  return {
    reply,
    contextSources: ["Banaras Darshan Verified Knowledge Base (19 Verified Places)"],
    suggestedPrompts: isHindiResponse
      ? [
          "काशी विश्वनाथ मंगला आरती का समय क्या है?",
          "अस्सी घाट से दशाश्वमेध नाव का किराया?",
          "₹150 में सुबह का प्रसिद्ध नाश्ता?",
        ]
      : [
          "Best breakfast under ₹150 near Assi Ghat?",
          "Which ghat should I visit at sunset for Aarti?",
          "How to reach Godowlia from Cantt Station?",
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
    detectedLanguage: isHindiResponse ? "hi" : "en",
  };
}
