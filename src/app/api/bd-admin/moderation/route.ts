import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const [suggestions, reports, heldMessages] = await Promise.all([
      prisma.placeSuggestion.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.report.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
      }),
      prisma.communityMessage.findMany({
        where: { status: "HELD_FOR_REVIEW" },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({
      success: true,
      suggestions,
      reports,
      heldMessages,
    });
  } catch (error) {
    console.error("Admin moderation GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load moderation items." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { action, targetId, note } = body;

    // 1. Approve user-submitted place and publish to verified places directory
    if (action === "APPROVE_SUGGESTION") {
      const suggestion = await prisma.placeSuggestion.findUnique({ where: { id: targetId } });
      if (!suggestion) {
        return NextResponse.json({ success: false, error: "Suggestion not found." }, { status: 404 });
      }

      await prisma.placeSuggestion.update({
        where: { id: targetId },
        data: { status: "VERIFIED" },
      });

      const baseSlug = suggestion.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      const slug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

      const newPlace = await prisma.place.create({
        data: {
          slug,
          name: suggestion.name,
          category: suggestion.category || "HIDDEN",
          subCategory: "Community Verified Discovery",
          tagline: suggestion.speciality || "Discovered & verified by the Banaras community.",
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
          tags: "Community Verified,Heritage",
          sourceName: suggestion.sourceRef || `Submitted by ${suggestion.submittedBy || "Traveler"}`,
        },
      });

      return NextResponse.json({
        success: true,
        message: `Suggestion approved! Published as '${newPlace.name}' to the live public directory.`,
        place: newPlace,
      });
    }

    // 2. Reject suggestion
    if (action === "REJECT_SUGGESTION") {
      await prisma.placeSuggestion.update({
        where: { id: targetId },
        data: { status: "REJECTED" },
      });
      return NextResponse.json({ success: true, message: "Suggestion rejected." });
    }

    // 3. Resolve user report
    if (action === "RESOLVE_REPORT") {
      await prisma.report.update({
        where: { id: targetId },
        data: { status: "RESOLVED" },
      });
      return NextResponse.json({ success: true, message: "Report marked as resolved." });
    }

    // 4. Approve / Release held community message
    if (action === "APPROVE_MESSAGE") {
      await prisma.communityMessage.update({
        where: { id: targetId },
        data: { status: "APPROVED", moderationReason: note || "Approved by moderator" },
      });
      return NextResponse.json({ success: true, message: "Message released to community feed." });
    }

    // 5. Reject held message
    if (action === "REJECT_MESSAGE") {
      await prisma.communityMessage.update({
        where: { id: targetId },
        data: { status: "REJECTED", moderationReason: note || "Violates community policy" },
      });
      return NextResponse.json({ success: true, message: "Message rejected." });
    }

    return NextResponse.json({ success: false, error: "Unrecognized moderation action." }, { status: 400 });
  } catch (error) {
    console.error("Admin moderation POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to execute moderation action." }, { status: 500 });
  }
}
