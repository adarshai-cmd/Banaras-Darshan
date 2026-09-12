import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized." }, { status: 401 });
    }

    const parkings = await prisma.parkingLocation.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ success: true, parkings });
  } catch (error) {
    console.error("Admin parking GET error:", error);
    return NextResponse.json({ success: false, error: "Failed to load parking locations." }, { status: 500 });
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
      name,
      address,
      area,
      latitude,
      longitude,
      capacity,
      parkingType = "MUNICIPAL",
      timing = "24 Hours Open",
      vehicleSupport = "BOTH",
      feeStatus = "PAID",
      feeRate,
      image,
      associatedPlaces,
      directionsNote,
    } = body;

    if (!name || !address || !area) {
      return NextResponse.json(
        { success: false, error: "Parking name, address, and area are required." },
        { status: 400 }
      );
    }

    const parking = await prisma.parkingLocation.create({
      data: {
        name: name.trim(),
        address: address.trim(),
        area: area.trim(),
        latitude: parseFloat(latitude) || 25.3109,
        longitude: parseFloat(longitude) || 83.0107,
        capacity: capacity?.trim() || null,
        parkingType: parkingType.toUpperCase(),
        timing: timing?.trim() || "24 Hours Open",
        vehicleSupport: vehicleSupport.toUpperCase(),
        feeStatus: feeStatus.toUpperCase(),
        feeRate: feeRate?.trim() || null,
        image: image?.trim() || null,
        associatedPlaces: associatedPlaces?.trim() || null,
        directionsNote: directionsNote?.trim() || null,
      },
    });

    return NextResponse.json({
      success: true,
      message: `Parking '${parking.name}' created successfully.`,
      parking,
    });
  } catch (error) {
    console.error("Admin parking POST error:", error);
    return NextResponse.json({ success: false, error: "Failed to create parking location." }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "Parking ID is required." }, { status: 400 });
    }

    const updated = await prisma.parkingLocation.update({
      where: { id },
      data: {
        ...(data.name && { name: data.name.trim() }),
        ...(data.address && { address: data.address.trim() }),
        ...(data.area && { area: data.area.trim() }),
        ...(data.latitude !== undefined && { latitude: parseFloat(data.latitude) }),
        ...(data.longitude !== undefined && { longitude: parseFloat(data.longitude) }),
        ...(data.capacity !== undefined && { capacity: data.capacity ? data.capacity.trim() : null }),
        ...(data.parkingType && { parkingType: data.parkingType.toUpperCase() }),
        ...(data.timing !== undefined && { timing: data.timing ? data.timing.trim() : null }),
        ...(data.vehicleSupport && { vehicleSupport: data.vehicleSupport.toUpperCase() }),
        ...(data.feeStatus && { feeStatus: data.feeStatus.toUpperCase() }),
        ...(data.feeRate !== undefined && { feeRate: data.feeRate ? data.feeRate.trim() : null }),
        ...(data.image !== undefined && { image: data.image ? data.image.trim() : null }),
        ...(data.associatedPlaces !== undefined && { associatedPlaces: data.associatedPlaces ? data.associatedPlaces.trim() : null }),
        ...(data.directionsNote !== undefined && { directionsNote: data.directionsNote ? data.directionsNote.trim() : null }),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Parking '${updated.name}' updated successfully.`,
      parking: updated,
    });
  } catch (error) {
    console.error("Admin parking PUT error:", error);
    return NextResponse.json({ success: false, error: "Failed to update parking." }, { status: 500 });
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
      return NextResponse.json({ success: false, error: "Parking ID is required." }, { status: 400 });
    }

    await prisma.parkingLocation.delete({ where: { id } });

    return NextResponse.json({
      success: true,
      message: "Parking location deleted successfully.",
    });
  } catch (error) {
    console.error("Admin parking DELETE error:", error);
    return NextResponse.json({ success: false, error: "Failed to delete parking." }, { status: 500 });
  }
}
