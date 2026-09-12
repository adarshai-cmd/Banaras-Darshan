import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const settingRecord = await prisma.siteSetting.findUnique({
      where: { key: "weather_config" },
    });

    let config = {
      enabled: true,
      city: "Varanasi",
      country: "India",
      latitude: 25.3176,
      longitude: 82.9739,
      units: "metric",
      cacheMinutes: 15,
      customTravelInsight: "",
    };

    if (settingRecord) {
      try {
        config = { ...config, ...JSON.parse(settingRecord.value) };
      } catch {}
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Admin weather GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load weather config." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const {
      enabled = true,
      city = "Varanasi",
      country = "India",
      latitude = 25.3176,
      longitude = 82.9739,
      units = "metric",
      cacheMinutes = 15,
      customTravelInsight = "",
    } = body;

    const config = {
      enabled: Boolean(enabled),
      city: city.trim(),
      country: country.trim(),
      latitude: parseFloat(latitude) || 25.3176,
      longitude: parseFloat(longitude) || 82.9739,
      units: units === "imperial" ? "imperial" : "metric",
      cacheMinutes: parseInt(cacheMinutes, 10) || 15,
      customTravelInsight: customTravelInsight?.trim() || "",
    };

    await prisma.siteSetting.upsert({
      where: { key: "weather_config" },
      create: {
        key: "weather_config",
        value: JSON.stringify(config),
        category: "WEATHER",
      },
      update: {
        value: JSON.stringify(config),
        category: "WEATHER",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Weather settings updated successfully.",
      config,
    });
  } catch (error) {
    console.error("Admin weather POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save weather config." }, { status: 500 });
  }
}
