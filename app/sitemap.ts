import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";
import { getPublishedProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();

  const staticRoutes = ["", "/diensten", "/portfolio", "/over", "/contact"].map((path) => ({
    url: `${siteUrl}${path}`,
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/portfolio/${project.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
