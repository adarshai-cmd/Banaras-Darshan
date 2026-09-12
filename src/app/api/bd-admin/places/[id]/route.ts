import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const place = await prisma.place.findUnique({
      where: { id },
    });

    if (!place) {
      return NextResponse.json(
        { success: false, error: "Place not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, place });
  } catch (error) {
    console.error("Admin place GET [id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to retrieve place details." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existing = await prisma.place.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Place not found." },
        { status: 404 }
      );
    }

    const body = await req.json();
    const {
      name,
      hindiName,
      category,
      subCategory,
      tagline,
      description,
      history,
      address,
      area,
      latitude,
      longitude,
      image,
      fallbackImage,
      rating,
      reviewCount,
      approxBudget,
      budgetTier,
      bestTimeToVisit,
      openingHours,
      visitingTips,
      safetyNotes,
      isVerified,
      isFeatured,
      isHiddenGem,
      tags,
      popularDishes,
      isPureVeg,
      amenities,
      nearestHub,
      sourceName,
      sourceUrl,
      parkingInfo,
      galleryJson,
      nearbyPlacesJson,
    } = body;

    const updated = await prisma.place.update({
      where: { id },
      data: {
        ...(name !== undefined && { name: name.trim() }),
        ...(hindiName !== undefined && { hindiName: hindiName ? hindiName.trim() : null }),
        ...(category !== undefined && { category: category.toUpperCase() }),
        ...(subCategory !== undefined && { subCategory: subCategory ? subCategory.trim() : null }),
        ...(tagline !== undefined && { tagline: tagline.trim() }),
        ...(description !== undefined && { description: description.trim() }),
        ...(history !== undefined && { history: history ? history.trim() : null }),
        ...(address !== undefined && { address: address.trim() }),
        ...(area !== undefined && { area: area.trim() }),
        ...(latitude !== undefined && { latitude: parseFloat(latitude) || existing.latitude }),
        ...(longitude !== undefined && { longitude: parseFloat(longitude) || existing.longitude }),
        ...(image !== undefined && { image: image.trim() }),
        ...(fallbackImage !== undefined && { fallbackImage: fallbackImage ? fallbackImage.trim() : null }),
        ...(rating !== undefined && {
          rating: rating !== null && rating !== "" ? parseFloat(rating) : null,
        }),
        ...(reviewCount !== undefined && {
          reviewCount: reviewCount !== null && reviewCount !== "" ? parseInt(reviewCount, 10) : null,
        }),
        ...(approxBudget !== undefined && { approxBudget: approxBudget.trim() }),
        ...(budgetTier !== undefined && { budgetTier: budgetTier.toUpperCase() }),
        ...(bestTimeToVisit !== undefined && { bestTimeToVisit: bestTimeToVisit ? bestTimeToVisit.trim() : null }),
        ...(openingHours !== undefined && { openingHours: openingHours ? openingHours.trim() : null }),
        ...(visitingTips !== undefined && { visitingTips: visitingTips ? visitingTips.trim() : null }),
        ...(safetyNotes !== undefined && { safetyNotes: safetyNotes ? safetyNotes.trim() : null }),
        ...(isVerified !== undefined && { isVerified: Boolean(isVerified) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(isHiddenGem !== undefined && { isHiddenGem: Boolean(isHiddenGem) }),
        ...(tags !== undefined && { tags: tags.trim() }),
        ...(popularDishes !== undefined && { popularDishes: popularDishes ? popularDishes.trim() : null }),
        ...(isPureVeg !== undefined && { isPureVeg: Boolean(isPureVeg) }),
        ...(amenities !== undefined && { amenities: amenities ? amenities.trim() : null }),
        ...(nearestHub !== undefined && { nearestHub: nearestHub ? nearestHub.trim() : null }),
        ...(sourceName !== undefined && { sourceName: sourceName ? sourceName.trim() : null }),
        ...(sourceUrl !== undefined && { sourceUrl: sourceUrl ? sourceUrl.trim() : null }),
        ...(parkingInfo !== undefined && {
          parkingInfo: parkingInfo ? (typeof parkingInfo === "string" ? parkingInfo : JSON.stringify(parkingInfo)) : null,
        }),
        ...(galleryJson !== undefined && {
          galleryJson: galleryJson ? (typeof galleryJson === "string" ? galleryJson : JSON.stringify(galleryJson)) : null,
        }),
        ...(nearbyPlacesJson !== undefined && {
          nearbyPlacesJson: nearbyPlacesJson ? (typeof nearbyPlacesJson === "string" ? nearbyPlacesJson : JSON.stringify(nearbyPlacesJson)) : null,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Place '${updated.name}' updated successfully!`,
      place: updated,
    });
  } catch (error) {
    console.error("Admin place PUT [id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update place." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const existing = await prisma.place.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Place not found." },
        { status: 404 }
      );
    }

    await prisma.place.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Place '${existing.name}' was permanently deleted.`,
    });
  } catch (error) {
    console.error("Admin place DELETE [id] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete place." },
      { status: 500 }
    );
  }
}
