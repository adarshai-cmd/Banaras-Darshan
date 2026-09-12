import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, address, description, speciality, submittedBy } = body;

    if (!name || !category || !address || !description) {
      return NextResponse.json(
        { error: "Name, category, address, and description are required" },
        { status: 400 }
      );
    }

    const suggestion = await prisma.placeSuggestion.create({
      data: {
        name,
        category,
        address,
        description,
        speciality,
        submittedBy: submittedBy || "Community Contributor",
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      suggestion,
      message: "Place recommendation submitted! Our curation team will verify and add it to Banaras Darshan.",
    });
  } catch (error) {
    console.error("Error submitting place suggestion:", error);
    return NextResponse.json({ error: "Failed to submit place suggestion" }, { status: 500 });
  }
}
