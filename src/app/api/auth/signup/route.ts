import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, createSession, setSessionCookie, SESSION_COOKIE_NAME, SESSION_MAX_AGE_DAYS } from "@/lib/auth";
import { isSupabaseConfigured, signUpWithSupabase, upsertSupabaseProfile } from "@/lib/supabase";

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

    const cleanName = name.trim();
    const rawIdentifier = email.trim();
    const normalizedEmail = rawIdentifier.includes("@")
      ? rawIdentifier.toLowerCase()
      : `${rawIdentifier.toLowerCase().replace(/[^a-z0-9._-]/g, "")}@banarasdarshan.com`;

    // 1. Check if user already exists in local database
    const existingLocalUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { name: { equals: cleanName } },
        ],
      },
    });

    if (existingLocalUser) {
      return NextResponse.json(
        { error: "An account with this email or username already exists. Please sign in." },
        { status: 409 }
      );
    }

    let supabaseUserId: string | null = null;
    let supabaseSyncError: string | null = null;

    // 2. Supabase Auth Integration
    if (isSupabaseConfigured()) {
      try {
        const sbResult = await signUpWithSupabase(normalizedEmail, password, {
          name: cleanName,
          role: "USER",
        });

        if (sbResult.success && sbResult.user) {
          supabaseUserId = sbResult.user.id;
        } else if (sbResult.error) {
          const errMsg = sbResult.error.toLowerCase();
          if (errMsg.includes("already registered") || errMsg.includes("already exists") || errMsg.includes("unique")) {
            return NextResponse.json(
              { error: "An account with this email address already exists in Supabase. Please sign in." },
              { status: 409 }
            );
          }
          console.warn("Supabase Auth notice during signup:", sbResult.error);
          supabaseSyncError = sbResult.error;
        }
      } catch (sbErr: any) {
        console.warn("Supabase Auth exception during signup:", sbErr);
        supabaseSyncError = sbErr?.message || "Supabase connection notice";
      }
    }

    // 3. Create or upsert user in Prisma DB (using Supabase UUID as primary identity)
    const passwordHash = hashPassword(password);
    let user;

    if (supabaseUserId) {
      user = await prisma.user.upsert({
        where: { id: supabaseUserId },
        create: {
          id: supabaseUserId,
          name: cleanName,
          email: normalizedEmail,
          passwordHash,
          role: "USER",
          reputation: 10,
          badge: "New Explorer",
        },
        update: {
          name: cleanName,
          email: normalizedEmail,
          passwordHash,
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

      // Also ensure profile exists in Supabase profiles table
      await upsertSupabaseProfile({
        id: supabaseUserId,
        email: normalizedEmail,
        name: cleanName,
        role: "USER",
        badge: "New Explorer",
        reputation: 10,
      }).catch(() => {});
    } else {
      user = await prisma.user.create({
        data: {
          name: cleanName,
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
    }

    // 4. Create persistent session and set cookie
    const token = await createSession(user);
    await setSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      message: "Account created successfully. Welcome to Banaras Darshan!",
      user,
      supabaseConnected: Boolean(supabaseUserId),
      ...(supabaseSyncError ? { supabaseNote: supabaseSyncError } : {}),
    });

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
