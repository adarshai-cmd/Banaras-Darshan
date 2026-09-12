import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { evaluateMessageContent } from "@/lib/moderation";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Please sign in to reply." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { messageId, content } = body;

    if (!messageId || !content) {
      return NextResponse.json(
        { success: false, error: "messageId and content are required." },
        { status: 400 }
      );
    }

    // Moderation check
    const moderation = evaluateMessageContent(content);
    if (moderation.action === "REJECT") {
      return NextResponse.json(
        {
          success: false,
          error: `Reply rejected (${moderation.category}): ${moderation.reason}`,
        },
        { status: 422 }
      );
    }

    const reply = await prisma.communityReply.create({
      data: {
        messageId,
        userId: currentUser.id,
        userName: currentUser.name,
        userBadge: currentUser.badge,
        content: content.trim(),
        status: moderation.action === "HOLD_FOR_REVIEW" ? "HELD_FOR_REVIEW" : "APPROVED",
      },
    });

    // Increment helpful count on parent message
    await prisma.communityMessage.update({
      where: { id: messageId },
      data: { helpfulCount: { increment: 1 } },
    });

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.error("Error creating community reply:", error);
    return NextResponse.json(
      { success: false, error: "Failed to post reply" },
      { status: 500 }
    );
  }
}
