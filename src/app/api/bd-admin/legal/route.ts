import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminOrModerator } from "@/lib/auth";
import { seedCanonicalPoliciesIfMissing } from "@/lib/legal-defaults";

export async function GET() {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin or Moderator privileges required." },
        { status: 401 }
      );
    }

    // Ensure initial policies exist in DB
    await seedCanonicalPoliciesIfMissing();

    const policies = await prisma.legalPolicy.findMany({
      include: {
        _count: {
          select: { versions: true },
        },
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({
      success: true,
      policies,
    });
  } catch (error) {
    console.error("Admin Legal Policies GET error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch legal policies." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin or Moderator privileges required." },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      slug,
      title,
      category = "LEGAL",
      version = "1.0",
      status = "PUBLISHED",
      summary,
      content,
      changeNotes,
    } = body;

    if (!slug || !title || !content) {
      return NextResponse.json(
        { success: false, error: "Slug, title, and content are required." },
        { status: 400 }
      );
    }

    const existingPolicy = await prisma.legalPolicy.findUnique({
      where: { slug },
    });

    if (existingPolicy) {
      // Archive current version into LegalPolicyHistory if content or version changed
      if (existingPolicy.content !== content || existingPolicy.version !== version) {
        await prisma.legalPolicyHistory.create({
          data: {
            policyId: existingPolicy.id,
            version: existingPolicy.version,
            content: existingPolicy.content,
            summary: existingPolicy.summary,
            status: existingPolicy.status,
            changeNotes: changeNotes?.trim() || `Updated by ${admin.name}`,
            archivedAt: new Date(),
          },
        });
      }

      const updatedPolicy = await prisma.legalPolicy.update({
        where: { slug },
        data: {
          title,
          category,
          version,
          status,
          summary: summary?.trim() || null,
          content: typeof content === "string" ? content : JSON.stringify(content),
          lastUpdated: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Policy '${title}' updated successfully. (Status: ${status})`,
        policy: updatedPolicy,
      });
    } else {
      const newPolicy = await prisma.legalPolicy.create({
        data: {
          slug,
          title,
          category,
          version,
          status,
          summary: summary?.trim() || null,
          content: typeof content === "string" ? content : JSON.stringify(content),
          lastUpdated: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        message: `Policy '${title}' created successfully.`,
        policy: newPolicy,
      });
    }
  } catch (error) {
    console.error("Admin Legal Policies POST error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save legal policy." },
      { status: 500 }
    );
  }
}
