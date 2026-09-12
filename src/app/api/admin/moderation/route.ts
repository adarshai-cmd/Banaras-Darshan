import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await requireAdminOrModerator();
  if (!user) {
    return NextResponse.json(
      { error: "Forbidden. Admin or Moderator session required." },
      { status: 403 }
    );
  }

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
        take: 25,
      }),
      prisma.feedback.findMany({
        orderBy: { createdAt: "desc" },
        take: 25,
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
        pendingSuggestionsCount: placeSuggestions.length,
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
  const user = await requireAdminOrModerator();
  if (!user) {
    return NextResponse.json(
      { error: "Forbidden. Admin or Moderator session required." },
      { status: 403 }
    );
  }

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
      const suggestion = await prisma.placeSuggestion.findUnique({
        where: { id: targetId },
      });

      if (!suggestion) {
        return NextResponse.json({ error: "Suggestion not found" }, { status: 404 });
      }

      await prisma.placeSuggestion.update({
        where: { id: targetId },
        data: { status: "VERIFIED" },
      });

      // Generate unique slug
      const baseSlug = suggestion.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

      // Publish as verified place
      await prisma.place.create({
        data: {
          slug,
          name: suggestion.name,
          category: suggestion.category || "HIDDEN",
          subCategory: "Community Verified Discovery",
          tagline: suggestion.speciality || "Discovered by the Banaras community.",
          description: suggestion.description,
          address: suggestion.address,
          area: suggestion.address.split(",")[0] || "Varanasi",
          latitude: suggestion.latitude || 25.3109,
          longitude: suggestion.longitude || 83.0107,
          image:
            suggestion.photoUrl ||
            "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80",
          approxBudget: "Price varies — check current price",
          budgetTier: "BUDGET",
          isVerified: true,
          isHiddenGem: true,
          tags: "Community Recommendation,Verified",
          sourceName: suggestion.sourceRef || `Submitted by ${suggestion.submittedBy || "Community Explorer"}`,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Suggestion approved and published as official verified place (${slug})!`,
      });
    }

    if (action === "REJECT_SUGGESTION") {
      await prisma.placeSuggestion.update({
        where: { id: targetId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "Place suggestion rejected" });
    }

    return NextResponse.json({ error: "Unrecognized moderation action" }, { status: 400 });
  } catch (error) {
    console.error("Moderation action error:", error);
    return NextResponse.json({ error: "Failed to execute moderation action" }, { status: 500 });
  }
}
