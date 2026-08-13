import { z } from "zod";

export const projectSchema = z.object({
  title: z.string().trim().min(2).max(120),
  slug: z
    .string()
    .trim()
    .min(2)
    .max(140)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  client: z.string().trim().min(2).max(120),
  shortDescription: z.string().trim().min(12).max(220),
  description: z.string().trim().min(20),
  category: z.string().trim().min(2).max(80),
  image: z.string().trim().min(1),
  additionalImages: z.array(z.string().trim()).max(10),
  liveUrl: z
    .string()
    .trim()
    .url()
    .refine((value) => value.startsWith("https://") || value.startsWith("http://"))
    .or(z.literal(""))
    .transform((value) => (value === "" ? null : value)),
  date: z.string().date(),
  featured: z.boolean(),
  published: z.boolean(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  companyName: z.string().trim().max(120),
  email: z.string().trim().email().max(160),
  message: z.string().trim().min(20).max(3000),
  website: z.string().optional(),
});
