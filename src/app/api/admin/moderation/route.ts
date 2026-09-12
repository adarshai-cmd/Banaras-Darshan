import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const [
      totalUsers,
      totalPlaces,
      totalMessages,
      pendingReports,
      heldMessages,
      moderationLogs,
      placeSuggestions,
      feedbacks,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.place.count(),
      prisma.communityMessage.count(),
      prisma.report.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.communityMessage.findMany({
        where: { status: "HELD_FOR_REVIEW" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.moderationLog.findMany({
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
      prisma.placeSuggestion.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
      prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        take: 20,
      }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalPlaces,
        totalMessages,
        pendingReportsCount: pendingReports.length,
        heldMessagesCount: heldMessages.length,
      },
      pendingReports,
      heldMessages,
      moderationLogs,
      placeSuggestions,
      feedbacks,
    });
  } catch (error) {
    console.error("Admin dashboard fetch error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve admin moderation metrics" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, targetId, note } = await req.json();

    if (action === "APPROVE_MESSAGE") {
      await prisma.communityMessage.update({
        where: { id: targetId },
        data: { status: "APPROVED", moderationReason: note || "Manually approved by moderator" },
      });
      await prisma.moderationLog.create({
        data: {
          action: "ADMIN_APPROVE",
          targetType: "COMMUNITY_MESSAGE",
          targetId,
          matchedRule: "MANUAL_OVERRIDE",
          severity: "LOW",
          snippet: note,
        },
      });
      return NextResponse.json({ success: true, message: "Message approved and released to feed" });
    }

    if (action === "REJECT_MESSAGE") {
      await prisma.communityMessage.update({
        where: { id: targetId },
        data: { status: "REJECTED", moderationReason: note || "Rejected by moderator" },
      });
      await prisma.moderationLog.create({
        data: {
          action: "ADMIN_REJECT",
          targetType: "COMMUNITY_MESSAGE",
          targetId,
          matchedRule: "MANUAL_REJECTION",
          severity: "HIGH",
          snippet: note,
        },
      });
      return NextResponse.json({ success: true, message: "Message rejected" });
    }

    if (action === "RESOLVE_REPORT") {
      await prisma.report.update({
        where: { id: targetId },
        data: { status: "RESOLVED" },
      });
      return NextResponse.json({ success: true, message: "Report resolved" });
    }

    if (action === "APPROVE_SUGGESTION") {
      await prisma.placeSuggestion.update({
        where: { id: targetId },
        data: { status: "APPROVED" },
      });
      return NextResponse.json({ success: true, message: "Suggestion approved" });
    }

    return NextResponse.json({ error: "Unrecognized moderation action" }, { status: 400 });
  } catch (error) {
    console.error("Moderation action error:", error);
    return NextResponse.json({ error: "Failed to execute moderation action" }, { status: 500 });
  }
}
