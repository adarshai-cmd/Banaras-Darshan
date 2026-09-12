import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { evaluateMessageContent } from "@/lib/moderation";
import { verifyRecommendationClaim } from "@/lib/verification";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const channel = searchParams.get("channel");

    const whereClause: Record<string, unknown> = {
      status: "APPROVED",
    };

    if (channel && channel !== "all") {
      whereClause.channel = channel;
    }

    const messages = await prisma.communityMessage.findMany({
      where: whereClause,
      include: {
        replies: {
          where: { status: "APPROVED" },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching community messages:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch community messages" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { content, channel = "general", userName = "Guest Explorer", userBadge = "New Explorer" } = body;

    if (!content || typeof content !== "string") {
      return NextResponse.json(
        { success: false, error: "Content is required." },
        { status: 400 }
      );
    }

    // 1. Run Content Moderation Pipeline
    const moderation = evaluateMessageContent(content);

    // If severe violation, reject immediately with clear constructive explanation
    if (moderation.action === "REJECT") {
      await prisma.moderationLog.create({
        data: {
          action: "AUTO_REJECT",
          targetType: "COMMUNITY_MESSAGE",
          targetId: "temp",
          matchedRule: moderation.category,
          severity: "HIGH",
          snippet: content.substring(0, 120),
        },
      });

      return NextResponse.json(
        {
          success: false,
          error: `Message policy violation (${moderation.category}): ${moderation.reason}`,
          moderation,
        },
        { status: 422 }
      );
    }

    // 2. Run Recommendation Verification Engine
    const verification = await verifyRecommendationClaim(content);

    // Determine status
    const messageStatus = moderation.action === "HOLD_FOR_REVIEW" ? "HELD_FOR_REVIEW" : "APPROVED";

    // 3. Save Message to Database
    const newMessage = await prisma.communityMessage.create({
      data: {
        userId: "usr_community_" + Math.random().toString(36).substring(2, 8),
        userName: userName.trim() || "Kashi Explorer",
        userBadge: userBadge || "New Explorer",
        channel,
        content: content.trim(),
        isVerified: verification.isVerified,
        verifiedNote: verification.isVerified ? verification.note : null,
        status: messageStatus,
        moderationScore: moderation.score,
        moderationReason: moderation.reason,
        moderationCategory: moderation.category,
      },
      include: {
        replies: true,
      },
    });

    if (moderation.action === "HOLD_FOR_REVIEW") {
      await prisma.moderationLog.create({
        data: {
          action: "AUTO_FLAG",
          targetType: "COMMUNITY_MESSAGE",
          targetId: newMessage.id,
          matchedRule: moderation.category,
          severity: "MEDIUM",
          snippet: content.substring(0, 120),
        },
      });

      return NextResponse.json({
        success: true,
        held: true,
        message: newMessage,
        notice: "Your message contains elements that requires verification. It has been queued for review by our moderation team to protect travelers.",
      });
    }

    return NextResponse.json({
      success: true,
      held: false,
      message: newMessage,
    });
  } catch (error) {
    console.error("Error creating community message:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error posting message" },
      { status: 500 }
    );
  }
}
