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
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const promotion = await prisma.promotion.findUnique({ where: { id } });

    if (!promotion) {
      return NextResponse.json({ success: false, error: "Promotion not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, promotion });
  } catch (error) {
    console.error("Admin promotion GET [id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to retrieve promotion." }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.promotion.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Promotion not found." }, { status: 404 });
    }

    const body = await req.json();
    const {
      title,
      shortTitle,
      category,
      badgeText,
      description,
      imageUrl,
      additionalImages,
      ctaText,
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
      placement,
      priority,
      displayOrder,
      isActive,
      isFeatured,
      autoRotationDuration,
    } = body;

    const updated = await prisma.promotion.update({
      where: { id },
      data: {
        ...(title !== undefined && { title: title.trim() }),
        ...(shortTitle !== undefined && { shortTitle: shortTitle ? shortTitle.trim() : null }),
        ...(category !== undefined && { category: category.toUpperCase() }),
        ...(badgeText !== undefined && { badgeText: badgeText ? badgeText.trim() : null }),
        ...(description !== undefined && { description: description.trim() }),
        ...(imageUrl !== undefined && { imageUrl: imageUrl.trim() }),
        ...(additionalImages !== undefined && {
          additionalImages: additionalImages
            ? typeof additionalImages === "string"
              ? additionalImages
              : JSON.stringify(additionalImages)
            : null,
        }),
        ...(ctaText !== undefined && { ctaText: ctaText.trim() }),
        ...(destinationUrl !== undefined && { destinationUrl: destinationUrl ? destinationUrl.trim() : null }),
        ...(websiteUrl !== undefined && { websiteUrl: websiteUrl ? websiteUrl.trim() : null }),
        ...(bookingUrl !== undefined && { bookingUrl: bookingUrl ? bookingUrl.trim() : null }),
        ...(location !== undefined && { location: location ? location.trim() : null }),
        ...(address !== undefined && { address: address ? address.trim() : null }),
        ...(contactPhone !== undefined && { contactPhone: contactPhone ? contactPhone.trim() : null }),
        ...(contactEmail !== undefined && { contactEmail: contactEmail ? contactEmail.trim() : null }),
        ...(startDate !== undefined && { startDate: startDate ? new Date(startDate) : null }),
        ...(endDate !== undefined && { endDate: endDate ? new Date(endDate) : null }),
        ...(startTime !== undefined && { startTime: startTime ? startTime.trim() : null }),
        ...(endTime !== undefined && { endTime: endTime ? endTime.trim() : null }),
        ...(placement !== undefined && { placement: placement.toUpperCase() }),
        ...(priority !== undefined && { priority: parseInt(priority, 10) || 5 }),
        ...(displayOrder !== undefined && { displayOrder: parseInt(displayOrder, 10) || 0 }),
        ...(isActive !== undefined && { isActive: Boolean(isActive) }),
        ...(isFeatured !== undefined && { isFeatured: Boolean(isFeatured) }),
        ...(autoRotationDuration !== undefined && {
          autoRotationDuration: parseInt(autoRotationDuration, 10) || 4500,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Promotion '${updated.title}' updated successfully.`,
      promotion: updated,
    });
  } catch (error) {
    console.error("Admin promotion PUT [id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to update promotion." }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const existing = await prisma.promotion.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ success: false, error: "Promotion not found." }, { status: 404 });
    }

    await prisma.promotion.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: `Promotion '${existing.title}' deleted successfully.`,
    });
  } catch (error) {
    console.error("Admin promotion DELETE [id] error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete promotion." }, { status: 500 });
  }
}
