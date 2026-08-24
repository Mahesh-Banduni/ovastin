import { FastifyInstance } from "fastify";
import container, { TYPES } from "../../container.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";
import { ProfileController } from "./profile.controller.js";
import { updateProfileSchema, changePasswordSchema } from "./profile.validation.js";

export async function profileRoutes(app: FastifyInstance) {
  const controller = container.get<ProfileController>(TYPES.ProfileController);

  app.get("/me", { preHandler: [authenticate as any] }, controller.getMe);

  app.patch(
    "/me",
    {
      preHandler: [authenticate as any],
      preValidation: validateRequest({ body: updateProfileSchema })
    },
    controller.updateMe
  );

  app.patch(
    "/me/password",
    {
      preHandler: [authenticate as any],
      preValidation: validateRequest({ body: changePasswordSchema })
    },
    controller.changePassword
  );
}
