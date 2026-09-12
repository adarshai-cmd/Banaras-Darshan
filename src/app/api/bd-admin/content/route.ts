import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const settings = await prisma.siteSetting.findMany();
    const settingsMap: Record<string, any> = {};

    for (const s of settings) {
      try {
        settingsMap[s.key] = JSON.parse(s.value);
      } catch {
        settingsMap[s.key] = s.value;
      }
    }

    return NextResponse.json({ success: true, settings: settingsMap, raw: settings });
  } catch (error) {
    console.error("Admin content GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load website content settings." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { key, value, category = "GENERAL" } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ success: false, error: "Setting key and value are required." }, { status: 400 });
    }

    const stringValue = typeof value === "string" ? value : JSON.stringify(value);

    const setting = await prisma.siteSetting.upsert({
      where: { key },
      create: {
        key,
        value: stringValue,
        category,
      },
      update: {
        value: stringValue,
        category,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Setting '${key}' saved successfully.`,
      setting,
    });
  } catch (error) {
    console.error("Admin content POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save website content setting." }, { status: 500 });
  }
}
