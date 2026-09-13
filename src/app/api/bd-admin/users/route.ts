import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator, hashPassword } from "@/lib/auth";
import {
  isSupabaseConfigured,
  adminCreateSupabaseUser,
  adminUpdateSupabaseUser,
  adminDeleteSupabaseUser,
  getSupabaseConfig,
} from "@/lib/supabase";

/**
 * GET /api/bd-admin/users
 * Returns list of all registered accounts with metadata & Supabase connectivity status
 */
export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        bio: true,
        role: true,
        reputation: true,
        badge: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            sessions: true,
            savedPlaces: true,
            trips: true,
          },
        },
      },
    });

    const supabaseConfig = getSupabaseConfig();

    return NextResponse.json({
      success: true,
      users,
      totalCount: users.length,
      supabaseStatus: {
        isConfigured: supabaseConfig.isConfigured,
        url: supabaseConfig.url,
        hasAnonKey: Boolean(supabaseConfig.anonKey),
        hasServiceRoleKey: Boolean(supabaseConfig.serviceRoleKey),
      },
    });
  } catch (error: any) {
    console.error("Admin list users error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch users." },
      { status: 500 }
    );
  }
}

/**
 * POST /api/bd-admin/users
 * Admin creates a new user or admin credential
 */
export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { name, email, password, role = "USER", badge = "New Explorer", reputation = 10 } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ success: false, error: "Name is required." }, { status: 400 });
    }
    if (!email || !email.trim()) {
      return NextResponse.json({ success: false, error: "Email or User ID is required." }, { status: 400 });
    }
    if (!password || password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters." },
        { status: 400 }
      );
    }

    const rawIdentifier = email.trim();
    const normalizedEmail = rawIdentifier.includes("@")
      ? rawIdentifier.toLowerCase()
      : `${rawIdentifier.toLowerCase().replace(/[^a-z0-9._-]/g, "")}@banarasdarshan.com`;

    // Check conflict
    const existing = await prisma.user.findFirst({
      where: {
        OR: [
          { email: normalizedEmail },
          { name: { equals: name.trim() } },
        ],
      },
    });

    if (existing) {
      return NextResponse.json(
        { success: false, error: "An account with this email or name already exists." },
        { status: 409 }
      );
    }

    let supabaseUserId: string | null = null;
    let supabaseError: string | null = null;

    if (isSupabaseConfigured()) {
      const sbResult = await adminCreateSupabaseUser(normalizedEmail, password, {
        name: name.trim(),
        role,
        badge,
      });

      if (sbResult.success && sbResult.user) {
        supabaseUserId = sbResult.user.id;
      } else {
        supabaseError = sbResult.error || "Supabase user creation failed";
      }
    }

    const passwordHash = hashPassword(password);
    const user = await prisma.user.create({
      data: {
        ...(supabaseUserId ? { id: supabaseUserId } : {}),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        role: ["ADMIN", "MODERATOR", "USER"].includes(role) ? role : "USER",
        reputation: Number(reputation) || 10,
        badge: badge || "New Explorer",
      },
    });

    return NextResponse.json({
      success: true,
      message: `Account created successfully for ${user.name} (${user.role}).`,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        badge: user.badge,
        reputation: user.reputation,
      },
      supabaseSynced: Boolean(supabaseUserId),
      supabaseNote: supabaseError,
    });
  } catch (error: any) {
    console.error("Admin create user error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to create user." },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/bd-admin/users
 * Update user details or reset user password
 */
export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { id, name, email, role, badge, reputation, newPassword } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required." }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ success: false, error: "User not found." }, { status: 404 });
    }

    const updateData: any = {};
    if (name) updateData.name = name.trim();
    if (email) {
      const cleanEmail = email.trim();
      updateData.email = cleanEmail.includes("@")
        ? cleanEmail.toLowerCase()
        : `${cleanEmail.toLowerCase().replace(/[^a-z0-9._-]/g, "")}@banarasdarshan.com`;
    }
    if (role && ["ADMIN", "MODERATOR", "USER"].includes(role)) {
      updateData.role = role;
    }
    if (badge) updateData.badge = badge;
    if (reputation !== undefined) updateData.reputation = Number(reputation);

    // Password reset if requested
    let passwordUpdated = false;
    if (newPassword && newPassword.trim().length >= 6) {
      updateData.passwordHash = hashPassword(newPassword.trim());
      passwordUpdated = true;

      // Update in Supabase if configured
      if (isSupabaseConfigured()) {
        await adminUpdateSupabaseUser(id, { password: newPassword.trim() }).catch((err) => {
          console.warn("Supabase password update notice:", err);
        });
      }
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      message: passwordUpdated
        ? `User profile and password updated for ${updated.name}.`
        : `User profile updated for ${updated.name}.`,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        badge: updated.badge,
        reputation: updated.reputation,
      },
    });
  } catch (error: any) {
    console.error("Admin update user error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to update user." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/bd-admin/users
 * Delete user account and cascade sessions
 */
export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "User ID is required." }, { status: 400 });
    }

    // Protect current admin from self-deletion
    if (id === admin.id) {
      return NextResponse.json(
        { success: false, error: "You cannot delete your own active administrator account." },
        { status: 400 }
      );
    }

    // Delete in Supabase if configured
    if (isSupabaseConfigured()) {
      await adminDeleteSupabaseUser(id).catch((err) => {
        console.warn("Supabase delete notice:", err);
      });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: "User account deleted successfully.",
    });
  } catch (error: any) {
    console.error("Admin delete user error:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete user." },
      { status: 500 }
    );
  }
}
