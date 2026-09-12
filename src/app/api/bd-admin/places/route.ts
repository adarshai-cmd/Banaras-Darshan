import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("q");
    const limit = parseInt(searchParams.get("limit") || "100", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);

    const where: Record<string, unknown> = {};
    if (category && category !== "ALL") {
      where.category = category.toUpperCase();
    }

    let places = await prisma.place.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }, { name: "asc" }],
      skip: (page - 1) * limit,
      take: limit,
    });

    if (search && search.trim()) {
      const q = search.toLowerCase();
      places = places.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.hindiName && p.hindiName.toLowerCase().includes(q)) ||
          p.area.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          p.tags.toLowerCase().includes(q)
      );
    }

    const total = await prisma.place.count({ where });

    return NextResponse.json({
      success: true,
      places,
      total,
      page,
      limit,
    });
  } catch (error) {
    console.error("Admin places GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load places for admin." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      name,
      hindiName,
      category = "TEMPLE",
      subCategory,
      tagline,
      description,
      history,
      address,
      area = "Varanasi",
      latitude = 25.3109,
      longitude = 83.0107,
      image,
      fallbackImage,
      rating,
      reviewCount,
      approxBudget = "Free",
      budgetTier = "BUDGET",
      bestTimeToVisit,
      openingHours,
      visitingTips,
      safetyNotes,
      isVerified = true,
      isFeatured = false,
      isHiddenGem = false,
      tags = "Heritage,Varanasi",
      popularDishes,
      isPureVeg = false,
      amenities,
      nearestHub,
      sourceName = "Banaras Darshan Official Editorial",
      sourceUrl,
      parkingInfo,
      galleryJson,
      nearbyPlacesJson,
    } = body;

    const primaryImage =
      image?.trim() ||
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80";

    if (!name || !tagline || !description || !address) {
      return NextResponse.json(
        { success: false, error: "Name, tagline, description, and address are required." },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.place.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newPlace = await prisma.place.create({
      data: {
        slug,
        name: name.trim(),
        hindiName: hindiName?.trim() || null,
        category: category.toUpperCase(),
        subCategory: subCategory?.trim() || null,
        tagline: tagline.trim(),
        description: description.trim(),
        history: history?.trim() || null,
        address: address.trim(),
        area: area.trim(),
        latitude: parseFloat(latitude) || 25.3109,
        longitude: parseFloat(longitude) || 83.0107,
        image: primaryImage.trim(),
        fallbackImage: fallbackImage?.trim() || null,
        rating: rating !== undefined && rating !== null && rating !== "" ? parseFloat(rating) : null,
        reviewCount: reviewCount ? parseInt(reviewCount, 10) : null,
        approxBudget: approxBudget.trim(),
        budgetTier: budgetTier.toUpperCase(),
        bestTimeToVisit: bestTimeToVisit?.trim() || null,
        openingHours: openingHours?.trim() || null,
        visitingTips: visitingTips?.trim() || null,
        safetyNotes: safetyNotes?.trim() || null,
        isVerified: Boolean(isVerified),
        isFeatured: Boolean(isFeatured),
        isHiddenGem: Boolean(isHiddenGem),
        tags: tags.trim(),
        popularDishes: popularDishes?.trim() || null,
        isPureVeg: Boolean(isPureVeg),
        amenities: amenities?.trim() || null,
        nearestHub: nearestHub?.trim() || null,
        sourceName: sourceName?.trim() || null,
        sourceUrl: sourceUrl?.trim() || null,
        parkingInfo: parkingInfo ? (typeof parkingInfo === "string" ? parkingInfo : JSON.stringify(parkingInfo)) : null,
        galleryJson: galleryJson ? (typeof galleryJson === "string" ? galleryJson : JSON.stringify(galleryJson)) : null,
        nearbyPlacesJson: nearbyPlacesJson ? (typeof nearbyPlacesJson === "string" ? nearbyPlacesJson : JSON.stringify(nearbyPlacesJson)) : null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Place '${newPlace.name}' created successfully!`,
      place: newPlace,
    });
  } catch (error) {
    console.error("Admin place POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create place." },
      { status: 500 }
    );
  }
}
