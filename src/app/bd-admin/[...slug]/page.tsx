import { redirect } from "next/navigation";
import { requireAdminOrModerator } from "@/lib/auth";

export const dynamic = "force-dynamic";

interface CatchAllAdminProps {
  params: Promise<{
    slug: string[];
  }>;
}

export default async function AdminCatchAllPage({ params }: CatchAllAdminProps) {
  const admin = await requireAdminOrModerator();
  const resolvedParams = await params;
  const targetTab = resolvedParams.slug?.[0] || "overview";

  if (!admin) {
    redirect("/bd-admin");
  }

  // Redirect to main admin page with tab query parameter
  redirect(`/bd-admin?tab=${encodeURIComponent(targetTab)}`);
}
