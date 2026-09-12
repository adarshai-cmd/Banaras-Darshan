import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const [
      totalTemples,
      totalGhats,
      totalFood,
      totalTouristPlaces,
      totalParking,
      totalGallery,
      pendingSuggestions,
      pendingReports,
      heldMessages,
      totalCommunityMessages,
      totalUsers,
      totalPromotions,
      activePromotions,
    ] = await Promise.all([
      prisma.place.count({ where: { category: "TEMPLE" } }),
      prisma.place.count({ where: { category: "GHAT" } }),
      prisma.place.count({ where: { category: "FOOD" } }),
      prisma.place.count({
        where: { category: { in: ["HIDDEN", "STREET", "EXPERIENCE", "HOTEL"] } },
      }),
      prisma.parkingLocation.count(),
      prisma.galleryImage.count(),
      prisma.placeSuggestion.count({ where: { status: "PENDING" } }),
      prisma.report.count({ where: { status: "PENDING" } }),
      prisma.communityMessage.count({ where: { status: "HELD_FOR_REVIEW" } }),
      prisma.communityMessage.count(),
      prisma.user.count(),
      prisma.promotion.count(),
      prisma.promotion.count({ where: { isActive: true } }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalTemples,
        totalGhats,
        totalFood,
        totalTouristPlaces,
        totalParking,
        totalGallery,
        pendingModeration: pendingSuggestions + pendingReports + heldMessages,
        pendingSuggestions,
        pendingReports,
        heldMessages,
        totalCommunityMessages,
        totalUsers,
        totalPromotions,
        activePromotions,
      },
    });
  } catch (error) {
    console.error("Admin stats GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load dashboard statistics." }, { status: 500 });
  }
}
