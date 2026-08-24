import z from "zod";

export const createDeveloperSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  logo: z.string().url().optional(),
  website: z.string().url().optional()
});

export const updateDeveloperSchema = createDeveloperSchema.partial();
