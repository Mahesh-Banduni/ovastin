import {
  injectable,
  inject
} from "inversify";

import { PrismaService } from "../../utils/prismaService.js";
import { TYPES } from "../../types.js";
import { ProjectStatus, PropertyType } from "@prisma/client";

export interface CreateProjectData {
  name: string;
  slug: string;
  status?: ProjectStatus;
  propertyType: PropertyType;
  possessionDate?: Date;
  developerId?: string;
  currency?: string;
  priceMin?: number;
  priceMax?: number;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  description?: string;
  coverImage?: string;
  file?: {
    buffer?: Buffer;
    originalname?: string;
  };
}

export interface UpdateProjectData extends Partial<CreateProjectData> {}

export interface ProjectFilters {
  status?: ProjectStatus;
  propertyType?: PropertyType;
  city?: string;
  developerId?: string;
  search?: string;
}

@injectable()
export class ProjectRepository {
  constructor(
    @inject(TYPES.PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async findMany(
    filters: ProjectFilters = {},
    page: number = 1,
    pageSize: number = 10
  ) {
    const where: any = {};

    if (filters.status) where.status = filters.status;
    if (filters.propertyType) where.propertyType = filters.propertyType;
    if (filters.city) where.city = { contains: filters.city, mode: "insensitive" };
    if (filters.developerId) where.developerId = filters.developerId;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { city: { contains: filters.search, mode: "insensitive" } }
      ];
    }

    const skip = (page - 1) * pageSize;

    const [total, items] = await Promise.all([
      this.prisma.project.count({ where }),
      this.prisma.project.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: "desc" },
        include: {
          developer: { select: { id: true, name: true } },
          amenities: { include: { amenity: true } },
          _count: { select: { gallery: true, amenities: true } }
        }
      })
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    return this.prisma.project.findUnique({
      where: { id },
      include: {
        developer: true,
        gallery: { orderBy: { sortOrder: "asc" } },
        amenities: { include: { amenity: true } }
      }
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.project.findUnique({ where: { slug } });
  }

async create(data: CreateProjectData) {
  const project = await this.prisma.project.create({
    data,
  });

  const projectImage = await this.prisma.projectImage.create({
    data: {
      projectId: project.id,
      imageUrl: data.coverImage || "",
      altText: project.name,
    }
  });

  return { project, projectImage };
}

  async update(id: string, data: UpdateProjectData) {
    return this.prisma.project.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.project.delete({ where: { id } });
  }

  async addImage(
    projectId: string,
    imageUrl: string,
    altText?: string,
    sortOrder?: number
  ) {
    return this.prisma.projectImage.create({
      data: {
        projectId,
        imageUrl,
        altText: altText ?? null,
        sortOrder: sortOrder ?? 0
      }
    });
  }

  async removeImage(imageId: string) {
    return this.prisma.projectImage.delete({ where: { id: imageId } });
  }

  async setAmenities(projectId: string, amenityIds: string[]) {
    await this.prisma.projectAmenity.deleteMany({ where: { projectId } });

    if (amenityIds.length > 0) {
      await this.prisma.projectAmenity.createMany({
        data: amenityIds.map((amenityId) => ({ projectId, amenityId }))
      });
    }
  }
}
