import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messageId, reason, details = "", reporterName = "Traveler" } = body;

    if (!messageId || !reason) {
      return NextResponse.json(
        { success: false, error: "messageId and report reason are required." },
        { status: 400 }
      );
    }

    const message = await prisma.communityMessage.findUnique({
      where: { id: messageId },
      select: { content: true },
    });

    const report = await prisma.report.create({
      data: {
        reporterName,
        targetType: "COMMUNITY_MESSAGE",
        targetId: messageId,
        targetContent: message ? message.content.substring(0, 200) : "Message content unavailable",
        reason,
        details,
        status: "PENDING",
      },
    });

    return NextResponse.json({
      success: true,
      report,
      message: "Thank you. Your report has been submitted to the Banaras Darshan moderation team.",
    });
  } catch (error) {
    console.error("Error creating report:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit report" },
      { status: 500 }
    );
  }
}
