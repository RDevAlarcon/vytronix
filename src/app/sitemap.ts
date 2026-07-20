import type { MetadataRoute } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

function getOrigin() {
  try {
    return new URL(rawSiteUrl).origin;
  } catch {
    return "http://localhost:3000";
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getOrigin();
  const now = new Date();

  return [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/quienes-somos", changeFrequency: "monthly", priority: 0.8 },
    { path: "/proyectos", changeFrequency: "monthly", priority: 0.85 },
    { path: "/vyaudit", changeFrequency: "monthly", priority: 0.75 },
    { path: "/privacidad", changeFrequency: "yearly", priority: 0.25 },
    { path: "/terminos", changeFrequency: "yearly", priority: 0.25 },
  ].map((item) => ({
    url: `${origin}${item.path}`,
    lastModified: now,
    changeFrequency: item.changeFrequency as MetadataRoute.Sitemap[number]["changeFrequency"],
    priority: item.priority,
  }));
}
