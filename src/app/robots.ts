import type { MetadataRoute } from "next";

const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "http://localhost:3000";

function getSiteUrl() {
  try {
    return new URL(rawSiteUrl);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export default function robots(): MetadataRoute.Robots {
  const site = getSiteUrl();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin", "/dashboard", "/perfil", "/run/"]
      }
    ],
    sitemap: `${site.origin}/sitemap.xml`,
    host: site.origin
  };
}
