import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const placement = searchParams.get("placement")?.toUpperCase();
    const now = new Date();

    const whereClause: Record<string, unknown> = {
      isActive: true,
      AND: [
        {
          OR: [{ startDate: null }, { startDate: { lte: now } }],
        },
        {
          OR: [{ endDate: null }, { endDate: { gte: now } }],
        },
      ],
    };

    if (placement && placement !== "ALL") {
      whereClause.placement = { in: [placement, "BOTH"] };
    }

    const promotions = await prisma.promotion.findMany({
      where: whereClause,
      orderBy: [{ priority: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({
      success: true,
      count: promotions.length,
      promotions,
    });
  } catch (error) {
    console.error("Public promotions GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load promotions." },
      { status: 500 }
    );
  }
}
