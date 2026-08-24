import { injectable, inject } from "inversify";
import argon2 from "argon2";
import ApiError from "../../utils/ApiError.js";
import { TYPES } from "../../types.js";
import { ProfileRepository } from "./profile.repository.js";

@injectable()
export class ProfileService {
  constructor(
    @inject(TYPES.ProfileRepository)
    private readonly profileRepository: ProfileRepository
  ) {}

  async getProfile(userId: string) {
    const profile = await this.profileRepository.findById(userId);
    if (!profile) throw new ApiError(404, "Profile not found");
    return profile;
  }

  async updateProfile(userId: string, data: { name?: string; email?: string }) {
    await this.getProfile(userId);
    return this.profileRepository.update(userId, data);
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    const user = await this.profileRepository.findByEmailWithPassword(
      (await this.getProfile(userId)).email
    );

    if (!user) throw new ApiError(404, "User not found");

    const valid = await argon2.verify(user.passwordHash, currentPassword);
    if (!valid) throw new ApiError(400, "Current password is incorrect");

    const passwordHash = await argon2.hash(newPassword);
    await this.profileRepository.updatePassword(userId, passwordHash);
  }
}
