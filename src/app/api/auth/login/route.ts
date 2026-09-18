import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, hashPassword, createSession, setSessionCookie, SESSION_COOKIE_NAME, SESSION_MAX_AGE_DAYS } from "@/lib/auth";
import { isSupabaseConfigured, signInWithSupabase, fetchSupabaseProfile, upsertSupabaseProfile } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email Address or User ID and password are required." },
        { status: 400 }
      );
    }

    const rawIdentifier = email.trim();
    const normalizedEmail = rawIdentifier.toLowerCase();
    const fallbackDomainEmail = rawIdentifier.includes("@")
      ? normalizedEmail
      : `${normalizedEmail.replace(/[^a-z0-9._-]/g, "")}@banarasdarshan.com`;

    const emailToTry = rawIdentifier.includes("@") ? normalizedEmail : fallbackDomainEmail;

    let authenticated = false;
    let authUserRecord: any = null;
    let supabaseErrorDetails: string | null = null;
    let supabaseErrorCode: string | null = null;

    // 1. PRIMARY: Supabase Auth Login (if configured)
    if (isSupabaseConfigured()) {
      try {
        const sbResult = await signInWithSupabase(emailToTry, password);

        if (sbResult.success && sbResult.user) {
          authenticated = true;
          const sbUserId = sbResult.user.id;

          // Fetch profile from Supabase Database
          const sbProfile = await fetchSupabaseProfile(sbUserId);

          const userName =
            sbProfile?.name ||
            sbResult.user.user_metadata?.name ||
            sbResult.user.user_metadata?.full_name ||
            (rawIdentifier.includes("@") ? rawIdentifier.split("@")[0] : rawIdentifier);

          const userRole = sbProfile?.role || sbResult.user.user_metadata?.role || "USER";
          const userBadge = sbProfile?.badge || "New Explorer";
          const userRep = sbProfile?.reputation ?? 10;
          const userAvatar = sbProfile?.avatar_url || sbResult.user.user_metadata?.avatar || null;
          const userBio = sbProfile?.bio || null;

          // Idempotently upsert user in Prisma DB using Supabase Auth UUID
          try {
            authUserRecord = await prisma.user.upsert({
              where: { id: sbUserId },
              create: {
                id: sbUserId,
                name: userName,
                email: sbResult.user.email || emailToTry,
                passwordHash: hashPassword(password),
                role: userRole,
                reputation: userRep,
                badge: userBadge,
                avatar: userAvatar,
                bio: userBio,
              },
              update: {
                name: userName,
                email: sbResult.user.email || emailToTry,
                passwordHash: hashPassword(password),
                role: userRole,
                badge: userBadge,
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
          } catch (dbErr) {
            console.warn("Prisma user sync notice:", dbErr);
            // Fallback to in-memory user object on serverless if DB is read-only
            authUserRecord = {
              id: sbUserId,
              email: sbResult.user.email || emailToTry,
              name: userName,
              avatar: userAvatar,
              bio: userBio,
              role: userRole,
              reputation: userRep,
              badge: userBadge,
            };
          }

          // Ensure profile is recorded in Supabase profiles table
          await upsertSupabaseProfile({
            id: sbUserId,
            email: sbResult.user.email || emailToTry,
            name: userName,
            role: userRole,
            badge: userBadge,
            reputation: userRep,
            avatar_url: userAvatar,
            bio: userBio,
          }).catch(() => {});
        } else if (sbResult.error) {
          supabaseErrorDetails = sbResult.error;
          supabaseErrorCode = sbResult.code || null;
        }
      } catch (sbErr: any) {
        console.warn("Supabase login exception:", sbErr);
        supabaseErrorDetails = sbErr?.message;
      }
    }

    // 2. SECONDARY / FALLBACK: Check Local Database (for offline mode or local admin accounts)
    if (!authenticated) {
      const localUser = await prisma.user.findFirst({
        where: {
          OR: [
            { email: normalizedEmail },
            { email: fallbackDomainEmail },
            { name: { equals: rawIdentifier } },
            { id: rawIdentifier },
          ],
        },
      });

      if (localUser && localUser.passwordHash) {
        const passwordMatches = verifyPassword(password, localUser.passwordHash);
        if (passwordMatches) {
          authenticated = true;
          authUserRecord = {
            id: localUser.id,
            email: localUser.email,
            name: localUser.name,
            avatar: localUser.avatar,
            bio: localUser.bio,
            role: localUser.role,
            reputation: localUser.reputation,
            badge: localUser.badge,
          };
        }
      }
    }

    // 3. Handle Authentication Failures with Clear, Informative Error Messages
    if (!authenticated || !authUserRecord) {
      if (supabaseErrorCode === "email_not_confirmed") {
        return NextResponse.json(
          {
            error: "Your email address has not been confirmed yet. Please verify your email inbox or check your Supabase Auth settings.",
            code: "email_not_confirmed",
          },
          { status: 403 }
        );
      }

      if (supabaseErrorCode === "user_not_found") {
        return NextResponse.json(
          {
            error: "No account found with this email. Please check your credentials or create a new account.",
            code: "user_not_found",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          error: "Invalid Email Address/User ID or password. Please verify your credentials.",
          code: "invalid_credentials",
          ...(supabaseErrorDetails && process.env.NODE_ENV !== "production" ? { debug: supabaseErrorDetails } : {}),
        },
        { status: 401 }
      );
    }

    // 4. Create persistent session and set cookie
    const token = await createSession(authUserRecord);
    await setSessionCookie(token);

    const response = NextResponse.json({
      success: true,
      message: "Logged in successfully.",
      user: authUserRecord,
      supabaseConnected: isSupabaseConfigured(),
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
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: error?.message || "Login failed. Please try again." },
      { status: 500 }
    );
  }
}
