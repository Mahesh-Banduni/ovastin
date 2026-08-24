import { injectable, inject } from "inversify";
import { PrismaService } from "../../utils/prismaService.js";
import { TYPES } from "../../types.js";

export interface CreateDeveloperData {
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
}

export interface UpdateDeveloperData extends Partial<CreateDeveloperData> {}

@injectable()
export class DeveloperRepository {
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
      this.prisma.developer.count({ where }),
      this.prisma.developer.findMany({
        where, skip, take: pageSize,
        orderBy: { createdAt: "desc" },
        include: { _count: { select: { projects: true } } }
      })
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    return this.prisma.developer.findUnique({
      where: { id },
      include: { projects: { select: { id: true, name: true, status: true } } }
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.developer.findUnique({ where: { slug } });
  }

  async create(data: CreateDeveloperData) {
    return this.prisma.developer.create({ data });
  }

  async update(id: string, data: UpdateDeveloperData) {
    return this.prisma.developer.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.developer.delete({ where: { id } });
  }
}
