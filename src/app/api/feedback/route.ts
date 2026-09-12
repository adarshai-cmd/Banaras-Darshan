import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, category = "GENERAL", rating = 5, message } = body;

    if (!name || !message) {
      return NextResponse.json(
        { error: "Name and message are required" },
        { status: 400 }
      );
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        category,
        rating: Number(rating) || 5,
        message,
        status: "NEW",
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}
