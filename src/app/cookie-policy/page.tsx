import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPolicy } from "@/lib/legal-defaults";
import { LegalDocumentLayout } from "@/components/legal/LegalDocumentLayout";

export const metadata: Metadata = {
  title: "Cookie Policy | Banaras Darshan",
  description:
    "Explore our cookie policy: learn how Banaras Darshan utilizes essential session cookies and rejects all third-party advertising tracking.",
  alternates: {
    canonical: "https://banarasdarshan.com/cookie-policy",
  },
  openGraph: {
    title: "Cookie Policy | Banaras Darshan",
    description:
      "Honest disclosure of the banaras_session cookie, local storage, zero ad-network tracking, and browser management tips.",
    url: "https://banarasdarshan.com/cookie-policy",
  },
};

export default async function CookiePolicyPage() {
  const policy = await getPublishedPolicy("cookie-policy");

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
