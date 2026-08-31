import z from "zod";

export const createServiceSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  coverImage: z.string().optional(),
  isActive: z.preprocess((val) => (val === "true" || val === true), z.boolean().optional()),
  sortOrder: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().int().optional())
});

export const updateServiceSchema = createServiceSchema.partial();
