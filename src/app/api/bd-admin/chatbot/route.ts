import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const botSetting = await prisma.siteSetting.findUnique({
      where: { key: "ai_bot_config" },
    });

    let config: any = {
      welcomeGreeting: "हर हर महादेव! 🙏 Namaste! I am Banaras AI, your local verified guide.",
      guidanceScope: "Temples, Ghats, Food under ₹150, Parking, Boat Rates, Smart Itineraries",
      customInstructions: "Always provide respectful, culturally grounded information for pilgrims and visitors in Kashi.",
      emergencyContacts: "Tourist Police: 0542-2508000 | National Emergency: 112",
    };

    if (botSetting) {
      try {
        config = { ...config, ...JSON.parse(botSetting.value) };
      } catch {}
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Admin chatbot GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load chatbot configuration." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const config = await req.json();

    await prisma.siteSetting.upsert({
      where: { key: "ai_bot_config" },
      create: {
        key: "ai_bot_config",
        value: JSON.stringify(config),
        category: "AI_BOT",
      },
      update: {
        value: JSON.stringify(config),
        category: "AI_BOT",
      },
    });

    return NextResponse.json({
      success: true,
      message: "AI Chatbot configuration saved successfully.",
    });
  } catch (error) {
    console.error("Admin chatbot POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save chatbot configuration." }, { status: 500 });
  }
}
