import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({
        success: false,
        user: null,
        isAuthenticated: false,
        supabaseConfigured: isSupabaseConfigured(),
      });
    }

    return NextResponse.json({
      success: true,
      user,
      isAuthenticated: true,
      supabaseConfigured: isSupabaseConfigured(),
    });
  } catch (error: any) {
    console.error("Auth me error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user profile", user: null, isAuthenticated: false },
      { status: 500 }
    );
  }
}
