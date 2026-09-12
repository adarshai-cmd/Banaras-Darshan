import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/api/", "/api/admin/"],
    },
    sitemap: "https://banarasdarshan.com/sitemap.xml",
  };
}
