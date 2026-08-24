import z from "zod";

export const createAmenitySchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  icon: z.string().optional()
});

export const updateAmenitySchema = createAmenitySchema.partial();
