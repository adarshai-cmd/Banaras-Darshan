import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession, setSessionCookie, SESSION_COOKIE_NAME, SESSION_MAX_AGE_DAYS } from "@/lib/auth";
import { isSupabaseConfigured, signUpWithSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json(
        { error: "Name must be at least 2 characters long." },
        { status: 400 }
      );
    }

    if (!email || typeof email !== "string" || email.trim().length < 3) {
      return NextResponse.json(
        { error: "Please enter a valid Email Address or User ID." },
        { status: 400 }
      );
    }

    if (!password || typeof password !== "string" || password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters long." },
        { status: 400 }
      );
    }

    const rawIdentifier = email.trim();
    // Normalize identifier: if user enters 'adarsh' without '@', convert to clean unique email format
    const normalizedEmail = rawIdentifier.includes("@")
      ? rawIdentifier.toLowerCase()
      : `${rawIdentifier.toLowerCase().replace(/[^a-z0-9._-]/g, "")}@banarasdarshan.com`;

    // Check if email or username already exists in database
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { name: { equals: name.trim() } },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email or username already exists. Please sign in." },
        { status: 409 }
      );
    }

    // 1. If Supabase is configured, create the user in Supabase Auth
    let supabaseUserId: string | null = null;
    let supabaseSyncError: string | null = null;

    if (isSupabaseConfigured()) {
      try {
        const sbResult = await signUpWithSupabase(normalizedEmail, password, {
          name: name.trim(),
          role: "USER",
        });

        if (sbResult.success && sbResult.user) {
          supabaseUserId = sbResult.user.id;
        } else if (sbResult.error) {
          console.warn("Supabase Auth notice during signup:", sbResult.error);
          supabaseSyncError = sbResult.error;
        }
      } catch (sbErr) {
        console.warn("Supabase Auth exception during signup:", sbErr);
      }
    }

    // 2. Create user in Prisma DB (using Supabase UUID if available, else Prisma CUID)
    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        ...(supabaseUserId ? { id: supabaseUserId } : {}),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: "USER",
        reputation: 10,
        badge: "New Explorer",
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        reputation: true,
        badge: true,
      },
    });

    // 3. Create session and set cookie
    const token = await createSession(user);
    await setSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully. Welcome to Banaras Darshan!",
      user,
      supabaseConnected: Boolean(supabaseUserId),
      ...(supabaseSyncError ? { supabaseNote: supabaseSyncError } : {}),
    });

    // Explicitly reinforce session cookie on outgoing response
    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to create account. Please try again." },
      { status: 500 }
    );
  }
}
