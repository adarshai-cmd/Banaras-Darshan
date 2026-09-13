import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPolicy } from "@/lib/legal-defaults";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Terms & Conditions | Banaras Darshan",
  description:
    "Review the terms of use for Banaras Darshan, acceptable community standards, intellectual property, and disclaimers on Varanasi travel guidance.",
  alternates: {
    canonical: "https://banarasdarshan.com/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Banaras Darshan",
    description:
      "Terms of service, community rules, liability limitations, and legal jurisdiction for Banaras Darshan.",
    url: "https://banarasdarshan.com/terms-and-conditions",
  },
};

export default async function TermsAndConditionsPage() {
  const policy = await getPublishedPolicy("terms-and-conditions");

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
