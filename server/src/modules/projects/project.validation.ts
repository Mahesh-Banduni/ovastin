import z from "zod";
import { ProjectStatus, PropertyType } from "@prisma/client";

export const createProjectSchema = z.object({
  name: z.string().min(1).max(200),
  slug: z.string().min(1).max(200).optional(),
  status: z.nativeEnum(ProjectStatus).optional(),
  propertyType: z.nativeEnum(PropertyType),
  possessionDate: z.string().datetime().optional(),
  developerId: z.string().uuid().optional(),
  currency: z.string().max(10).optional(),
  priceMin: z.number().positive().optional(),
  priceMax: z.number().positive().optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  postalCode: z.string().max(20).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  description: z.string().optional(),
  coverImage: z.string().url().optional(),
  amenityIds: z.array(z.string().uuid()).optional()
});

export const updateProjectSchema = createProjectSchema.partial();

export const projectFiltersSchema = z.object({
  status: z.nativeEnum(ProjectStatus).optional(),
  propertyType: z.nativeEnum(PropertyType).optional(),
  city: z.string().optional(),
  developerId: z.string().uuid().optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(100).optional().default(10)
});

export const addImageSchema = z.object({
  imageUrl: z.string().url(),
  altText: z.string().optional(),
  sortOrder: z.number().int().optional()
});
