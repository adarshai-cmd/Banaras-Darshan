import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const policy = await prisma.legalPolicy.findUnique({
      where: { slug },
      include: {
        versions: {
          orderBy: { archivedAt: "desc" },
        },
      },
    });

    if (!policy) {
      return NextResponse.json(
        { success: false, error: "Policy not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      currentPolicy: {
        id: policy.id,
        slug: policy.slug,
        title: policy.title,
        version: policy.version,
        status: policy.status,
        lastUpdated: policy.lastUpdated,
      },
      history: policy.versions,
    });
  } catch (error) {
    console.error("Legal policy history GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load policy history." },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { slug } = await params;
    const body = await req.json();
    const { historyId } = body;

    if (!historyId) {
      return NextResponse.json(
        { success: false, error: "History ID is required." },
        { status: 400 }
      );
    }

    const historyRecord = await prisma.legalPolicyHistory.findUnique({
      where: { id: historyId },
    });

    if (!historyRecord) {
      return NextResponse.json(
        { success: false, error: "History revision not found." },
        { status: 404 }
      );
    }

    const currentPolicy = await prisma.legalPolicy.findUnique({
      where: { slug },
    });

    if (!currentPolicy) {
      return NextResponse.json(
        { success: false, error: "Current policy not found." },
        { status: 404 }
      );
    }

    // Archive current before restoring
    await prisma.legalPolicyHistory.create({
      data: {
        policyId: currentPolicy.id,
        version: currentPolicy.version,
        content: currentPolicy.content,
        summary: currentPolicy.summary,
        status: currentPolicy.status,
        changeNotes: `Auto-archived before restoring revision v${historyRecord.version} by ${admin.name}`,
        archivedAt: new Date(),
      },
    });

    // Restore policy
    const restoredPolicy = await prisma.legalPolicy.update({
      where: { slug },
      data: {
        content: historyRecord.content,
        summary: historyRecord.summary,
        version: historyRecord.version,
        status: historyRecord.status,
        lastUpdated: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: `Policy successfully restored to revision v${historyRecord.version}.`,
      policy: restoredPolicy,
    });
  } catch (error) {
    console.error("Legal policy restore POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to restore legal policy." },
      { status: 500 }
    );
  }
}
