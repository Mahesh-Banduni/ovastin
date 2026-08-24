import { injectable, inject } from "inversify";
import { PrismaService } from "../../utils/prismaService.js";
import { TYPES } from "../../types.js";

export interface CreateAwardData {
  name: string;
  description?: string;
  year?: number;
  imageUrl?: string;
  isActive?: boolean;
  sortOrder?: number;
}

export interface UpdateAwardData extends Partial<CreateAwardData> {}

@injectable()
export class AwardRepository {
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
      this.prisma.award.count({ where }),
      this.prisma.award.findMany({
        where, skip, take: pageSize,
        orderBy: [{ sortOrder: "asc" }, { year: "desc" }]
      })
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    return this.prisma.award.findUnique({ where: { id } });
  }

  async create(data: CreateAwardData) {
    return this.prisma.award.create({ data });
  }

  async update(id: string, data: UpdateAwardData) {
    return this.prisma.award.update({ where: { id }, data });
  }

  async delete(id: string) {
    return this.prisma.award.delete({ where: { id } });
  }
}
