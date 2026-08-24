import { injectable, inject } from "inversify";
import { PrismaService } from "../../utils/prismaService.js";
import { TYPES } from "../../types.js";

@injectable()
export class ContactRepository {
  constructor(
    @inject(TYPES.PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async findMany(
    page: number = 1,
    pageSize: number = 10,
    isRead?: boolean
  ) {
    const where: any = {};
    if (isRead !== undefined) where.isRead = isRead;

    const skip = (page - 1) * pageSize;
    const [total, items] = await Promise.all([
      this.prisma.contactFormSubmission.count({ where }),
      this.prisma.contactFormSubmission.findMany({
        where, skip, take: pageSize,
        orderBy: { createdAt: "desc" }
      })
    ]);

    return { items, total, page, pageSize };
  }

  async findById(id: string) {
    return this.prisma.contactFormSubmission.findUnique({ where: { id } });
  }

  async create(data: {
    name: string;
    email: string;
    phone?: string;
    message: string;
  }) {
    return this.prisma.contactFormSubmission.create({ data });
  }

  async markRead(id: string) {
    return this.prisma.contactFormSubmission.update({
      where: { id },
      data: { isRead: true }
    });
  }

  async delete(id: string) {
    return this.prisma.contactFormSubmission.delete({ where: { id } });
  }
}
