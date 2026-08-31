import z from "zod";

export const createDeveloperSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  logo: z.string().optional(),
  website: z.string().optional()
});

export const updateDeveloperSchema = createDeveloperSchema.partial();
