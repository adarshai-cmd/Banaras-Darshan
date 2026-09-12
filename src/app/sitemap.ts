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
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/community" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/explore" ? 0.9 : 0.8,
  }));
}
