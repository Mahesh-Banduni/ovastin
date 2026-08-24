import {
  inject,
  injectable
} from "inversify";

import ApiResponse from "../../utils/ApiResponse";
import asyncHandler from "../../utils/AsyncHandler";
import { TYPES } from "../../types";
import { AuthService } from "./auth.service";

@injectable()
export class AuthController {
  constructor(
    @inject(TYPES.AuthService)
    private readonly authService: AuthService
  ) {}

  signin = asyncHandler(
    async (request, reply) => {
      const {
        email,
        password
      } = request.body as {
        email: string;
        password: string;
      };

      const result =
        await this.authService.signin(
          email,
          password
        );

      return reply.status(200).send(
        new ApiResponse(
          200,
          result,
          "Signin successful"
        )
      );
    }
  );

  forgotPassword = asyncHandler(
    async (request, reply) => {
      const { email } =
        request.body as {
          email: string;
        };

      await this.authService
        .forgotPassword(email);

      /*
       * Always return the same response.
       */
      return reply.status(200).send(
        new ApiResponse(
          200,
          null,
          "If an account exists with this email, a password reset OTP has been sent."
        )
      );
    }
  );

  resetPassword = asyncHandler(
    async (request, reply) => {
      const {
        email,
        otp,
        newPassword
      } = request.body as {
        email: string;
        otp: string;
        newPassword: string;
      };

      await this.authService
        .resetPassword(
          email,
          otp,
          newPassword
        );

      return reply.status(200).send(
        new ApiResponse(
          200,
          null,
          "Password reset successfully"
        )
      );
    }
  );
}