import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateHaversineDistance } from "@/lib/distance";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const budget = searchParams.get("budget");
    const q = searchParams.get("q");
    const userLat = searchParams.get("lat") ? parseFloat(searchParams.get("lat")!) : null;
    const userLng = searchParams.get("lng") ? parseFloat(searchParams.get("lng")!) : null;
    const isVeg = searchParams.get("isVeg") === "true";
    const isHidden = searchParams.get("isHidden") === "true";

    const where: Record<string, unknown> = {};

    if (category && category !== "ALL") {
      where.category = category.toUpperCase();
    }

    if (budget && budget !== "ALL") {
      where.budgetTier = budget.toUpperCase();
    }

    if (isVeg) {
      where.isPureVeg = true;
    }

    if (isHidden) {
      where.isHiddenGem = true;
    }

    let places = await prisma.place.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { rating: "desc" }],
    });

    // If text query provided, filter on name, description, tags, popularDishes, area
    if (q && q.trim()) {
      const query = q.toLowerCase();
      places = places.filter((p) => {
        return (
          p.name.toLowerCase().includes(query) ||
          (p.hindiName && p.hindiName.includes(query)) ||
          p.description.toLowerCase().includes(query) ||
          p.tagline.toLowerCase().includes(query) ||
          p.area.toLowerCase().includes(query) ||
          p.tags.toLowerCase().includes(query) ||
          (p.popularDishes && p.popularDishes.toLowerCase().includes(query))
        );
      });
    }

    // Attach calculated distance if user coordinates provided
    const results = places.map((p) => {
      let distanceKm: number | undefined = undefined;
      if (userLat !== null && userLng !== null) {
        distanceKm = calculateHaversineDistance(
          { lat: userLat, lng: userLng },
          { lat: p.latitude, lng: p.longitude }
        );
      }
      return {
        ...p,
        distanceKm,
      };
    });

    // If user coordinates provided, sort primarily by distance
    if (userLat !== null && userLng !== null) {
      results.sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));
    }

    return NextResponse.json({ success: true, count: results.length, places: results });
  } catch (error) {
    console.error("Error querying places:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch places" },
      { status: 500 }
    );
  }
}
