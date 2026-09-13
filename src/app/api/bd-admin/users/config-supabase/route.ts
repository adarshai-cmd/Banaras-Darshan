import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";
import {
  setRuntimeSupabaseCredentials,
  getSupabaseConfig,
  testSupabaseConnectivity,
} from "@/lib/supabase";
import fs from "fs";
import path from "path";

/**
 * GET /api/bd-admin/users/config-supabase
 * Returns current Supabase config values (masking secret keys for safety)
 */
export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const config = getSupabaseConfig();

    return NextResponse.json({
      success: true,
      url: config.url,
      hasAnonKey: Boolean(config.anonKey),
      anonKeyPreview: config.anonKey ? `${config.anonKey.slice(0, 12)}...${config.anonKey.slice(-6)}` : "",
      hasServiceRoleKey: Boolean(config.serviceRoleKey),
      serviceRoleKeyPreview: config.serviceRoleKey ? `${config.serviceRoleKey.slice(0, 12)}...${config.serviceRoleKey.slice(-6)}` : "",
      isConfigured: config.isConfigured,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message }, { status: 500 });
  }
}

/**
 * POST /api/bd-admin/users/config-supabase
 * Save Supabase credentials to runtime, SiteSettings, and .env file
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { url = "", anonKey = "", serviceRoleKey = "" } = body;

    const cleanUrl = url.trim();
    const cleanAnon = anonKey.trim();
    const cleanService = serviceRoleKey.trim();

    // 1. Update runtime cache
    setRuntimeSupabaseCredentials(cleanUrl, cleanAnon, cleanService);

    // 2. Persist in SiteSetting table
    await prisma.siteSetting.upsert({
      where: { key: "supabase_url" },
      create: { key: "supabase_url", value: cleanUrl, category: "SUPABASE" },
      update: { value: cleanUrl, category: "SUPABASE" },
    });
    if (cleanAnon) {
      await prisma.siteSetting.upsert({
        where: { key: "supabase_anon_key" },
        create: { key: "supabase_anon_key", value: cleanAnon, category: "SUPABASE" },
        update: { value: cleanAnon, category: "SUPABASE" },
      });
    }
    if (cleanService) {
      await prisma.siteSetting.upsert({
        where: { key: "supabase_service_role_key" },
        create: { key: "supabase_service_role_key", value: cleanService, category: "SUPABASE" },
        update: { value: cleanService, category: "SUPABASE" },
      });
    }

    // 3. Persist to .env file if it exists
    try {
      const envPath = path.join(process.cwd(), ".env");
      let envContent = fs.existsSync(envPath) ? fs.readFileSync(envPath, "utf8") : "";

      const updateOrAppendEnv = (key: string, val: string) => {
        const regex = new RegExp(`^${key}=.*$`, "m");
        if (regex.test(envContent)) {
          envContent = envContent.replace(regex, `${key}="${val}"`);
        } else {
          envContent += `\n${key}="${val}"`;
        }
      };

      if (cleanUrl) updateOrAppendEnv("NEXT_PUBLIC_SUPABASE_URL", cleanUrl);
      if (cleanAnon) updateOrAppendEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", cleanAnon);
      if (cleanService) updateOrAppendEnv("SUPABASE_SERVICE_ROLE_KEY", cleanService);

      fs.writeFileSync(envPath, envContent.trim() + "\n", "utf8");
    } catch (e) {
      console.warn("Notice: could not update .env directly:", e);
    }

    // 4. Test connectivity
    const testResult = await testSupabaseConnectivity();

    return NextResponse.json({
      success: true,
      message: "Supabase configuration updated successfully.",
      testResult,
    });
  } catch (error: any) {
    console.error("Save Supabase config error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update Supabase configuration." },
      { status: 500 }
    );
  }
}
