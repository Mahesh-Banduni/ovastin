import { injectable, inject } from "inversify";
import { PrismaService } from "../../utils/prismaService.js";
import { TYPES } from "../../types.js";

export interface CreateServiceData {
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  coverImage?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateServiceData extends Partial<CreateServiceData> {}

@injectable()
export class ServiceRepository {
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
      this.prisma.service.count({ where }),
      this.prisma.service.findMany({
        where, skip, take: pageSize,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }]
      })
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    return this.prisma.service.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return this.prisma.service.findUnique({ where: { slug } });
  }

  async create(data: CreateServiceData) {
    return this.prisma.service.create({ data });
  }

  async update(id: string, data: UpdateServiceData) {
    return this.prisma.service.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.service.delete({ where: { id } });
  }
}
