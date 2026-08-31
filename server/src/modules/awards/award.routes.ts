import { FastifyInstance } from "fastify";
import container, { TYPES } from "../../container.js";
import { validateRequest } from "../../middleware/validateRequest.js";
import { authenticate } from "../../middleware/authenticate.js";
import { uploadSingle } from "../../middleware/upload.middleware.js";
import { AwardController } from "./award.controller.js";
import { createAwardSchema, updateAwardSchema } from "./award.validation.js";

export async function awardRoutes(app: FastifyInstance) {
  const controller = container.get<AwardController>(TYPES.AwardController);

  app.get("/", controller.list);
  app.get("/:id", controller.getById);

  app.post(
    "/",
    {
      preHandler: [
        authenticate as any,
        uploadSingle("imageUrl"),
        validateRequest({ body: createAwardSchema })
      ]
    },
    controller.create
  );

  app.patch(
    "/:id",
    {
      preHandler: [
        authenticate as any,
        uploadSingle("imageUrl"),
        validateRequest({ body: updateAwardSchema })
      ]
    },
    controller.update
  );

  app.delete("/:id", { preHandler: [authenticate as any] }, controller.delete);

  app.post(
    "/:id/image",
    { preHandler: [authenticate as any, uploadSingle("file")] },
    controller.uploadImage
  );
}
