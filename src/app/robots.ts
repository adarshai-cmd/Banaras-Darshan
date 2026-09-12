import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/bd-admin/", "/api/bd-admin/", "/admin/", "/api/admin/"],
    },
    sitemap: "https://banarasdarshan.com/sitemap.xml",
  };
}
