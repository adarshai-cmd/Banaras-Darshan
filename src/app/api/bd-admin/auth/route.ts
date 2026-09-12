import { NextRequest, NextResponse } from "next/server";
import { authenticateAdminUser, destroySession, requireAdminOrModerator, verifyPassword, hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { identifier, password } = body;

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, error: "Admin ID/Email and password are required." },
        { status: 400 }
      );
    }

    const result = await authenticateAdminUser(identifier, password);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Admin authenticated successfully.",
      user: result.user,
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error during authentication." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await destroySession();
    return NextResponse.json({
      success: true,
      message: "Admin logged out successfully.",
    });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to log out." },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }
    return NextResponse.json({ success: true, user: admin });
  } catch (error) {
    console.error("Admin session check error:", error);
    return NextResponse.json(
      { success: false, error: "Internal error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const userRecord = await prisma.user.findUnique({ where: { id: admin.id } });
    if (!userRecord || !userRecord.passwordHash) {
      return NextResponse.json({ success: false, error: "User account not found." }, { status: 404 });
    }

    if (!verifyPassword(currentPassword, userRecord.passwordHash)) {
      return NextResponse.json({ success: false, error: "Incorrect current password." }, { status: 400 });
    }

    const hashedNew = hashPassword(newPassword);
    await prisma.user.update({
      where: { id: admin.id },
      data: { passwordHash: hashedNew },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("Admin password change error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update password." },
      { status: 500 }
    );
  }
}
