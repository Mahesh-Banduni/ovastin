import {
  inject,
  injectable
} from "inversify";

import argon2 from "argon2";

import ApiError from "../../utils/ApiError";
import { generateOtp } from "../../utils/generateOtp";
import { TYPES } from "../../types";
import { AuthRepository } from "./auth.repository";
import { MailService } from "../../utils/mail";
import { JwtService } from "../../utils/jwtService";

@injectable()
export class AuthService {
  constructor(
    @inject(TYPES.AuthRepository)
    private readonly authRepository: AuthRepository,

    @inject(TYPES.MailService)
    private readonly mailService: MailService,

    @inject(TYPES.JwtService)
    private readonly jwtService: JwtService
  ) {}

  async signin(
    email: string,
    password: string
  ) {
    const user =
      await this.authRepository.findUserByEmail(
        email
      );

    if (!user) {
      throw new ApiError(
        401,
        "Invalid email or password"
      );
    }

    const passwordValid =
      await argon2.verify(
        user.passwordHash,
        password
      );

    if (!passwordValid) {
      throw new ApiError(
        401,
        "Invalid email or password"
      );
    }

    const accessToken =
      await this.jwtService.generateAccessToken({
        userId: user.id,
        email: user.email
      });

    return {
      accessToken,

      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };
  }

  async forgotPassword(
    email: string
  ) {
    const user =
      await this.authRepository.findUserByEmail(
        email
      );

    /*
     * Important:
     * Don't reveal whether an email exists.
     */
    if (!user) {
      return;
    }

    await this.authRepository
      .invalidateExistingOtps(user.id);

    const otp = generateOtp();

    const otpHash =
      await argon2.hash(otp);

    const expiresAt =
      new Date(
        Date.now() + 5 * 60 * 1000
      );

    await this.authRepository
      .createPasswordResetOtp(
        user.id,
        otpHash,
        expiresAt
      );

    await this.mailService
      .sendPasswordResetOtp(
        user.email,
        otp
      );
  }

  async resetPassword(
    email: string,
    otp: string,
    newPassword: string
  ) {
    const user =
      await this.authRepository.findUserByEmail(
        email
      );

    if (!user) {
      throw new ApiError(
        400,
        "Invalid or expired OTP"
      );
    }

    const resetOtp =
      await this.authRepository
        .getLatestValidOtp(user.id);

    if (!resetOtp) {
      throw new ApiError(
        400,
        "Invalid or expired OTP"
      );
    }

    if (resetOtp.attempts >= 5) {
      throw new ApiError(
        429,
        "Too many OTP attempts. Please request a new OTP."
      );
    }

    const otpValid =
      await argon2.verify(
        resetOtp.otpHash,
        otp
      );

    if (!otpValid) {
      await this.authRepository
        .incrementOtpAttempts(
          resetOtp.id
        );

      throw new ApiError(
        400,
        "Invalid or expired OTP"
      );
    }

    const passwordHash =
      await argon2.hash(newPassword);

    await this.authRepository
      .updatePassword(
        user.id,
        passwordHash
      );

    await this.authRepository
      .markOtpUsed(
        resetOtp.id
      );
  }
}