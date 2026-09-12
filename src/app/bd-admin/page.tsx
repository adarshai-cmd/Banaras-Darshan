import { Metadata } from "next";
import { requireAdminOrModerator } from "@/lib/auth";
import { AdminLoginPage } from "./AdminLoginPage";
import { AdminDashboardLayout } from "./AdminDashboardLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Console • Banaras Darshan CMS",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminPage() {
  const admin = await requireAdminOrModerator();

  if (!admin) {
    return <AdminLoginPage />;
  }

  return <AdminDashboardLayout currentUser={admin} />;
}
