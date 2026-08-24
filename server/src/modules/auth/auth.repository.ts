import {
  injectable,
  inject
} from "inversify";

import {
  PrismaService
} from "../../utils/prismaService";

import { TYPES } from "../../types";

@injectable()
export class AuthRepository {

  constructor(
    @inject(TYPES.PrismaService)
    private readonly prisma: PrismaService
  ) {}

  async findUserByEmail(
    email: string
  ) {
    return this.prisma.user.findUnique({
      where: {
        email: email.toLowerCase()
      }
    });
  }

  async findUserById(
    userId: string
  ) {
    return this.prisma.user.findUnique({
      where: {
        id: userId
      }
    });
  }

  async invalidateExistingOtps(
    userId: string
  ) {
    return this.prisma.passwordResetOtp.updateMany({
      where: {
        userId,
        usedAt: null
      },

      data: {
        usedAt: new Date()
      }
    });
  }

  async createPasswordResetOtp(
    userId: string,
    otpHash: string,
    expiresAt: Date
  ) {
    return this.prisma.passwordResetOtp.create({
      data: {
        userId,
        otpHash,
        expiresAt
      }
    });
  }

  async getLatestValidOtp(
    userId: string
  ) {
    return this.prisma.passwordResetOtp.findFirst({
      where: {
        userId,
        usedAt: null,
        expiresAt: {
          gt: new Date()
        }
      },

      orderBy: {
        createdAt: "desc"
      }
    });
  }

  async incrementOtpAttempts(
    otpId: string
  ) {
    return this.prisma.passwordResetOtp.update({
      where: {
        id: otpId
      },

      data: {
        attempts: {
          increment: 1
        }
      }
    });
  }

  async markOtpUsed(
    otpId: string
  ) {
    return this.prisma.passwordResetOtp.update({
      where: {
        id: otpId
      },

      data: {
        usedAt: new Date()
      }
    });
  }

  async updatePassword(
    userId: string,
    passwordHash: string
  ) {
    return this.prisma.user.update({
      where: {
        id: userId
      },

      data: {
        passwordHash
      }
    });
  }
}