import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { requireAdminOrModerator } from "@/lib/auth";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
]);

const EXTENSION_MAP: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/gif": "gif",
  "image/avif": "avif",
};

const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15MB

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized. Admin session required." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const singleFile = formData.get("file") as File | null;

    const filesToProcess: File[] = [];
    if (singleFile && singleFile.size > 0) {
      filesToProcess.push(singleFile);
    }
    for (const f of files) {
      if (f && f.size > 0 && !filesToProcess.includes(f)) {
        filesToProcess.push(f);
      }
    }

    if (filesToProcess.length === 0) {
      return NextResponse.json(
        { success: false, error: "No image file provided in upload request." },
        { status: 400 }
      );
    }

    // Ensure uploads folder exists in /public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const uploadedUrls: Array<{ url: string; originalName: string; size: number }> = [];

    for (const file of filesToProcess) {
      if (!ALLOWED_MIME_TYPES.has(file.type)) {
        return NextResponse.json(
          {
            success: false,
            error: `Unsupported file type: ${file.type}. Allowed types: JPG, PNG, WebP, SVG, GIF, AVIF.`,
          },
          { status: 400 }
        );
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return NextResponse.json(
          {
            success: false,
            error: `File ${file.name} exceeds maximum allowed size of 15MB.`,
          },
          { status: 400 }
        );
      }

      const ext = EXTENSION_MAP[file.type] || "jpg";
      const cleanBase = file.name
        .replace(/\.[^/.]+$/, "")
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, "-")
        .substring(0, 30);
      const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
      const filename = `${cleanBase || "kashi"}-${uniqueSuffix}.${ext}`;
      const targetPath = path.join(uploadsDir, filename);

      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.writeFile(targetPath, buffer);

      const publicUrl = `/uploads/${filename}`;
      uploadedUrls.push({
        url: publicUrl,
        originalName: file.name,
        size: file.size,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedUrls.length} image(s).`,
      url: uploadedUrls[0].url, // Primary URL for single uploads
      files: uploadedUrls,
    });
  } catch (error) {
    console.error("Admin file upload error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process image upload on server." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await requireAdminOrModerator();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized." },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const fileUrl = searchParams.get("url");

    if (!fileUrl || !fileUrl.startsWith("/uploads/")) {
      return NextResponse.json(
        { success: false, error: "Invalid upload URL provided." },
        { status: 400 }
      );
    }

    const filename = path.basename(fileUrl);
    const targetPath = path.join(process.cwd(), "public", "uploads", filename);

    try {
      await fs.unlink(targetPath);
    } catch {
      // File may already have been removed
    }

    return NextResponse.json({
      success: true,
      message: "Image file removed from server storage.",
    });
  } catch (error) {
    console.error("Admin file deletion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image file." },
      { status: 500 }
    );
  }
}
