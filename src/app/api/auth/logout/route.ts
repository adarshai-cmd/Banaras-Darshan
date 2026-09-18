import { NextResponse } from "next/server";
import { destroySession, SESSION_COOKIE_NAME } from "@/lib/auth";
import { signOutWithSupabase } from "@/lib/supabase";

export async function POST() {
  try {
    await signOutWithSupabase().catch(() => {});
    await destroySession();

    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully.",
    });

    response.cookies.set(SESSION_COOKIE_NAME, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed." },
      { status: 500 }
    );
  }
}
