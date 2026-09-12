import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { messageId } = await req.json();

    if (!messageId) {
      return NextResponse.json({ error: "messageId required" }, { status: 400 });
    }

    const updated = await prisma.communityMessage.update({
      where: { id: messageId },
      data: {
        helpfulCount: { increment: 1 },
      },
      select: { id: true, helpfulCount: true },
    });

    return NextResponse.json({ success: true, helpfulCount: updated.helpfulCount });
  } catch (error) {
    console.error("Error updating helpful count:", error);
    return NextResponse.json({ error: "Failed to update helpful score" }, { status: 500 });
  }
}
