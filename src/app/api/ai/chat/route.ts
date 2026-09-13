import { NextRequest, NextResponse } from "next/server";
import { askBanarasAI } from "@/lib/ai-engine";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in or create an account to use Banaras AI Assistant.", requiresAuth: true },
        { status: 401 }
      );
    }

    const { question, language } = await req.json();

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { error: "Question query parameter is required" },
        { status: 400 }
      );
    }

    const answer = await askBanarasAI(question, language);
    return NextResponse.json({ success: true, ...answer });
  } catch (error) {
    console.error("Error in Banaras AI endpoint:", error);
    return NextResponse.json(
      { error: "Failed to query Banaras AI assistant" },
      { status: 500 }
    );
  }
}
