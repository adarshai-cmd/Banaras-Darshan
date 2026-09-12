import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      category,
      description,
      address,
      speciality,
      photoUrl,
      latitude,
      longitude,
      sourceRef,
    } = body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        { error: "Place name is required." },
        { status: 400 }
      );
    }

    if (!category) {
      return NextResponse.json(
        { error: "Please select a category." },
        { status: 400 }
      );
    }

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Please provide a description of at least 10 characters." },
        { status: 400 }
      );
    }

    if (!address || !address.trim()) {
      return NextResponse.json(
        { error: "Address or neighborhood location is required." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();

    const suggestion = await prisma.placeSuggestion.create({
      data: {
        name: name.trim(),
        category,
        description: description.trim(),
        address: address.trim(),
        speciality: speciality?.trim() || null,
        photoUrl: photoUrl?.trim() || null,
        latitude: latitude ? parseFloat(latitude) : null,
        longitude: longitude ? parseFloat(longitude) : null,
        sourceRef: sourceRef?.trim() || null,
        submittedBy: currentUser ? `${currentUser.name} (${currentUser.email || "User"})` : "Anonymous Traveler",
        userId: currentUser ? currentUser.id : null,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      message: "Place suggestion submitted successfully! It will be reviewed by our heritage verification team before appearing publicly.",
      suggestionId: suggestion.id,
    });
  } catch (error) {
    console.error("Error submitting place suggestion:", error);
    return NextResponse.json(
      { error: "Failed to submit place suggestion. Please try again." },
      { status: 500 }
    );
  }
}
