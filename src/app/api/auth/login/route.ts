import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, hashPassword, createSession, setSessionCookie, SESSION_COOKIE_NAME, SESSION_MAX_AGE_DAYS } from "@/lib/auth";
import { isSupabaseConfigured, signInWithSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email/User ID and password are required." },
        { status: 400 }
      );
    }

    const rawIdentifier = email.trim();
    const normalizedEmail = rawIdentifier.toLowerCase();
    const fallbackDomainEmail = rawIdentifier.includes("@")
      ? normalizedEmail
      : `${normalizedEmail.replace(/[^a-z0-9._-]/g, "")}@banarasdarshan.com`;

    // 1. Find user in local database by Email, Name, or ID
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { email: fallbackDomainEmail },
          { name: { equals: rawIdentifier } },
          { id: rawIdentifier },
        ],
      },
    });

    let authenticated = false;

    // 2. If user found locally, verify password hash
    if (user && user.passwordHash) {
      authenticated = verifyPassword(password, user.passwordHash);
    }

    // 3. If not authenticated locally or user not in local DB, attempt Supabase Auth if configured
    if (!authenticated && isSupabaseConfigured()) {
      const emailToTry = rawIdentifier.includes("@") ? normalizedEmail : fallbackDomainEmail;
      try {
        const sbResult = await signInWithSupabase(emailToTry, password);
        if (sbResult.success && sbResult.user) {
          authenticated = true;
          // Sync or create local user record from Supabase
          if (!user) {
            user = await prisma.user.create({
              data: {
                id: sbResult.user.id,
                name: sbResult.user.user_metadata?.name || rawIdentifier,
                email: sbResult.user.email || emailToTry,
                passwordHash: hashPassword(password),
                role: sbResult.user.user_metadata?.role || "USER",
                reputation: 10,
                badge: "New Explorer",
              },
            });
          } else {
            // Update local password hash to match Supabase
            await prisma.user.update({
              where: { id: user.id },
              data: { passwordHash: hashPassword(password) },
            });
          }
        }
      } catch (sbErr) {
        console.warn("Supabase auth verification attempt:", sbErr);
      }
    }

    if (!authenticated || !user) {
      return NextResponse.json(
        { error: "Invalid Email/User ID or password. Please verify your credentials." },
        { status: 401 }
      );
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      reputation: user.reputation,
      badge: user.badge,
    };

    // 4. Create persistent session and set cookie
    const token = await createSession(safeUser);
    await setSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully.",
      user: safeUser,
      supabaseConnected: isSupabaseConfigured(),
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
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error?.message || "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
