import { injectable, inject } from "inversify";
import { PrismaService } from "../../utils/prismaService.js";
import { TYPES } from "../../types.js";

@injectable()
export class ProfileRepository {
  constructor(
    @inject(TYPES.PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: { select: { id: true, name: true } }
      }
    });
  }

  async update(id: string, data: { name?: string; email?: string }) {
    return this.prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        updatedAt: true
      }
    });
  }

  async updatePassword(id: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id },
      data: { passwordHash }
    });
  }

  async findByEmailWithPassword(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }
}
