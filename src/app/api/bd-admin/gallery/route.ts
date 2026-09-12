import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const placeId = searchParams.get("placeId");

    const where: Record<string, unknown> = {};
    if (category && category !== "ALL") where.category = category.toUpperCase();
    if (placeId) where.placeId = placeId;

    const images = await prisma.galleryImage.findMany({
      where,
      orderBy: [{ isFeatured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ success: true, images });
  } catch (error) {
    console.error("Admin gallery GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load gallery." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const {
      title,
      caption,
      imageUrl,
      category = "GENERAL",
      placeId,
      placeName,
      isFeatured = false,
      order = 0,
    } = body;

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "Image URL is required." }, { status: 400 });
    }

    const image = await prisma.galleryImage.create({
      data: {
        title: title?.trim() || null,
        caption: caption?.trim() || null,
        imageUrl: imageUrl.trim(),
        category: category.toUpperCase(),
        placeId: placeId || null,
        placeName: placeName?.trim() || null,
        isFeatured: Boolean(isFeatured),
        order: parseInt(order, 10) || 0,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Image added to gallery.",
      image,
    });
  } catch (error) {
    console.error("Admin gallery POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to save gallery image." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Image ID required." }, { status: 400 });
    }

    const updated = await prisma.galleryImage.update({
      where: { id },
      data: {
        ...(data.title !== undefined && { title: data.title ? data.title.trim() : null }),
        ...(data.caption !== undefined && { caption: data.caption ? data.caption.trim() : null }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl.trim() }),
        ...(data.category !== undefined && { category: data.category.toUpperCase() }),
        ...(data.placeId !== undefined && { placeId: data.placeId || null }),
        ...(data.placeName !== undefined && { placeName: data.placeName ? data.placeName.trim() : null }),
        ...(data.isFeatured !== undefined && { isFeatured: Boolean(data.isFeatured) }),
        ...(data.order !== undefined && { order: parseInt(data.order, 10) || 0 }),
      },
    });

    return NextResponse.json({ success: true, message: "Gallery image updated.", image: updated });
  } catch (error) {
    console.error("Admin gallery PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update gallery image." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Image ID required." }, { status: 400 });
    }

    await prisma.galleryImage.delete({ where: { id } });

    return NextResponse.json({ success: true, message: "Gallery image deleted." });
  } catch (error) {
    console.error("Admin gallery DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete gallery image." }, { status: 500 });
  }
}
