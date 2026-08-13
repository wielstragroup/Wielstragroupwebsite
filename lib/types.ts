export type Project = {
  id: string;
  title: string;
  slug: string;
  client: string;
  shortDescription: string;
  description: string;
  category: string;
  image: string;
  additionalImages: string[];
  liveUrl: string | null;
  date: string;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectInput = Omit<Project, "id" | "createdAt" | "updatedAt">;
