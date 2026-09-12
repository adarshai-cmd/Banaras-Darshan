import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const messages = await prisma.communityMessage.findMany({
      include: {
        replies: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Admin community GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load messages." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");
    const replyId = searchParams.get("replyId");

    if (replyId) {
      await prisma.communityReply.delete({ where: { id: replyId } });
      return NextResponse.json({ success: true, message: "Reply deleted successfully." });
    }

    if (messageId) {
      await prisma.communityMessage.delete({ where: { id: messageId } });
      return NextResponse.json({ success: true, message: "Message deleted successfully." });
    }

    return NextResponse.json({ success: false, error: "Missing messageId or replyId." }, { status: 400 });
  } catch (error) {
    console.error("Admin community DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete community item." }, { status: 500 });
  }
}
