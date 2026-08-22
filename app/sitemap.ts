import type { MetadataRoute } from "next";

import { siteUrl } from "@/lib/env";
import { getPublishedProjects } from "@/lib/projects";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getPublishedProjects();
  const now = new Date();

  const staticRoutes = ["", "/diensten", "/portfolio", "/over", "/contact"].map(
    (path) => ({
      url: `${siteUrl}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    }),
  );

  // Alleen gepubliceerde projecten; adminpagina's komen hier nooit in
  // omdat ze niet uit deze lijst worden opgebouwd.
  const projectRoutes = projects.map((project) => ({
    url: `${siteUrl}/portfolio/${project.slug}`,
    lastModified: project.updatedAt ? new Date(project.updatedAt) : now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes];
}
