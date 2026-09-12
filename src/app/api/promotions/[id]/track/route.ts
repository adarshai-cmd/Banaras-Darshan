import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json().catch(() => ({}));
    const { type } = body;

    if (type === "click") {
      await prisma.promotion.update({
        where: { id },
        data: { clickCount: { increment: 1 } },
      });
    } else {
      // Default to impression
      await prisma.promotion.update({
        where: { id },
        data: { impressionCount: { increment: 1 } },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    // Analytics errors shouldn't break client experience
    return NextResponse.json({ success: false }, { status: 200 });
  }
}
