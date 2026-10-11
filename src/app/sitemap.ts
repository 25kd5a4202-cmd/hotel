import { MetadataRoute } from "next";
import prisma from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  let categories: { slug: string; updatedAt: Date }[] = [];
  try {
    categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true },
    });
  } catch {}

  const categoryEntries: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/menu?category=${cat.slug}`,
    lastModified: cat.updatedAt,
    changeFrequency: "daily",
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/menu`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/track`,
      lastModified: new Date(),
      changeFrequency: "always",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...categoryEntries,
  ];
}
