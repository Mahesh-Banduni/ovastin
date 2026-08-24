import { injectable, inject } from "inversify";
import { PrismaService } from "../../utils/prismaService.js";
import { TYPES } from "../../types.js";

export interface CreateAmenityData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
}

export interface UpdateAmenityData extends Partial<CreateAmenityData> {}

@injectable()
export class AmenityRepository {
  constructor(
    @inject(TYPES.PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async findMany(page: number = 1, pageSize: number = 10, search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [{ name: { contains: search, mode: "insensitive" } }];
    }

    const skip = (page - 1) * pageSize;
    const [total, items] = await Promise.all([
      this.prisma.amenity.count({ where }),
      this.prisma.amenity.findMany({
        where, skip, take: pageSize,
        orderBy: { name: "asc" },
        include: { _count: { select: { projects: true } } }
      })
    ]);

    return { items, total, page, pageSize };
  }

  async findAll() {
    return this.prisma.amenity.findMany({ orderBy: { name: "asc" } });
  }

  async findById(id: string) {
    return this.prisma.amenity.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.prisma.amenity.findUnique({ where: { slug } });
  }

  async create(data: CreateAmenityData) {
    return this.prisma.amenity.create({ data });
  }

  async update(id: string, data: UpdateAmenityData) {
    return this.prisma.amenity.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.amenity.delete({ where: { id } });
  }
}
