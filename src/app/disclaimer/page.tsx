import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPolicy } from "@/lib/legal-defaults";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Disclaimer | Banaras Darshan",
  description:
    "Notice regarding the independent informational nature of Banaras Darshan, dynamic temple darshan timings, boat ride fare estimates, and absence of official government affiliation.",
  alternates: {
    canonical: "https://banarasdarshan.com/disclaimer",
  },
  openGraph: {
    title: "Disclaimer | Banaras Darshan",
    description:
      "Independent tourism disclaimer, weather warnings, and independent verification advice for pilgrims visiting Kashi.",
    url: "https://banarasdarshan.com/disclaimer",
  },
};

export default async function DisclaimerPage() {
  const policy = await getPublishedPolicy("disclaimer");

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
