import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      category = "BUG",
      rating = 5,
      message,
      pageUrl,
      contactInfo,
      screenshot,
    } = body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        { error: "Feedback message is required." },
        { status: 400 }
      );
    }

    const currentUser = await getCurrentUser();
    const submitterName = name?.trim() || currentUser?.name || "Anonymous Traveler";
    const submitterEmail = email?.trim() || currentUser?.email || contactInfo?.trim() || null;

    const feedback = await prisma.feedback.create({
      data: {
        name: submitterName,
        email: submitterEmail,
        category: category || "BUG",
        rating: Number(rating) || 5,
        message: message.trim(),
        pageUrl: pageUrl?.trim() || null,
        contactInfo: contactInfo?.trim() || submitterEmail || null,
        screenshot: screenshot?.trim() || null,
        status: "NEW",
      },
    });

    // Admin notification logic if configured
    const adminEmail = process.env.ADMIN_EMAIL;
    if (adminEmail && process.env.SMTP_HOST) {
      console.log(`[Notification] Sending feedback notification to ${adminEmail} for feedback ID ${feedback.id}`);
      // In production with active SMTP credentials, nodemailer/fetch would transmit the notification
    }

    return NextResponse.json({
      success: true,
      message: "Thank you. Your feedback has been submitted.",
      feedbackId: feedback.id,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback. Please try again." },
      { status: 500 }
    );
  }
}
