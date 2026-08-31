import z from "zod";

export const createAwardSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().optional(),
  year: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().int().min(1900).max(2100).optional()),
  imageUrl: z.string().optional(),
  isActive: z.preprocess((val) => (val === "true" || val === true), z.boolean().optional()),
  sortOrder: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().int().optional())
});

export const updateAwardSchema = createAwardSchema.partial();
