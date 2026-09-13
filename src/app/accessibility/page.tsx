import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPolicy } from "@/lib/legal-defaults";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Accessibility Statement | Banaras Darshan",
  description:
    "Discover Banaras Darshan's commitment to web accessibility, WCAG 2.1 AA compliance, keyboard navigation, and screen-reader compatibility for all pilgrims.",
  alternates: {
    canonical: "https://banarasdarshan.com/accessibility",
  },
  openGraph: {
    title: "Accessibility Statement | Banaras Darshan",
    description:
      "Our digital accessibility standards, measures taken, known limitations, and accessibility feedback channel.",
    url: "https://banarasdarshan.com/accessibility",
  },
};

export default async function AccessibilityPage() {
  const policy = await getPublishedPolicy("accessibility");

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
