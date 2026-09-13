import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";
import {
  isSupabaseConfigured,
  testSupabaseConnectivity,
  adminCreateSupabaseUser,
  adminListSupabaseUsers,
  getSupabaseConfig,
} from "@/lib/supabase";

/**
 * POST /api/bd-admin/users/sync
 * Tests Supabase connectivity and optionally syncs local users into Supabase Auth
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { action = "test" } = body;

    // 1. Run live connectivity test
    const testResult = await testSupabaseConnectivity();

    if (action === "test") {
      return NextResponse.json({
        success: true,
        testResult,
      });
    }

    if (action === "sync") {
      if (!testResult.connected) {
        return NextResponse.json({
          success: false,
          error: `Cannot sync: Supabase is not reachable. ${testResult.message}`,
          testResult,
        }, { status: 400 });
      }

      // Fetch all local users
      const localUsers = await prisma.user.findMany();
      let syncedCount = 0;
      let skippedCount = 0;
      const errors: string[] = [];

      // Fetch existing Supabase Auth users to prevent duplicates
      const sbUsersRes = await adminListSupabaseUsers();
      const existingSbEmails = new Set(
        sbUsersRes.users.map((u) => (u.email || "").toLowerCase())
      );

      for (const u of localUsers) {
        if (!u.email) continue;
        const normalized = u.email.toLowerCase();

        if (existingSbEmails.has(normalized)) {
          skippedCount++;
          continue;
        }

        // Generate a standard temporary sync password if not available
        const tempPassword = "BanarasUser@" + Math.floor(100000 + Math.random() * 900000);
        const createRes = await adminCreateSupabaseUser(normalized, tempPassword, {
          name: u.name,
          role: u.role,
          badge: u.badge,
        });

        if (createRes.success) {
          syncedCount++;
        } else {
          errors.push(`${u.name} (${u.email}): ${createRes.error}`);
        }
      }

      return NextResponse.json({
        success: true,
        message: `Sync completed: ${syncedCount} new user(s) synced to Supabase Auth, ${skippedCount} already present.`,
        syncedCount,
        skippedCount,
        errors: errors.slice(0, 10),
        testResult,
      });
    }

    return NextResponse.json({
      success: true,
      testResult,
    });
  } catch (error: any) {
    console.error("Supabase sync error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Sync failed." },
      { status: 500 }
    );
  }
}
