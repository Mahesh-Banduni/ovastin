import { FastifyInstance } from "fastify";

import container, { TYPES } from "../../container.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { AuthController } from "./auth.controller.js";
import { signinSchema, forgotPasswordSchema, resetPasswordSchema } from "./auth.validation.js";

export async function authRoutes(app: FastifyInstance) {
  const controller = container.get<AuthController>(
    TYPES.AuthController
  );

  app.post(
    "/signin",
    {
      preValidation: validateRequest({
        body: signinSchema
      })
    },
    controller.signin
  );

  app.post(
    "/forgot-password",
    {
      preValidation: validateRequest({
        body: forgotPasswordSchema
      })
    },
    controller.forgotPassword
  );

  app.post(
    "/reset-password",
    {
      preValidation: validateRequest({
        body: resetPasswordSchema
      })
    },
    controller.resetPassword
  );
}