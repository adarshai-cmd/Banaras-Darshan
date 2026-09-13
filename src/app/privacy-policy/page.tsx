import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPolicy } from "@/lib/legal-defaults";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Privacy Policy | Banaras Darshan",
  description:
    "Learn how Banaras Darshan handles pilgrim accounts, community messages, ephemeral AI interactions, client-side geolocation, and essential session cookies.",
  alternates: {
    canonical: "https://banarasdarshan.com/privacy-policy",
  },
  openGraph: {
    title: "Privacy Policy | Banaras Darshan",
    description:
      "Transparent disclosure on data minimization, Supabase security, zero ad-tracking, and traveler privacy rights in Varanasi.",
    url: "https://banarasdarshan.com/privacy-policy",
  },
};

export default async function PrivacyPolicyPage() {
  const policy = await getPublishedPolicy("privacy-policy");

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
