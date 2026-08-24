import { injectable, inject } from "inversify";
import { TYPES } from "../../types.js";
import { ProfileService } from "./profile.service.js";
import ApiResponse from "../../utils/ApiResponse.js";
import asyncHandler from "../../utils/AsyncHandler.js";

@injectable()
export class ProfileController {
  constructor(
    @inject(TYPES.ProfileService)
    private readonly profileService: ProfileService
  ) {}

  getMe = asyncHandler(async (request, reply) => {
    const { userId } = (request as any).user;
    const profile = await this.profileService.getProfile(userId);
    return reply.status(200).send(new ApiResponse(200, profile, "Profile fetched"));
  });

  updateMe = asyncHandler(async (request, reply) => {
    const { userId } = (request as any).user;
    const profile = await this.profileService.updateProfile(userId, request.body as any);
    return reply.status(200).send(new ApiResponse(200, profile, "Profile updated"));
  });

  changePassword = asyncHandler(async (request, reply) => {
    const { userId } = (request as any).user;
    const { currentPassword, newPassword } = request.body as {
      currentPassword: string;
      newPassword: string;
    };

    await this.profileService.changePassword(userId, currentPassword, newPassword);
    return reply.status(200).send(new ApiResponse(200, null, "Password changed successfully"));
  });
}
