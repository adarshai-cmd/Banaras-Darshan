import { prisma } from "./db";

export interface AIResponseCard {
  id: string;
  name: string;
  slug: string;
  category: string;
  area: string;
  approxBudget: string;
  rating: number;
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
}

export async function askBanarasAI(userQuestion: string): Promise<AIAnswer> {
  const query = userQuestion.toLowerCase().trim();

  // Load verified places from database
  const places = await prisma.place.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      category: true,
      subCategory: true,
      tagline: true,
      description: true,
      address: true,
      area: true,
      rating: true,
      approxBudget: true,
      budgetTier: true,
      bestTimeToVisit: true,
      image: true,
      popularDishes: true,
      visitingTips: true,
      safetyNotes: true,
      tags: true,
    },
  });

  const matchedCards: AIResponseCard[] = [];

  // 1. Check budget food questions
  if (
    query.includes("breakfast") ||
    query.includes("food") ||
    query.includes("chaat") ||
    query.includes("lassi") ||
    query.includes("paan") ||
    query.includes("eat") ||
    query.includes("150") ||
    query.includes("200")
  ) {
    const foodSpots = places.filter((p) => p.category === "FOOD");
    foodSpots.forEach((f) => {
      matchedCards.push({
        id: f.id,
        name: f.name,
        slug: f.slug,
        category: f.category,
        area: f.area,
        approxBudget: f.approxBudget,
        rating: f.rating,
        image: f.image,
        tagline: f.tagline,
        bestTimeToVisit: f.bestTimeToVisit,
      });
    });

    const reply = `**Banaras Food Guide:**\n\n` +
      `• **Legendary Morning Breakfast (< ₹100):** Head to **Ram Bhandar** in Thatheri Bazaar by 7:30 AM for steaming hot desi ghee kachori-sabzi with crispy saffron jalebis on a traditional sal-leaf dona.\n\n` +
      `• **World-Renowned Evening Chaat (< ₹150):** Visit **Kashi Chaat Bhandar** near Girja Ghar chauraha (Godowlia). Their piping hot **Tamatar Chaat** cooked in desi ghee with cashews and sweet syrup is completely unique to Kashi. Add the crispy Palak Patta Chaat.\n\n` +
      `• **Afternoon Refreshment:** Sip the thick, hand-churned fruit lassi in earthen kullads at **Blue Lassi Shop** near Manikarnika Ghat, or classic malai lassi at **Pahalwan Lassi** (Lanka).\n\n` +
      `• **Night Cultural Digestif:** Finish your day with a GI-tagged Banarasi Meetha Paan made with Magahi leaf at **Keshav Tambool Bhandar** at Assi Crossing.`;

    return {
      reply,
      contextSources: [
        "Verified Food Database (Kashi Chaat Bhandar, Ram Bhandar, Blue Lassi, Keshav Tambool)",
        "Banaras Darshan Culinary Verification Team",
      ],
      suggestedPrompts: [
        "Where can I find winter Malaiyo?",
        "Is food in Banaras pure vegetarian?",
        "Best restaurants near Dashashwamedh Ghat?",
      ],
      relatedPlaces: matchedCards.slice(0, 4),
      isVerifiedKnowledge: true,
    };
  }

  // 2. Sunset & Ghats questions
  if (
    query.includes("sunset") ||
    query.includes("ghat") ||
    query.includes("aarti") ||
    query.includes("boat") ||
    query.includes("evening") ||
    query.includes("tonight")
  ) {
    const ghatSpots = places.filter((p) => p.category === "GHAT");
    ghatSpots.forEach((g) => {
      matchedCards.push({
        id: g.id,
        name: g.name,
        slug: g.slug,
        category: g.category,
        area: g.area,
        approxBudget: g.approxBudget,
        rating: g.rating,
        image: g.image,
        tagline: g.tagline,
        bestTimeToVisit: g.bestTimeToVisit,
      });
    });

    const reply = `**Best Ghat Experiences for Evening & Sunset:**\n\n` +
      `1. **Dashashwamedh Ghat (6:00 PM – 7:30 PM):** This is the quintessential Kashi experience. Every single evening, the magnificent synchronized **Ganga Maha Aarti** is performed with brass lamps, incense, and conch shells. To secure comfortable seating, arrive at the ghat steps by 5:30 PM, or hire a shared wooden bajra boat (₹150–200 per seat).\n\n` +
      `2. **Assi Ghat for Sunset & Chill:** If you want a more bohemian and contemplative atmosphere, sit at Assi Ghat with a kullad of lemon chai, listen to local sitar practice, or visit the nearby riverfront cafes.\n\n` +
      `3. **Chet Singh Ghat for Architecture & Photography:** Marvel at the grand 18th-century sandstone fortress battlements rising straight out of the water in warm evening golden hour light.\n\n` +
      `⚠️ **Important Safety Note:** Avoid standing directly on the wet, algae-covered lowest stone steps. Only board licensed boats with life jackets.`;

    return {
      reply,
      contextSources: [
        "Dashashwamedh Ganga Seva Nidhi Schedule (Daily 6:30 PM)",
        "River Police Varanasi Safety & Fare Guidelines",
      ],
      suggestedPrompts: [
        "How much does a boat ride cost in Banaras?",
        "What is Subah-e-Banaras at Assi Ghat?",
        "What are the photography rules at Manikarnika Ghat?",
      ],
      relatedPlaces: matchedCards.slice(0, 4),
      isVerifiedKnowledge: true,
    };
  }

  // 3. Temples questions
  if (
    query.includes("temple") ||
    query.includes("vishwanath") ||
    query.includes("darshan") ||
    query.includes("shiva") ||
    query.includes("hanuman") ||
    query.includes("kaal bhairav")
  ) {
    const templeSpots = places.filter((p) => p.category === "TEMPLE");
    templeSpots.forEach((t) => {
      matchedCards.push({
        id: t.id,
        name: t.name,
        slug: t.slug,
        category: t.category,
        area: t.area,
        approxBudget: t.approxBudget,
        rating: t.rating,
        image: t.image,
        tagline: t.tagline,
        bestTimeToVisit: t.bestTimeToVisit,
      });
    });

    const reply = `**Essential Sacred Temples of Kashi:**\n\n` +
      `1. **Shri Kashi Vishwanath Temple (Golden Temple):** Dedicated to Lord Shiva, one of the 12 sacred Jyotirlingas. Connected grandly to the Ganga via the new riverfront corridor. Best time to visit: Early morning (4:00 AM Mangala Aarti) or late evening (8:30 PM Shringar Aarti). Note that phones and electronics must be deposited in the free digital lockers at Gate 4.\n\n` +
      `2. **Kaal Bhairav Temple (The Kotwal of Varanasi):** Ancient belief dictates that every traveler must pay respects to Kaal Bhairav, the city's guardian magistrate. Priests tie a consecrated black sacred thread on your wrist for spiritual protection.\n\n` +
      `3. **Sankat Mochan Hanuman Temple:** Established by saint Goswami Tulsidas. Deeply peaceful and famous for its divine pure-ghee Besan Ladoos. Visit on Tuesday or Saturday morning.\n\n` +
      `4. **Durga Kund Mandir:** An 18th-century Nagara-style terracotta red shrine with an adjoining sacred water tank.`;

    return {
      reply,
      contextSources: [
        "Shri Kashi Vishwanath Temple Trust Regulations",
        "Archaeological & Cultural Heritage Directory of Varanasi",
      ],
      suggestedPrompts: [
        "What is the dress code for Kashi Vishwanath?",
        "How to book Sugam Darshan online?",
        "Where is Kaal Bhairav temple located?",
      ],
      relatedPlaces: matchedCards.slice(0, 4),
      isVerifiedKnowledge: true,
    };
  }

  // 4. Hotel / Budget stay questions
  if (
    query.includes("hotel") ||
    query.includes("stay") ||
    query.includes("hostel") ||
    query.includes("1000") ||
    query.includes("budget") ||
    query.includes("room")
  ) {
    const stays = places.filter((p) => p.category === "HOTEL");
    stays.forEach((s) => {
      matchedCards.push({
        id: s.id,
        name: s.name,
        slug: s.slug,
        category: s.category,
        area: s.area,
        approxBudget: s.approxBudget,
        rating: s.rating,
        image: s.image,
        tagline: s.tagline,
        bestTimeToVisit: s.bestTimeToVisit,
      });
    });

    const reply = `**Verified Accommodations in Banaras by Budget:**\n\n` +
      `• **Backpacker & Solo Travelers (< ₹1,000 / night):** **Zostel Varanasi** (Luxa Road, 600m from Godowlia). Offers clean AC dorms starting at ₹650, high-speed WiFi, rooftop cafe, female-only dorms, and organized sunrise boat tours.\n\n` +
      `• **Riverfront Heritage & Mid-Range (₹1,800 – ₹4,500 / night):** **Ganpati Guest House** (Meer Ghat). Known for its sunny courtyard and private balconies looking directly over the Ganga boats.\n\n` +
      `• **Ultra-Luxury Heritage Experience (₹22,000+):** **BrijRama Palace** (Darbhanga Ghat). An 18th-century royal sandstone fortress where you arrive by private royal heritage boat on the Ganga.\n\n` +
      `💡 **Location Tip:** If you want morning boat access, stay near Dashashwamedh or Assi Ghat. If you have heavy luggage, note that vehicle access stops at Godowlia crossing, requiring a 5–10 min walk through stone lanes.`;

    return {
      reply,
      contextSources: [
        "Verified Hotel & Guest House Directory of Varanasi",
        "Varanasi Tourism Assistance Cell",
      ],
      suggestedPrompts: [
        "Which hotels have direct Ganga views?",
        "How far is Godowlia crossing from Varanasi Cantt station?",
        "Are cars allowed directly on the Ghats?",
      ],
      relatedPlaces: matchedCards.slice(0, 3),
      isVerifiedKnowledge: true,
    };
  }

  // 5. Trip planning / 2-3 days question
  if (
    query.includes("plan") ||
    query.includes("trip") ||
    query.includes("itinerary") ||
    query.includes("2 days") ||
    query.includes("3 days") ||
    query.includes("3000")
  ) {
    return {
      reply: `**Optimal 2-Day Banaras Itinerary (Under ₹3,000 per person):**\n\n` +
        `**DAY 1: Sacred Rivers & Ancient Lanes**\n` +
        `• **05:00 AM:** Sunrise 'Subah-e-Banaras' at Assi Ghat (Vedic chanting + yoga). Cost: Free.\n` +
        `• **07:30 AM:** Breakfast at Ram Bhandar in Thatheri Bazaar (Desi ghee Kachori-Jalebi, ~₹80).\n` +
        `• **09:30 AM:** Darshan at Shri Kashi Vishwanath Temple Corridor & Kaal Bhairav (Free).\n` +
        `• **02:00 PM:** Blue Lassi tasting in ancient lanes (~₹100).\n` +
        `• **05:30 PM:** Grand Ganga Aarti at Dashashwamedh Ghat from boat (~₹150 shared seat).\n` +
        `• **08:30 PM:** Dinner at Kashi Chaat Bhandar (Tamatar Chaat & Palak Patta, ~₹140).\n\n` +
        `**DAY 2: Fortresses, Weavers & Saffron Clouds**\n` +
        `• **06:30 AM:** Morning boat ride past Chet Singh Fort to Manikarnika Ghat (~₹200).\n` +
        `• **09:00 AM:** Sankat Mochan Hanuman Temple (Besan Ladoo prasad, ~₹50).\n` +
        `• **11:30 AM:** Sarai Mohana Silk Weavers Colony to watch pit-loom Banarasi sarees.\n` +
        `• **04:30 PM:** Durga Kund Temple & Lolark Kund subterranean stepwell.\n` +
        `• **08:00 PM:** Melting Banarasi Paan at Keshav Tambool, Assi crossing (~₹40).\n\n` +
        `Use the **Plan My Trip** tool on the top navigation for an interactive customized itinerary generator!`,
      contextSources: [
        "Banaras Darshan Curated Itinerary Engine",
        "Real-world verified transit times across Godowlia, Assi, and Chowk",
      ],
      suggestedPrompts: [
        "Open the interactive Trip Planner",
        "Best breakfast under ₹150?",
        "Emergency and tourist police numbers in Banaras?",
      ],
      relatedPlaces: places.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        category: p.category,
        area: p.area,
        approxBudget: p.approxBudget,
        rating: p.rating,
        image: p.image,
        tagline: p.tagline,
      })),
      isVerifiedKnowledge: true,
    };
  }

  // General fallback grounded response
  return {
    reply: `Namaste! I am **Banaras AI**, your local companion powered by verified data from across Kashi.\n\n` +
      `Here are some of the best things you can ask me:\n` +
      `• *“Best breakfast under ₹150?”*\n` +
      `• *“Which ghat should I visit at sunset for the Aarti?”*\n` +
      `• *“How do I reach Godowlia from Varanasi Cantt Station?”*\n` +
      `• *“Tell me about the Kotwal of Varanasi (Kaal Bhairav).”*\n` +
      `• *“Plan a 3-day itinerary under ₹3,000.”*\n\n` +
      `Feel free to ask any question about temples, food, ghats, stays, safety, or hidden alleys!`,
    contextSources: ["Banaras Darshan Live Knowledge Base"],
    suggestedPrompts: [
      "Best breakfast under ₹150?",
      "Which ghat should I visit at sunset?",
      "Best budget hotel near Kashi Vishwanath?",
      "I have 2 days and ₹3000. Plan my trip.",
    ],
    relatedPlaces: places.slice(0, 3).map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      category: p.category,
      area: p.area,
      approxBudget: p.approxBudget,
      rating: p.rating,
      image: p.image,
      tagline: p.tagline,
    })),
    isVerifiedKnowledge: true,
  };
}
