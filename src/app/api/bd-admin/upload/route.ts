import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { requireAdminOrModerator } from "@/lib/auth";
import {
  isSupabaseConfigured,
  uploadToSupabaseStorage,
  deleteFromSupabaseStorage,
} from "@/lib/supabase";

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
    const requestedBucket = (formData.get("bucket") as string)?.toLowerCase() || "places";

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

    const useSupabase = isSupabaseConfigured();
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    if (!useSupabase) {
      // Ensure local directory exists for fallback
      await fs.mkdir(uploadsDir, { recursive: true });
    }

    const uploadedUrls: Array<{
      url: string;
      originalName: string;
      size: number;
      storageProvider: "supabase" | "local";
    }> = [];

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
      const buffer = Buffer.from(await file.arrayBuffer());

      let finalUrl = "";
      let provider: "supabase" | "local" = "local";

      if (useSupabase) {
        try {
          const supabaseUrl = await uploadToSupabaseStorage({
            bucket: requestedBucket,
            path: filename,
            fileBuffer: buffer,
            contentType: file.type,
          });

          if (supabaseUrl) {
            finalUrl = supabaseUrl;
            provider = "supabase";
          }
        } catch (supabaseErr) {
          console.warn("Supabase storage upload failed, falling back to local storage:", supabaseErr);
        }
      }

      // Local fallback if Supabase is not configured or failed
      if (!finalUrl) {
        await fs.mkdir(uploadsDir, { recursive: true });
        const targetPath = path.join(uploadsDir, filename);
        await fs.writeFile(targetPath, buffer);
        finalUrl = `/uploads/${filename}`;
        provider = "local";
      }

      uploadedUrls.push({
        url: finalUrl,
        originalName: file.name,
        size: file.size,
        storageProvider: provider,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${uploadedUrls.length} image(s).`,
      url: uploadedUrls[0].url,
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

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: "Invalid upload URL provided." },
        { status: 400 }
      );
    }

    // Check if URL is from Supabase Storage
    if (fileUrl.includes("/storage/v1/object/public/")) {
      try {
        const parts = fileUrl.split("/storage/v1/object/public/")[1]?.split("/");
        if (parts && parts.length >= 2) {
          const bucket = parts[0];
          const storagePath = parts.slice(1).join("/");
          await deleteFromSupabaseStorage(bucket, storagePath);
          return NextResponse.json({
            success: true,
            message: "Image file removed from Supabase storage.",
          });
        }
      } catch (err) {
        console.warn("Could not delete from Supabase storage:", err);
      }
    }

    // Local filesystem removal
    if (fileUrl.startsWith("/uploads/")) {
      const filename = path.basename(fileUrl);
      const targetPath = path.join(process.cwd(), "public", "uploads", filename);

      try {
        await fs.unlink(targetPath);
      } catch {
        // File may already have been removed
      }

      return NextResponse.json({
        success: true,
        message: "Image file removed from local storage.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Image reference cleared.",
    });
  } catch (error) {
    console.error("Admin file deletion error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image file." },
      { status: 500 }
    );
  }
}
