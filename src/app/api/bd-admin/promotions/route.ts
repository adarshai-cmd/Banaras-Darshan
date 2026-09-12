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
    const placement = searchParams.get("placement");
    const status = searchParams.get("status"); // "active", "inactive", "expired", "all"
    const search = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (category && category !== "ALL") {
      where.category = category.toUpperCase();
    }
    if (placement && placement !== "ALL") {
      where.placement = placement.toUpperCase();
    }

    const now = new Date();
    if (status === "active") {
      where.isActive = true;
      where.AND = [
        { OR: [{ startDate: null }, { startDate: { lte: now } }] },
        { OR: [{ endDate: null }, { endDate: { gte: now } }] },
      ];
    } else if (status === "inactive") {
      where.isActive = false;
    } else if (status === "expired") {
      where.endDate = { lt: now };
    }

    let promotions = await prisma.promotion.findMany({
      where,
      orderBy: [{ priority: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    });

    if (search && search.trim()) {
      const q = search.toLowerCase();
      promotions = promotions.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.shortTitle && p.shortTitle.toLowerCase().includes(q)) ||
          p.description.toLowerCase().includes(q) ||
          (p.location && p.location.toLowerCase().includes(q)) ||
          (p.badgeText && p.badgeText.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      promotions,
      total: promotions.length,
    });
  } catch (error) {
    console.error("Admin promotions GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load promotions." },
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
      title,
      shortTitle,
      category = "EVENT",
      badgeText,
      description,
      imageUrl,
      additionalImages,
      ctaText = "View Details",
      destinationUrl,
      websiteUrl,
      bookingUrl,
      location,
      address,
      contactPhone,
      contactEmail,
      startDate,
      endDate,
      startTime,
      endTime,
      placement = "BOTH",
      priority = 5,
      displayOrder = 0,
      isActive = true,
      isFeatured = false,
      autoRotationDuration = 4500,
    } = body;

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: "Promotion title and description are required." },
        { status: 400 }
      );
    }

    const finalImage =
      imageUrl?.trim() ||
      "https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80";

    const promotion = await prisma.promotion.create({
      data: {
        title: title.trim(),
        shortTitle: shortTitle?.trim() || null,
        category: category.toUpperCase(),
        badgeText: badgeText?.trim() || null,
        description: description.trim(),
        imageUrl: finalImage,
        additionalImages: additionalImages
          ? typeof additionalImages === "string"
            ? additionalImages
            : JSON.stringify(additionalImages)
          : null,
        ctaText: ctaText?.trim() || "View Details",
        destinationUrl: destinationUrl?.trim() || null,
        websiteUrl: websiteUrl?.trim() || null,
        bookingUrl: bookingUrl?.trim() || null,
        location: location?.trim() || null,
        address: address?.trim() || null,
        contactPhone: contactPhone?.trim() || null,
        contactEmail: contactEmail?.trim() || null,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        startTime: startTime?.trim() || null,
        endTime: endTime?.trim() || null,
        placement: placement.toUpperCase(),
        priority: parseInt(priority, 10) || 5,
        displayOrder: parseInt(displayOrder, 10) || 0,
        isActive: Boolean(isActive),
        isFeatured: Boolean(isFeatured),
        autoRotationDuration: parseInt(autoRotationDuration, 10) || 4500,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Promotion '${promotion.title}' created successfully.`,
      promotion,
    });
  } catch (error) {
    console.error("Admin promotions POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create promotion." },
      { status: 500 }
    );
  }
}
