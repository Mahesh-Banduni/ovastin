import z from "zod";

export const createAwardSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  year: z.number().int().min(1900).max(2100).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().optional()
});

export const updateAwardSchema = createAwardSchema.partial();
