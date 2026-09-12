import { cookies } from "next/headers";
import crypto from "crypto";
import { prisma } from "./db";

export const SESSION_COOKIE_NAME = "banaras_session";
export const SESSION_MAX_AGE_DAYS = 30;

export interface AuthUser {
  id: string;
  email: string | null;
  name: string;
  avatar: string | null;
  bio: string | null;
  role: string;
  reputation: number;
  badge: string;
}

/**
 * Hashes a plaintext password using crypto.scryptSync with a cryptographically random salt.
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a salt:hash string using constant-time comparison.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [salt, key] = storedHash.split(":");
    if (!salt || !key) return false;
    const keyBuffer = Buffer.from(key, "hex");
    const derivedKeyBuffer = crypto.scryptSync(password, salt, 64);
    return crypto.timingSafeEqual(keyBuffer, derivedKeyBuffer);
  } catch {
    return false;
  }
}

/**
 * Creates a new persistent database session for a user and returns the token.
 */
export async function createSession(userId: string): Promise<string> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE_DAYS * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
    },
  });

  return token;
}

/**
 * Sets the session cookie using next/headers cookies().
 */
export async function setSessionCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

/**
 * Deletes the session cookie and database session record.
 */
export async function destroySession() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (token) {
      await prisma.session.deleteMany({
        where: { token },
      });
      cookieStore.delete(SESSION_COOKIE_NAME);
    }
  } catch (err) {
    console.error("Error destroying session:", err);
  }
}

/**
 * Retrieves the currently authenticated user from the session cookie.
 * Returns null if no active or valid session exists.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = await prisma.session.findUnique({
      where: { token },
      include: {
        user: {
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
        },
      },
    });

    if (!session) return null;

    // Check expiration
    if (new Date() > session.expiresAt) {
      await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
      return null;
    }

    return session.user;
  } catch (err: unknown) {
    if (err && typeof err === "object" && "digest" in err && err.digest === "DYNAMIC_SERVER_USAGE") {
      throw err;
    }
    console.error("Error retrieving current user:", err);
    return null;
  }
}

/**
 * Helper to assert admin or moderator permission.
 */
export async function requireAdminOrModerator(): Promise<AuthUser | null> {
  const user = await getCurrentUser();
  if (!user || (user.role !== "ADMIN" && user.role !== "MODERATOR")) {
    return null;
  }
  return user;
}

// ----------------------------------------------------
// Admin Brute-Force Rate Limiter & Secure Auth Helper
// ----------------------------------------------------

interface RateLimitEntry {
  count: number;
  lockedUntil: number;
}

const failedAttemptsMap = new Map<string, RateLimitEntry>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000; // 15 minutes

export function checkAdminRateLimit(identifier: string): { allowed: boolean; remainingMinutes?: number } {
  const record = failedAttemptsMap.get(identifier);
  if (!record) return { allowed: true };

  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return { allowed: false, remainingMinutes };
  }

  if (record.lockedUntil <= now && record.lockedUntil > 0) {
    failedAttemptsMap.delete(identifier);
  }

  return { allowed: true };
}

export function recordFailedAdminAttempt(identifier: string): { isLocked: boolean; remainingMinutes?: number } {
  const now = Date.now();
  const record = failedAttemptsMap.get(identifier) || { count: 0, lockedUntil: 0 };
  record.count += 1;

  if (record.count >= MAX_FAILED_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS;
    failedAttemptsMap.set(identifier, record);
    return { isLocked: true, remainingMinutes: 15 };
  }

  failedAttemptsMap.set(identifier, record);
  return { isLocked: false };
}

export function clearFailedAdminAttempts(identifier: string) {
  failedAttemptsMap.delete(identifier);
}

/**
 * Server-side Admin authentication with constant-time verification & generic failure responses.
 */
export async function authenticateAdminUser(identifier: string, password: string): Promise<{ success: boolean; user?: AuthUser; error?: string }> {
  const cleanId = identifier.trim().toLowerCase();

  // 1. Check Rate Limit
  const rateCheck = checkAdminRateLimit(cleanId);
  if (!rateCheck.allowed) {
    return {
      success: false,
      error: `Too many failed login attempts. Access temporarily locked for ${rateCheck.remainingMinutes} minutes.`,
    };
  }

  // 2. Find user by email or name/id
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: cleanId },
        { name: { equals: identifier.trim() } },
      ],
      role: { in: ["ADMIN", "MODERATOR"] },
    },
  });

  if (!user || !user.passwordHash) {
    const lockResult = recordFailedAdminAttempt(cleanId);
    return {
      success: false,
      error: lockResult.isLocked
        ? "Account locked for 15 minutes due to consecutive failed attempts."
        : "Invalid credentials. Please verify your Admin ID and password.",
    };
  }

  // 3. Verify Password using constant-time hash comparison
  const isValid = verifyPassword(password, user.passwordHash);
  if (!isValid) {
    const lockResult = recordFailedAdminAttempt(cleanId);
    return {
      success: false,
      error: lockResult.isLocked
        ? "Account locked for 15 minutes due to consecutive failed attempts."
        : "Invalid credentials. Please verify your Admin ID and password.",
    };
  }

  // 4. Success: Clear rate limit record, create persistent session
  clearFailedAdminAttempts(cleanId);
  const token = await createSession(user.id);
  await setSessionCookie(token);

  return {
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      bio: user.bio,
      role: user.role,
      reputation: user.reputation,
      badge: user.badge,
    },
  };
}
