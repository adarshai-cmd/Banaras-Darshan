import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://banarasdarshan.com";

  const routes = [
    "",
    "/explore",
    "/temples",
    "/ghats",
    "/food",
    "/stay",
    "/hidden",
    "/map",
    "/plan",
    "/community",
    "/ai-assistant",
    "/safety",
    "/feedback",
    "/profile",
    "/privacy-policy",
    "/terms-and-conditions",
    "/cookie-policy",
    "/disclaimer",
    "/community-guidelines",
    "/accessibility",
    "/contact",
  ];

  return routes.map((route) => {
    const isLegal = [
      "/privacy-policy",
      "/terms-and-conditions",
      "/cookie-policy",
      "/disclaimer",
      "/community-guidelines",
      "/accessibility",
      "/contact",
    ].includes(route);

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency:
        route === "" || route === "/community"
          ? "daily"
          : isLegal
          ? "monthly"
          : "weekly",
      priority:
        route === ""
          ? 1.0
          : route === "/explore"
          ? 0.9
          : isLegal
          ? 0.5
          : 0.8,
    };
  });
}
