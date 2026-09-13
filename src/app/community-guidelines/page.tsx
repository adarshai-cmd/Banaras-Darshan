import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPolicy } from "@/lib/legal-defaults";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Community Guidelines | Banaras Darshan",
  description:
    "Standards of respect, mutual aid, anti-spam, and spiritual sanctity that keep Banaras Darshan a safe and welcoming space for all Varanasi travelers.",
  alternates: {
    canonical: "https://banarasdarshan.com/community-guidelines",
  },
  openGraph: {
    title: "Community Guidelines | Banaras Darshan",
    description:
      "Community etiquette, prohibited commercial touting, automated moderation pipeline, and reporting rules.",
    url: "https://banarasdarshan.com/community-guidelines",
  },
};

export default async function CommunityGuidelinesPage() {
  const policy = await getPublishedPolicy("community-guidelines");

  if (!policy) {
    notFound();
  }

  return (
    <LegalDocumentLayout
      slug={policy.slug}
      title={policy.title}
      category={policy.category}
      version={policy.version}
      lastUpdated={policy.lastUpdated}
      summary={policy.summary}
      sections={policy.sections}
    />
  );
}
