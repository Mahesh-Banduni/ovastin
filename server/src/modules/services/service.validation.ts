import z from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export const updateServiceSchema = createServiceSchema.partial();
