import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const parkings = await prisma.parkingLocation.findMany({
      orderBy: [{ area: "asc" }, { name: "asc" }],
    });

    return NextResponse.json(
      {
        success: true,
        count: parkings.length,
        parkings,
      },
      {
        headers: {
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
        },
      }
    );
  } catch (error) {
    console.error("Public parking API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load parking locations." },
      { status: 500 }
    );
  }
}
